"use strict";

const assert = require("node:assert/strict");
const { test } = require("node:test");
const { createApp } = require("../src/app");

const invoices = new Map([
  [
    "inv_1",
    {
      accountId: "acct_1",
      customerName: "Ada",
      id: "inv_1",
      lines: [{ currency: "USD", quantity: 2, unitAmount: 1500 }],
      number: "INV-1",
    },
  ],
]);

async function startApp(t) {
  const server = createApp({ invoices, secret: "test-secret" }).listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  t.after(() => server.close());
  return `http://127.0.0.1:${server.address().port}`;
}

async function signIn(base, accountId) {
  const response = await fetch(`${base}/sessions`, {
    body: JSON.stringify({ accountId }),
    headers: { "content-type": "application/json" },
    method: "POST",
  });
  return (await response.json()).token;
}

test("an account reads its own invoice with totals", async (t) => {
  const base = await startApp(t);
  const token = await signIn(base, "acct_1");
  const response = await fetch(`${base}/invoices/inv_1`, {
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).totals, { USD: 3000 });
});

test("another account cannot read the invoice", async (t) => {
  const base = await startApp(t);
  const token = await signIn(base, "acct_2");
  const response = await fetch(`${base}/invoices/inv_1`, {
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(response.status, 404);
});

test("requests without a session are rejected", async (t) => {
  const base = await startApp(t);
  const response = await fetch(`${base}/invoices/inv_1`);
  assert.equal(response.status, 401);
});

test("renders the invoice email", async (t) => {
  const base = await startApp(t);
  const token = await signIn(base, "acct_1");
  const response = await fetch(`${base}/invoices/inv_1/email`, {
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(response.status, 200);
  assert.match(await response.text(), /3000 USD/);
});
