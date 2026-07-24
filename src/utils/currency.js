const currencyFormatter = new Intl.NumberFormat('en-LK', {
  style: 'currency',
  currency: 'LKR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0)
}
