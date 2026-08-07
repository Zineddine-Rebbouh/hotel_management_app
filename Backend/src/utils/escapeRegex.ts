/**
 * Escapes all special RegExp metacharacters in a user-supplied string,
 * preventing ReDoS (Regular Expression Denial of Service) attacks.
 *
 * Without escaping, an attacker can supply crafted input like
 * `(((((a+)+)+)+)` that causes exponential backtracking in the regex engine.
 *
 * @param str - Raw user input to be used inside a RegExp
 * @returns A string safe to pass to `new RegExp(...)` as a literal pattern
 */
export function escapeRegex(str: string): string {
  // Escapes: \ ^ $ . | ? * + ( ) [ ] { }
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Maximum allowed length for a search destination string.
 * Long strings with complex patterns can still cause performance issues
 * even after escaping; cap them early.
 */
export const MAX_DESTINATION_LENGTH = 100;
