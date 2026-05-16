import OpenAI from "openai";

type AiResult = {
  summary: string;
  actionItems: string[];
  suggestedTitle: string;
  provider: "openai" | "fallback";
};

function buildFallback(content: string): AiResult {
  const compact = content.replace(/\s+/g, " ").trim();
  const sentences = compact.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean);
  const summary = sentences.slice(0, 2).join(". ") || "No meaningful content to summarise yet.";
  const actionItems = content
    .split(/\n|\./)
    .map((line) => line.trim())
    .filter((line) => /^(todo|action|next step|follow up)/i.test(line))
    .map((line) => line.replace(/^(todo|action|next step|follow up)\s*[:\-]?\s*/i, ""))
    .slice(0, 5);

  const suggestedTitle =
    sentences[0]?.split(" ").slice(0, 6).join(" ").replace(/[^a-zA-Z0-9 ]/g, "") || "Structured note";

  return {
    summary,
    actionItems,
    suggestedTitle,
    provider: "fallback"
  };
}

export async function generateNoteIntel(content: string): Promise<AiResult> {
  if (!content.trim()) {
    return {
      summary: "Add some content to generate a useful summary.",
      actionItems: [],
      suggestedTitle: "Untitled note",
      provider: "fallback"
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return buildFallback(content);
  }

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  try {
    const response = await client.responses.create({
      model,
      input: [
        {
          role: "system",
          content:
            "You extract structured note intelligence. Return valid JSON with keys summary, actionItems, and suggestedTitle."
        },
        {
          role: "user",
          content: `Analyse this note:\n\n${content}`
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "note_intelligence",
          schema: {
            type: "object",
            properties: {
              summary: { type: "string" },
              actionItems: {
                type: "array",
                items: { type: "string" }
              },
              suggestedTitle: { type: "string" }
            },
            required: ["summary", "actionItems", "suggestedTitle"],
            additionalProperties: false
          }
        }
      }
    });

    const payload = response.output_text;
    const parsed = JSON.parse(payload) as Omit<AiResult, "provider">;

    return {
      ...parsed,
      provider: "openai"
    };
  } catch {
    return buildFallback(content);
  }
}
