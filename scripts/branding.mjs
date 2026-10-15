// Normalize imported marketing copy without changing upstream URLs, IDs, or COAs.
export function rebrandText(value) {
  if (typeof value !== 'string') return value
  return value
    .replace(/\bpure\s+health(?:\s+peptides)?(?:\s+LLC)?\b/gi, (name) => name === name.toUpperCase() ? 'PEPTALITH' : 'Peptalith')
    .replace(/\bpure\s+elite\b/gi, (name) => name === name.toUpperCase() ? 'PEPTALITH ELITE' : 'Peptalith Elite')
}
