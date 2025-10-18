/**
 * Test suite for tellUtils functions
 */

import { isPlaceholderTell, getReadMoreUrl, getCommentsUrl } from './tellUtils';

/**
 * Test function to validate placeholder detection patterns
 */
export function testPlaceholderDetection() {
  console.log('Testing placeholder detection patterns...');
  
  // Test cases that SHOULD be detected as placeholders
  const placeholderIds = [
    'placeholder_1',
    'placeholder_brand_story',
    'PLACEHOLDER_TEST',
    'dummy_1',
    'dummy_brand',
    'DUMMY_TEST',
    'sample_tell',
    'SAMPLE_123',
    'test_data',
    'TEST_BRAND',
    'demo_content',
    'DEMO_STORY',
    'mock_tell',
    'MOCK_DATA',
    'fake_brand',
    'FAKE_STORY',
    'example_tell',
    'EXAMPLE_BRAND',
    'temp_data',
    'TEMP_STORY',
    'default_tell',
    'DEFAULT_BRAND',
    'preview_content',
    'PREVIEW_STORY',
    'staging_data',
    'STAGING_TELL',
    '1',
    '2',
    '123',
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    'lorem',
    'ipsum',
    'dolor',
    'sit',
    'amet',
    'LOREM',
    'brand_placeholder_story',
    'story_with_dummy_data',
    'contains_sample_content',
    'has_test_in_middle'
  ];
  
  // Test cases that should NOT be detected as placeholders
  const realIds = [
    'real_brand_story_123',
    'authentic_brand_tell',
    'genuine_customer_feedback',
    'actual_brand_experience',
    'true_story_about_brand',
    'brand-story-uuid-abc123',
    'customer-review-xyz789',
    'brand_experience_real',
    'actual_tell_content',
    'genuine_feedback_story'
  ];
  
  console.log('Testing placeholder IDs (should return true):');
  placeholderIds.forEach(id => {
    const result = isPlaceholderTell(id);
    console.log(`${id}: ${result} ${result ? '✓' : '✗'}`);
  });
  
  console.log('\nTesting real IDs (should return false):');
  realIds.forEach(id => {
    const result = isPlaceholderTell(id);
    console.log(`${id}: ${result} ${result ? '✗' : '✓'}`);
  });
}

/**
 * Test URL generation functions
 */
export function testUrlGeneration() {
  console.log('\nTesting URL generation...');
  
  // Test placeholder URLs
  console.log('Placeholder URLs:');
  console.log(`placeholder_1 read more: ${getReadMoreUrl('placeholder_1')}`);
  console.log(`placeholder_1 comments: ${getCommentsUrl('placeholder_1')}`);
  console.log(`dummy_brand read more: ${getReadMoreUrl('dummy_brand')}`);
  console.log(`dummy_brand comments: ${getCommentsUrl('dummy_brand')}`);
  
  // Test real URLs
  console.log('\nReal tell URLs:');
  console.log(`real_tell read more: ${getReadMoreUrl('real_tell', 'brand-story-slug')}`);
  console.log(`real_tell comments: ${getCommentsUrl('real_tell', 'brand-story-slug')}`);
  console.log(`another_real read more: ${getReadMoreUrl('another_real')}`);
  console.log(`another_real comments: ${getCommentsUrl('another_real')}`);
}

// Auto-run tests if this file is imported
if (typeof window !== 'undefined') {
  // Only run in browser environment
  setTimeout(() => {
    testPlaceholderDetection();
    testUrlGeneration();
  }, 1000);
}