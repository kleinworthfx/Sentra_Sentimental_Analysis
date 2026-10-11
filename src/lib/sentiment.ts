import Sentiment from 'sentiment';
import { franc } from 'franc-min';
import Papa from 'papaparse';

export type Polarity = 'positive' | 'negative' | 'neutral';
export type Token = { text: string; score: number; sentiment: Polarity; kind: 'word' | 'emoji' };
export type Analysis = { id: string; text: string; sentiment: Polarity; score: number; wordScore: number; emojiScore: number; tokens: Token[]; date: string; source: string };
const engine = new Sentiment();
const emojiOverrides: Record<string, number> = { '😊': 3, '😀': 3, '😃': 3, '😍': 4, '🥰': 4, '❤️': 3, '❤': 3, '👍': 2, '🎉': 3, '🔥': 2, '💯': 3, '🤩': 4, '😂': 3, '😁': 3, '😎': 2, '🙌': 2, '😡': -4, '😠': -3, '😢': -3, '😭': -3, '😞': -3, '😔': -2, '👎': -2, '💔': -3, '🤬': -4, '🤮': -3, '😤': -2, '😐': 0, '😑': 0, '😶': 0, '🤔': 0, '🙃': 0, '💀': 0, '👀': 0, '🤷': 0 };
export const polarity = (score: number): Polarity => score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';

export function validateEnglish(text: string) {
  if (!text.trim()) throw new Error('Enter English text or an emoji to analyze.');
  if (text.length > 5000) throw new Error('Please keep each entry under 5,000 characters.');
  const letters = text.match(/\p{L}/gu) ?? [];
  if (letters.some(letter => !/[a-zA-Z]/.test(letter))) throw new Error('English only: please remove non-English words or characters. Emojis are welcome.');
  const words = text.toLowerCase().match(/[a-z]+/g) ?? [];
  const foreign = new Set(['bonjour', 'merci', 'hola', 'gracias', 'bagundi', 'chala', 'namaste', 'dhanyavad', 'hallo', 'danke', 'ciao', 'grazie', 'adios', 'amigo']);
  if (words.some(word => foreign.has(word))) throw new Error('English only: please translate your text into English before analyzing.');
  if (letters.length >= 25) {
    const detected = franc(text.replace(/[^a-zA-Z\s]/g, ''), { minLength: 25 });
    if (detected !== 'eng' && detected !== 'und') {
      const commonEnglish = /\b(the|this|that|is|are|was|were|it|my|with|have|very|and|not|love|great|good|bad)\b/i;
      if (!commonEnglish.test(text)) throw new Error('This text does not appear to be English. Please use English text or emojis.');
    }
  }
  if (!letters.length && !/\p{Extended_Pictographic}/u.test(text)) throw new Error('Enter a word or emoji, not just numbers or punctuation.');
}

export function analyzeText(text: string, source = 'Single analysis', date = new Date().toISOString()): Analysis {
  validateEnglish(text);
  const segments = new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(text);
  const emojis = Array.from(segments, item => item.segment).filter(item => /\p{Extended_Pictographic}/u.test(item));
  let cleanText = text;
  for (const emoji of emojis) cleanText = cleanText.replace(emoji, ' ');
  const result = engine.analyze(cleanText);
  const tokens: Token[] = result.calculation.flatMap(item => Object.entries(item).map(([word, score]) => ({ text: word, score, sentiment: polarity(score), kind: 'word' as const }))).reverse();
  for (const emoji of emojis) {
    const normalized = emoji.replace(/[\uFE0F\u{1F3FB}-\u{1F3FF}]/gu, '');
    const score = emojiOverrides[normalized] ?? engine.analyze(normalized).score;
    tokens.push({ text: emoji, score, sentiment: polarity(score), kind: 'emoji' });
  }
  const emojiScore = tokens.filter(t => t.kind === 'emoji').reduce((sum, t) => sum + t.score, 0);
  const score = result.score + emojiScore;
  return { id: globalThis.crypto.randomUUID(), text: text.trim(), sentiment: polarity(score), score, wordScore: result.score, emojiScore, tokens, date, source };
}

const samples = [
  'Absolutely love the new update! Everything feels so smooth 😊',
  'The support team was incredibly helpful. Thank you! 🙌',
  'Still waiting for my order. This is really frustrating 😡',
  'The package arrived on Tuesday. It contains two items.',
  'Amazing quality and great value for money! 😍',
  'The app keeps crashing. Terrible experience 👎',
  'Best purchase this year! Highly recommend ❤️',
  'I have a question about the delivery date 🤔',
  'Fast delivery and excellent customer service 🎉',
  'Disappointed with the quality. The item was broken 😢',
  'Just received the product. Will try it tomorrow 😐',
  'Wonderful experience, the team went above and beyond! 😊',
  'Really happy with how easy everything was 👍',
  'Awful support. Nobody replied to my message 😠',
  'The latest version is available for download.',
  'Beautiful design and fantastic performance 🤩',
  'Great service! I will definitely come back 💯',
  'Not good at all. I regret buying this 💔',
  'The store opens at nine on weekdays.',
  'A lovely product. My family loves it 🥰',
];
export function createDemo(): Analysis[] {
  return Array.from({ length: 120 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - Math.floor(i / 4)));
    date.setHours(9 + i % 9, i % 60, 0, 0);
    return analyzeText(samples[i % samples.length] ?? 'Good service', ['Product reviews', 'Customer feedback', 'Social media'][i % 3], date.toISOString());
  }).reverse();
}
export function summarize(rows: Analysis[]) {
  const counts = { positive: 0, negative: 0, neutral: 0 };
  rows.forEach(row => counts[row.sentiment]++);
  return { ...counts, total: rows.length, emojiCount: rows.filter(row => row.tokens.some(t => t.kind === 'emoji')).length, net: rows.length ? Math.round((counts.positive - counts.negative) / rows.length * 100) : 0 };
}
export function parseCsv(text: string) {
  const result = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: 'greedy', transformHeader: h => h.replace(/^\uFEFF/, '').trim() });
  if (result.errors.some(error => error.type === 'Quotes')) throw new Error('Could not read this CSV. Please check the file format.');
  const fields = result.meta.fields ?? [];
  if (!fields.length || !result.data.length) throw new Error('The file needs a header row and at least one text entry.');
  if (result.data.length > 2000) throw new Error('Please upload up to 2,000 rows per file.');
  return { fields, rows: result.data };
}
export function downloadFile(name: string, content: string, mime = 'text/plain') {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const link = document.createElement('a'); link.href = url; link.download = name; link.click(); URL.revokeObjectURL(url);
}
export function exportCsv(rows: Analysis[]) {
  downloadFile('sentra-sentiment-results.csv', Papa.unparse(rows.map(r => ({ text: r.text, sentiment: r.sentiment, score: r.score, word_score: r.wordScore, emoji_score: r.emojiScore, source: r.source, date: r.date })), { escapeFormulae: true }), 'text/csv;charset=utf-8;');
}