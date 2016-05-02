"use strict";

var callExpression = require("./call-expression"),
    
    babelNames = /^_mithril\d*$/;

// Check if this is an invocation of m()
exports.m = function(node) {
    if(node.type !== "CallExpression") {
        return false;
    }
    
    // m( ... )
    if(node.callee.type === "Identifier" && node.callee.name === "m") {
        return true;
    }
    
    // babel-style (0, _mithril2["default"])( ... )
    return node.callee.type === "SequenceExpression" &&
         node.callee.expressions.length === 2 &&
         node.callee.expressions[1].type === "MemberExpression" &&
         node.callee.expressions[1].object.name.search(babelNames) > -1;
};

// Is this an invocation of m.trust(...)?
exports.trust = callExpression.bind(null, "m", "trust");

// Is this an invocation of m.component(...)?
exports.component = callExpression.bind(null, "m", "component");
