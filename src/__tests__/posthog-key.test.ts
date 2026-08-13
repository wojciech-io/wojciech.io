import { describe, it, expect } from 'vitest';
import { isValidProjectKey } from '../utils/posthog';

/**
 * Production shipped with PUBLIC_POSTHOG_KEY set to the single character "-".
 *
 * Every signal a browser can show looked healthy: the SDK loaded from the EU
 * asset host, a distinct_id persisted in localStorage, sessions started, there
 * were no CSP violations, and every POST to /e/ returned 200 {"status":"Ok"},
 * because that endpoint accepts the payload and validates the key afterwards.
 * The events were discarded and the project stayed empty.
 *
 * The old guard was `if (!KEY) return`, and "-" is truthy. These cases pin the
 * shape of a real key so a placeholder cannot pass again.
 */
describe('PostHog project key validation', () => {
  it('accepts a real project key', () => {
    expect(isValidProjectKey('phc_abcdefghijklmnopqrstuvwxyz0123456789')).toBe(true);
  });

  it('tolerates surrounding whitespace, which env panels add by accident', () => {
    expect(isValidProjectKey('  phc_abcdefghijklmnopqrstuvwxyz0123  ')).toBe(true);
  });

  it.each([
    ['-', 'the value production actually shipped'],
    ['', 'empty string'],
    ['   ', 'whitespace only'],
    ['changeme', 'a word'],
    ['TODO', 'a placeholder'],
    ['phc_', 'prefix with no body'],
    ['phc_short', 'body too short to be a real key'],
    ['pha_abcdefghijklmnopqrstuvwxyz0123', 'wrong prefix'],
    ['phc_has-a-dash-in-the-body-abcdefghij', 'body is not alphanumeric'],
  ])('rejects %j (%s)', (value) => {
    expect(isValidProjectKey(value)).toBe(false);
  });

  it.each([undefined, null, 0, {}, []])('rejects the non-string %j', (value) => {
    expect(isValidProjectKey(value)).toBe(false);
  });
});
