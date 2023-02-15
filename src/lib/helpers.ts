type Notation = Intl.NumberFormatOptions['notation']

const NUMBER_ABBREVIATION_LOOKUP = [
  { value: 1, symbol: '' },
  { value: 1e3, symbol: 'K' },
  { value: 1e6, symbol: 'M' },
  { value: 1e9, symbol: 'G' },
  { value: 1e12, symbol: 'T' },
  { value: 1e15, symbol: 'P' },
  { value: 1e18, symbol: 'E' },
]

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

export const abbreviateNumber = (value: number, digits = 1) => {
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  const item = NUMBER_ABBREVIATION_LOOKUP.slice()
    .reverse()
    .find((item) => value >= item.value)

  return item
    ? (value / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
    : '0'
}
