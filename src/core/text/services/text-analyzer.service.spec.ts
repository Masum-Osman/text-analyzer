import { TextAnalyzerService } from './text-analyzer.service';

describe('TextAnalyzerService', () => {
  const service = new TextAnalyzerService();
  const input = 'The quick brown fox jumps over the lazy dog. The lazy dog slept in the sun.';

  it('should analyze basic metrics', () => {
    const result = service.analyze(input);
    expect(result.wordCount).toBe(16);
    expect(result.characterCount).toBe(58);
    expect(result.sentenceCount).toBe(2);
    expect(result.paragraphCount).toBe(1);
    expect(result.longestWords).toContain('quick');
    expect(result.longestWords).toContain('jumps');
  });
});
