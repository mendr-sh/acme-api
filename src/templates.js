"use strict";

const path = require("node:path");
const ejs = require("ejs");

const file = path.join(__dirname, "..", "templates", "invoice-email.ejs");

// Renders the invoice email. Customer text is escaped.
function renderInvoiceEmail(invoice) {
  return ejs.renderFile(file, { invoice });
}

module.exports = { renderInvoiceEmail };
