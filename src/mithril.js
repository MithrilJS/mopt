"use strict";

var named = require("ast-types").namedTypes,
    
    callExpression = require("./call-expression"),
    
    babelNames = /^_mithril\d*$/;

// Check if this is an invocation of m()
exports.m = function(node) {
    var callee;
    
    if(!named.CallExpression.check(node)) {
        return false;
    }
    
    callee = node.callee;
    
    // m( ... )
    if(named.Identifier.check(callee) && callee.name === "m") {
        return true;
    }
    
    // babel-style (0, _mithril2["default"])( ... )
    return named.SequenceExpression.check(callee) &&
         callee.expressions.length === 2 &&
         named.MemberExpression.check(callee.expressions[1]) &&
         callee.expressions[1].object.name.search(babelNames) > -1;
};

// Is this an invocation of m.trust(...)?
exports.trust = callExpression.bind(null, "m", "trust");

// Is this an invocation of m.component(...)?
exports.component = callExpression.bind(null, "m", "component");
