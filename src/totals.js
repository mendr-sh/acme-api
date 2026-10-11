"use strict";

const _ = require("lodash");

// Totals invoice lines per currency, in minor units.
function totalsByCurrency(lines) {
  return _.mapValues(_.groupBy(lines, "currency"), (group) =>
    _.sumBy(group, (line) => line.quantity * line.unitAmount),
  );
}

module.exports = { totalsByCurrency };
