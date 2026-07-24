const dateFormatter = new Intl.DateTimeFormat('en-LK', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function formatDateTime(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Unknown date' : dateFormatter.format(date)
}
