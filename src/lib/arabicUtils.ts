/**
 * Utility to normalize Arabic text by removing diacritics (Tashkeel)
 * and normalizing certain characters like Alif.
 */
export const normalizeArabic = (text: string): string => {
  if (!text) return '';

  return text
    // Remove diacritics (Tashkeel)
    .replace(/[\u064B-\u0652]/g, '')
    // Normalize Alif
    .replace(/[\u0622\u0623\u0625]/g, '\u0627')
    // Normalize Ya/Alef Maksura
    .replace(/[\u0649\u064A\u06CC]/g, '\u064A')
    // Normalize Teh Marbuta to Heh
    .replace(/\u0629/g, '\u0647')
    // Remove extra spaces
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Perform a search in Arabic text that is resistant to diacritics and Alif variants.
 */
export const arabicSearch = (haystack: string, needle: string): boolean => {
  if (!haystack || !needle) return false;
  
  const normalizedHaystack = normalizeArabic(haystack).toLowerCase();
  const normalizedNeedle = normalizeArabic(needle).toLowerCase();
  
  return normalizedHaystack.includes(normalizedNeedle);
};
