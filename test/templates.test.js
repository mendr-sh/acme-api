"use strict";

const assert = require("node:assert/strict");
const { test } = require("node:test");
const { renderInvoiceEmail } = require("../src/templates");

test("renders the invoice email with the total", async () => {
  const html = await renderInvoiceEmail({
    currency: "USD",
    customerName: "Ada",
    number: "INV-7",
    total: 3250,
  });
  assert.match(html, /Invoice INV-7/);
  assert.match(html, /3250 USD/);
});

test("escapes customer text", async () => {
  const html = await renderInvoiceEmail({
    currency: "USD",
    customerName: "<script>alert(1)</script>",
    number: "INV-8",
    total: 1,
  });
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
});
