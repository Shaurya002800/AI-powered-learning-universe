import { clsx } from "clsx";

export function cn(...classes: Array<string | false | null | undefined>) {
  return clsx(classes);
}

export function titleFromContent(content: string) {
  const sentence = content
    .trim()
    .replace(/\s+/g, " ")
    .split(/[.!?\n]/)
    .find(Boolean);

  return sentence ? sentence.slice(0, 60) : "Untitled note";
}

export function normaliseTags(input: string[]) {
  return [...new Set(input.map((tag) => tag.trim().toLowerCase()).filter(Boolean))];
}

export function parseActionItems(input: string | null) {
  if (!input) {
    return [];
  }

  try {
    const parsed = JSON.parse(input);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
