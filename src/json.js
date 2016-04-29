"use strict";

var callExpression = require("./call-expression");

exports.stringify = callExpression.bind(null, "JSON", "stringify");
