"use strict";

const assert = require("node:assert/strict");
const { test } = require("node:test");
const { signSession, verifySession } = require("../src/auth");

test("a signed session verifies to its account", () => {
  const token = signSession("acct_1", "secret-a");
  assert.equal(verifySession(token, "secret-a"), "acct_1");
});

test("a session signed with another secret is rejected", () => {
  const token = signSession("acct_1", "secret-a");
  assert.equal(verifySession(token, "secret-b"), null);
});

test("an expired session is rejected", () => {
  const token = signSession("acct_1", "secret-a", -10);
  assert.equal(verifySession(token, "secret-a"), null);
});

test("a missing token is rejected", () => {
  assert.equal(verifySession("", "secret-a"), null);
});
