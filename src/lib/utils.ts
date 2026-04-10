export function formatMoney(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B RWF`
  if (value >= 1_000_000)     return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M RWF`
  if (value >= 100_000)       return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K RWF`
  return `${value.toLocaleString()} RWF`
}
