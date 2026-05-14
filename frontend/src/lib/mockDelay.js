/**
 * Helper: mockDelay(ms) returns a Promise that resolves after ms milliseconds.
 * Used in all mock files to simulate real network behavior.
 *
 * @param {number} ms - Milliseconds to delay (default: 300)
 * @returns {Promise<void>}
 */
export function mockDelay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}