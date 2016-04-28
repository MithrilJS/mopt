"use strict";

var safeArrayFns = [
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
    return node.type === "CallExpression" &&
           node.callee.type === "MemberExpression" &&
           node.callee.object.type === "ArrayExpression" &&
           node.callee.property.type === "Identifier" &&
           safeArrayFns.indexOf(node.callee.property.name) !== -1;
};
