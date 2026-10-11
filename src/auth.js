"use strict";

const jwt = require("jsonwebtoken");

const issuer = "acme-api";

// Signs a session token for a customer account.
function signSession(accountId, secret, ttlSeconds = 3600) {
  return jwt.sign({ sub: accountId }, secret, {
    algorithm: "HS256",
    expiresIn: ttlSeconds,
    issuer,
  });
}

// Returns the account id, or null when the token is missing, expired or forged.
function verifySession(token, secret) {
  if (!token) return null;
  try {
    const claims = jwt.verify(token, secret, { algorithms: ["HS256"], issuer });
    return claims.sub;
  } catch {
    return null;
  }
}

module.exports = { signSession, verifySession };
