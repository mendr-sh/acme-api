"use strict";

const assert = require("node:assert/strict");
const { test } = require("node:test");
const { totalsByCurrency } = require("../src/totals");

test("totals lines per currency in minor units", () => {
  const totals = totalsByCurrency([
    { currency: "USD", quantity: 2, unitAmount: 1500 },
    { currency: "USD", quantity: 1, unitAmount: 250 },
    { currency: "EUR", quantity: 3, unitAmount: 1000 },
  ]);
  assert.deepEqual(totals, { EUR: 3000, USD: 3250 });
});
