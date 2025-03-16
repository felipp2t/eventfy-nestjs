export const getFutureDate = (days: number): Date =>
  new Date(new Date().setDate(new Date().getDate() + days))
