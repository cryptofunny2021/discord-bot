type Notation = Intl.NumberFormatOptions['notation']

export const pluralize = (value: number) => (value === 1 ? '' : 's')

export const round = (
  value: number,
  decimals = 5,
  notation: Notation = 'standard'
) =>
  Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: decimals,
    notation,
    style: 'currency',
  })
    .format(value)
    .toLowerCase()
