"use strict";

const assert = require("node:assert/strict");
const http = require("node:http");
const { test } = require("node:test");
const { exchangeRate } = require("../src/rates");

function ratesServer(handler) {
  return new Promise((resolve) => {
    const server = http.createServer(handler).listen(0, () => resolve(server));
  });
}

test("reads the rate from the rates service", async (t) => {
  const server = await ratesServer((req, res) => {
    assert.equal(req.url, "/rates/USD/EUR");
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ rate: 0.92 }));
  });
  t.after(() => server.close());
  const rate = await exchangeRate(`http://127.0.0.1:${server.address().port}`, "USD", "EUR");
  assert.equal(rate, 0.92);
});

test("fails when the rates service fails", async (t) => {
  const server = await ratesServer((req, res) => {
    res.statusCode = 503;
    res.end();
  });
  t.after(() => server.close());
  await assert.rejects(
    exchangeRate(`http://127.0.0.1:${server.address().port}`, "USD", "EUR"),
    /503/,
  );
});
