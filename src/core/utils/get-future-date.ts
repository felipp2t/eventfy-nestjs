export const getFutureDate = (days: number): number =>
  Math.floor(new Date().setDate(new Date().getDate() + days) / 1000)
