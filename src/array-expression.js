"use strict";

var t   = require("babel-core").types,
    fns = [
        "concat",
        "filter",
        "join",
        "map",
        "reverse",
        "slice",
        "sort",
        "splice"
    ];

// Check if this is an invocation of an Array.prototype method on an array
module.exports = function(node) {
    debugger;
    
    return t.isCallExpression(node) &&
           t.isMemberExpression(node.callee) &&
           t.isArrayExpression(node.callee.object) &&
           t.isIdentifier(node.callee.property) &&
           fns.indexOf(node.callee.property.name) !== -1;
};
