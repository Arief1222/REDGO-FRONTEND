// src/app/chat/utils/clarify.ts

export type ClarifyOption = { label: string; text: string };

export type ClarifyData = {
  isClarify: boolean;
  question: string;
  options: ClarifyOption[];
};

export function parseClarifyBlock(text: string): ClarifyData {
  const match = text.match(/\[CLARIFY\]([\s\S]*?)\[\/CLARIFY\]/);
  if (!match) return { isClarify: false, question: '', options: [] };

  const inner = match[1].trim();
  const lines = inner.split('\n').map((l: string) => l.trim()).filter(Boolean);
  const question = lines[0] || '';
  const options: ClarifyOption[] = [];

  for (let i = 1; i < lines.length; i++) {
    const optMatch = lines[i].match(/^([A-D])\.\s+(.+)/);
    if (optMatch) options.push({ label: optMatch[1], text: optMatch[2] });
  }

  return { isClarify: true, question, options };
}