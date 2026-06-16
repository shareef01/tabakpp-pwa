/**
 * TABAK++ High-Fidelity AppSec Utilities
 * Enforcing strict sanitization and validation for full-stack data integrity.
 */

/**
 * Sanitizes user-generated strings to prevent XSS and NoSQL injection patterns.
 * Legacy support for 'sanitizeString' alias.
 * @param {string} str - Raw input
 * @returns {string} Sanitized output
 */
export const sanitizeInput = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // Strips HTML tags
    .replace(/\$/g, '﹩') // Neutralizes NoSQL operator characters
    .trim()
    .substring(0, 100); // Enforce reasonable length limits
};

export const sanitizeString = sanitizeInput;

/**
 * Validates numeric inputs to ensure they are within safe architectural bounds.
 * @param {number|string} val - Raw value
 * @param {number} min - Minimum allowed
 * @param {number} max - Maximum allowed
 * @returns {number} Validated number
 */
export const validateNumeric = (val, min = 0, max = 1000) => {
  const n = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(n)) return min;
  return Math.min(Math.max(n, min), max);
};
