"use strict";

var babelNames = /^_mithril\d*$/;

// Check if this is an invocation of m()
module.exports = function(node) {
    return node.type === "CallExpression" && (
        (node.callee.type === "Identifier" && node.callee.name === "m") ||
        (node.callee.type === "SequenceExpression" &&
         node.callee.expressions.length === 2 &&
         node.callee.expressions[1].type === "MemberExpression" &&
         node.callee.expressions[1].object.name.search(babelNames) > -1
        )
    );
};
