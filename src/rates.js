"use strict";

const fetch = require("node-fetch");

// Reads the exchange rate between two currencies from the rates service.
async function exchangeRate(baseUrl, from, to) {
  const response = await fetch(`${baseUrl}/rates/${from}/${to}`);
  if (!response.ok) throw new Error(`rates service answered ${response.status}`);
  const body = await response.json();
  return body.rate;
}

module.exports = { exchangeRate };
