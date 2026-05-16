import { titleFromContent } from "@/lib/utils";

export function buildTitle(title: string | undefined, content: string) {
  const cleaned = title?.trim();
  return cleaned || titleFromContent(content);
}
