export const pluralize = (value: number) => (value === 1 ? '' : 's')

export const round = (value: number, decimals = 5) =>
  Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: decimals,
    style: 'currency',
  }).format(value)
