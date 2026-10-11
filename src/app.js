"use strict";

const express = require("express");
const { signSession, verifySession } = require("./auth");
const { renderInvoiceEmail } = require("./templates");
const { totalsByCurrency } = require("./totals");

function createApp({ secret, invoices }) {
  const app = express();
  app.use(express.json());

  app.get("/health", (req, res) => res.json({ ok: true }));

  app.post("/sessions", (req, res) => {
    const { accountId } = req.body ?? {};
    if (!accountId) return res.status(400).json({ error: "accountId is required" });
    return res.status(201).json({ token: signSession(accountId, secret) });
  });

  function requireAccount(req, res, next) {
    const token = (req.get("authorization") ?? "").replace(/^Bearer /, "");
    const accountId = verifySession(token, secret);
    if (!accountId) return res.status(401).json({ error: "sign in first" });
    req.accountId = accountId;
    return next();
  }

  app.get("/invoices/:id", requireAccount, (req, res) => {
    const invoice = invoices.get(req.params.id);
    if (!invoice || invoice.accountId !== req.accountId) {
      return res.status(404).json({ error: "not found" });
    }
    return res.json({ ...invoice, totals: totalsByCurrency(invoice.lines) });
  });

  app.get("/invoices/:id/email", requireAccount, async (req, res) => {
    const invoice = invoices.get(req.params.id);
    if (!invoice || invoice.accountId !== req.accountId) {
      return res.status(404).json({ error: "not found" });
    }
    const totals = totalsByCurrency(invoice.lines);
    const html = await renderInvoiceEmail({
      ...invoice,
      currency: invoice.lines[0].currency,
      total: totals[invoice.lines[0].currency],
    });
    return res.type("html").send(html);
  });

  return app;
}

module.exports = { createApp };
