import test from 'node:test';
import assert from 'node:assert/strict';
import { parseContact } from '../lib/contact.ts';

const valid = { email: ' Developer@Company.dev ', name: '  Developer  ', topic: 'Product idea', message: 'Please help us improve local reviews.' };
test('accepts company emails and normalizes surrounding whitespace', () => {
  const result = parseContact(valid);
  assert.deepEqual(result.value, { ...valid, email: 'developer@company.dev', name: 'Developer' });
});
test('accepts an optional name and multiline context', () => {
  const result = parseContact({ ...valid, name: undefined, message: 'First step\nSecond step' });
  assert.equal(result.value.name, '');
  assert.equal(result.value.message, 'First step\nSecond step');
});
test('rejects malformed or excessive email addresses', () => {
  for (const email of ['name@gmail', 'a@@company.dev', 'a b@company.dev', '', 'a'.repeat(250) + '@company.dev', 123]) assert.ok(parseContact({ ...valid, email }).error);
});
test('rejects unknown topics and invalid message lengths', () => {
  for (const topic of ['Invalid', '', null]) assert.ok(parseContact({ ...valid, topic }).error);
  for (const message of ['', 'short', ' '.repeat(20), 'x'.repeat(4001), {}]) assert.ok(parseContact({ ...valid, message }).error);
  assert.ok(parseContact({ ...valid, name: 'x'.repeat(101) }).error);
});
test('accepts boundary message lengths', () => {
  assert.ok(parseContact({ ...valid, message: 'x'.repeat(10) }).value);
  assert.ok(parseContact({ ...valid, message: 'x'.repeat(4000) }).value);
});
