import assert from 'node:assert/strict'
import test from 'node:test'
import type { HandlerContext, HandlerEvent } from '@netlify/functions'
import { databaseEnv } from '../netlify/functions/_shared/env.js'
import { handler as deleteAccount } from '../netlify/functions/account-delete.js'

const database = {
  SITE_URL: 'https://www.peptalith.com',
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'server-only-test-key-with-at-least-thirty-characters',
}

test('database configuration requires its own credentials without payment settings', () => {
  assert.deepEqual(databaseEnv(database), database)
  assert.throws(() => databaseEnv({ ...database, SUPABASE_SERVICE_ROLE_KEY: undefined }))
  assert.throws(() => databaseEnv({ ...database, SUPABASE_URL: 'invalid' }))
})

test('account deletion enforces authentication and origin without Stripe or WooCommerce', async (t) => {
  const names = [...Object.keys(database), 'STRIPE_SECRET_KEY', 'WOOCOMMERCE_URL', 'WC_CONSUMER_KEY', 'WC_CONSUMER_SECRET', 'MONITORING_WEBHOOK_URL']
  const previous = Object.fromEntries(names.map((name) => [name, process.env[name]]))
  t.mock.method(globalThis, 'fetch', async () => { throw new Error('Unauthenticated requests must not reach the database') })
  try {
    for (const name of names) delete process.env[name]
    Object.assign(process.env, database)
    const event: HandlerEvent = {
      rawUrl: `${database.SITE_URL}/api/account/delete-request`,
      rawQuery: '',
      path: '/api/account/delete-request',
      httpMethod: 'POST',
      headers: { origin: database.SITE_URL, 'content-type': 'application/json' },
      multiValueHeaders: {},
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      isBase64Encoded: false,
      body: JSON.stringify({ confirmation: 'DELETE' }),
    }
    const response = await deleteAccount(event, {} as HandlerContext, () => {})
    assert.ok(response)
    assert.equal(response.statusCode, 401)
    assert.equal(JSON.parse(response.body!).code, 'authentication_required')
    const foreign = await deleteAccount({ ...event, headers: { ...event.headers, origin: 'https://other.example' } }, {} as HandlerContext, () => {})
    assert.ok(foreign)
    assert.equal(foreign.statusCode, 403)
  } finally {
    for (const [name, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[name]
      else process.env[name] = value
    }
  }
})
