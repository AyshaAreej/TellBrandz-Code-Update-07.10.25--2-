/**
 * Utility functions for tell-related operations
 */

/**
 * Checks if a tell ID represents placeholder/dummy data
 * @param tellId - The ID to check
 * @returns true if it's placeholder data, false otherwise
 */
export function isPlaceholderTell(tellId: string): boolean {
  // Check for common placeholder patterns
  const placeholderPatterns = [
    /^placeholder_/i,
    /^dummy_/i,
    /^sample_/i,
    /^test_/i,
    /^demo_/i,
    /^mock_/i,
    /^fake_/i,
    /^example_/i,
    /^[0-9]+$/,  // Simple numeric IDs (1, 2, 3, etc.)
    /^temp_/i,
    /^default_/i,
    /^preview_/i,
    /^staging_/i,
    // UUID-like patterns that are commonly used for placeholders
    /^00000000-0000-0000-0000-000000000000$/,
    /^11111111-1111-1111-1111-111111111111$/,
    /^xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx$/i,
    // Common placeholder strings
    /^(lorem|ipsum|dolor|sit|amet)$/i,
    // Patterns with "placeholder" anywhere in the string
    /placeholder/i,
    /dummy/i,
    /sample/i,
    /test/i
  ];
  
  return placeholderPatterns.some(pattern => pattern.test(tellId));
}

/**
 * Gets the appropriate "Read More" URL based on tell type
 * @param tellId - The tell ID
 * @param tellSlug - The tell slug for real tells
 * @returns URL string
 */
export function getReadMoreUrl(tellId: string, tellSlug?: string): string {
  if (isPlaceholderTell(tellId)) {
    return '/how-it-works#dummy-tell';
  }
  
  return tellSlug ? `/tell/${tellSlug}` : `/tell/${tellId}`;
}

/**
 * Gets the appropriate comments URL based on tell type
 * @param tellId - The tell ID
 * @param tellSlug - The tell slug for real tells
 * @returns URL string or null for placeholder tells
 */
export function getCommentsUrl(tellId: string, tellSlug?: string): string | null {
  if (isPlaceholderTell(tellId)) {
    return null; // Will trigger modal instead
  }
  
  const baseUrl = tellSlug ? `/tell/${tellSlug}` : `/tell/${tellId}`;
  return `${baseUrl}#comments`;
}