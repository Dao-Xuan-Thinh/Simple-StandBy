/** Minimal nanoid-like ID generator (no extra dependency needed) */
export const nanoid = (len = 10) =>
  Array.from(crypto.getRandomValues(new Uint8Array(len)))
    .map((b) => (b % 36).toString(36))
    .join('')
