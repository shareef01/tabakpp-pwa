/**
 * TABAK++ Error Management
 * Standardized wrappers for asynchronous operations.
 */

/**
 * Executes an async operation with a standardized error boundary.
 * @param {Function} asyncFn - The async operation to execute
 * @param {string} errorContext - Contextual name for logging
 * @returns {Promise<any>}
 */
export const safeAsync = async (asyncFn, errorContext = 'API_OPERATION') => {
  try {
    return await asyncFn();
  } catch (error) {
    console.error(`[${errorContext}_FAILURE]:`, error);
    throw error;
  }
};
