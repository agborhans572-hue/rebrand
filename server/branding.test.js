import assert from 'node:assert/strict'
import test from 'node:test'
import { rebrandText } from '../scripts/branding.mjs'

test('imported storefront copy uses Peptalith while preserving upstream references', () => {
  assert.equal(rebrandText('Pure Health\n Peptides LLC and PURE ELITE ACCESS'), 'Peptalith and PEPTALITH ELITE ACCESS')
  const source = '<a href="https://purehealthpeptides.com/coa.pdf">Pure Health COA Library</a>'
  assert.equal(rebrandText(source), '<a href="https://purehealthpeptides.com/coa.pdf">Peptalith COA Library</a>')
  assert.equal(rebrandText('Modular Peptide System B – Pure Peptide Gel'), 'Modular Peptide System B – Pure Peptide Gel')
  assert.equal(rebrandText(undefined), undefined)
})
