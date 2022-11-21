export const pluralize = (value: number) => (value === 1 ? '' : 's')

export const round = (value: number) =>
  Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: 5,
    style: 'currency',
  }).format(value)
