"use strict";

const { createApp } = require("./app");

const app = createApp({
  invoices: new Map(),
  secret: process.env.SESSION_SECRET ?? "development-only-secret",
});
const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => console.log(`acme-api listening on ${port}`));
