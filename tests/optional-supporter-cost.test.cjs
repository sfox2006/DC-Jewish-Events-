const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const code = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
test('free admission with optional supporter tickets matches Free without treating mixed or unknown prices as free', () => {
  const ctx = vm.createContext({ fieldText: value => String(value || '').trim() });
  vm.runInContext(code.slice(code.indexOf('  function costKind('), code.indexOf('  function costShort(')), ctx);
  const event = require('../data/events.json').events.find(event => event.id === 'cjm-family-day-photography-2026-11-08');
  assert(event);
  assert.equal(ctx.matchesCost(event, 'free'), true);
  assert.equal(ctx.matchesCost(event, 'paid'), false);
  assert.equal(ctx.costKind('Unknown'), 'unknown');
  assert.equal(ctx.costKind('Free-$5.72'), 'paid');
  assert.equal(ctx.costKind('Service free; dinner $18 subsidized / $45, plus applicable fees'), 'paid');
  assert.equal(ctx.costKind('$18'), 'paid');
});
