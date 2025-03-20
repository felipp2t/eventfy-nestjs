export const getFutureDate = (days: number): number =>
  Math.floor((Date.now() + days * 24 * 60 * 60 * 1000) / 1000)

