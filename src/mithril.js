"use strict";

var t = require("babel-core").types,
    
    callExpression = require("./call-expression");

// m( ... )
exports.m = function(node) {
    return t.isCallExpression(node) && t.isIdentifier(node.callee, { name : "m" });
};

// m.trust(...)
exports.trust = callExpression.bind(null, "m", "trust");

// m.component(...)
exports.component = callExpression.bind(null, "m", "component");
