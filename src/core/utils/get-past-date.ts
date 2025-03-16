export const getPastDate = (days: number): Date =>
  new Date(new Date().setDate(new Date().getDate() - days))
