/**
 * Clean component text by removing unnecessary words from descriptions and names.
 * Removes: "Электроэлемент", "Original"/"original", year indicators (15+, 21+, 22+, 23+, 24+, 25+)
 */
export function cleanComponentText(text: string | null | undefined): string {
  if (!text) return '';
  
  let cleaned = text;
  
  // Remove "Электроэлемент" word (with surrounding whitespace)
  cleaned = cleaned.replace(/\s*Электроэлемент\s*/g, ' ');
  
  // Remove "Original" or "original" as standalone word
  cleaned = cleaned.replace(/\s*[Oo]riginal\s*/g, ' ');
  
  // Remove year patterns: "15+", "21+", "22+", "23+", "24+", "25+" etc.
  // Pattern: digits followed by +, as standalone tokens or at end of string
  cleaned = cleaned.replace(/\s+\d{2}\+\s*/g, ' ');
  // Also at the end of string
  cleaned = cleaned.replace(/\s*\d{2}\+\s*$/g, '');
  // Handle patterns like "18-24+" (range with +)  
  cleaned = cleaned.replace(/\s*\d{2}-\d{2}\+\s*/g, ' ');
  
  // Clean up extra spaces, commas, dashes
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  cleaned = cleaned.replace(/^[\s,;\u2014-]+|[\s,;\u2014-]+$/g, '').trim();
  
  return cleaned;
}
