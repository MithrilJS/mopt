"use strict";

var n   = require("recast").types.namedTypes,
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
    return n.CallExpression.check(node) &&
           n.MemberExpression.check(node.callee) &&
           n.ArrayExpression.check(node.callee.object) &&
           n.Identifier.check(node.callee.property) &&
           fns.indexOf(node.callee.property.name) !== -1;
};
