import { describe, expect, it } from 'vitest';
import { analyzeText, parseCsv } from '@/lib/sentiment';

describe('English sentiment requirements', () => {
  it('classifies good English words as positive', () => expect(analyzeText('Amazing wonderful service').sentiment).toBe('positive'));
  it('classifies bad English words as negative', () => expect(analyzeText('Terrible awful service').sentiment).toBe('negative'));
  it('classifies factual English words as neutral', () => expect(analyzeText('The package arrived on Tuesday.').sentiment).toBe('neutral'));
  it('classifies a good emoji as positive', () => expect(analyzeText('😊').sentiment).toBe('positive'));
  it('classifies a bad emoji as negative', () => expect(analyzeText('😡').sentiment).toBe('negative'));
  it('classifies a neutral emoji as neutral', () => expect(analyzeText('😐').sentiment).toBe('neutral'));
  it('recognizes emojis next to words', () => expect(analyzeText('terrible😍').emojiScore).toBe(4));
  it('recognizes skin tone modifiers', () => expect(analyzeText('👍🏽').sentiment).toBe('positive'));
  it('keeps word and emoji scores separate', () => { const r = analyzeText('great 😡'); expect(r.wordScore).toBe(3); expect(r.emojiScore).toBe(-4); expect(r.score).toBe(-1); });
  it('supports English negation', () => expect(analyzeText('not good').sentiment).toBe('negative'));
  it('rejects Hindi', () => expect(() => analyzeText('बहुत अच्छा')).toThrow('English only'));
  it('rejects Telugu', () => expect(() => analyzeText('చాలా బాగుంది')).toThrow('English only'));
  it('rejects a non-English Latin-script greeting', () => expect(() => analyzeText('bonjour merci')).toThrow('English only'));
  it('rejects blank input', () => expect(() => analyzeText('  ')).toThrow());
  it('reads quoted CSV text with commas', () => expect(parseCsv('text\n"Good, excellent!"').rows[0]?.['text']).toBe('Good, excellent!'));
});