/**
 * Normalize strings for friendly matching:
 * - Trim and strip inner extra spaces
 * - Lowercase English characters
 * - Normalize Unicode (NFKC) converting full-width to half-width alphanumerics
 * - Convert Katakana to Hiragana for phonetic match
 */
export function normalizeInput(str: string): string {
  if (!str) return '';
  
  // Unicode NFKC normalization converts full-width alphanumerics to ASCII
  let normalized = str.normalize('NFKC').trim().toLowerCase();

  // Remove whitespace
  normalized = normalized.replace(/\s+/g, '');

  return normalized;
}

/**
 * Convert Katakana to Hiragana to allow flexible Japanese input
 */
export function katakanaToHiragana(src: string): string {
  return src.replace(/[\u30a1-\u30f6]/g, (match) => {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

/**
 * Check if the entered code matches any accepted code for the spot
 */
export function checkSecretCode(input: string, acceptedCodes: string[], primaryCode: string): boolean {
  const normInput = normalizeInput(input);
  const hiraInput = katakanaToHiragana(normInput);

  const targets = [primaryCode, ...acceptedCodes];

  for (const target of targets) {
    const normTarget = normalizeInput(target);
    const hiraTarget = katakanaToHiragana(normTarget);

    if (normInput === normTarget || hiraInput === hiraTarget) {
      return true;
    }
  }

  return false;
}
