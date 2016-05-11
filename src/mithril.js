"use strict";

var t = require("babel-core").types,
    
    callExpression = require("./call-expression");

// Check if this is an invocation of m()
exports.m = function(node) {
    var callee;
    
    if(!t.isCallExpression(node)) {
        return false;
    }
    
    callee = node.callee;
    
    // m( ... )
    return t.isIdentifier(callee, { name : "m" });
};

// Is this an invocation of m.trust(...)?
exports.trust = callExpression.bind(null, "m", "trust");

// Is this an invocation of m.component(...)?
exports.component = callExpression.bind(null, "m", "component");
