"use strict";

var match = require("./match.js");

exports.isText = (node) =>
    match(node, {
        type : (val) => val === "StringLiteral" || val === "NumericLiteral" || val === "BooleanLiteral"
    });

// m(...)
exports.isM = (node) =>
    match(node, {
        type   : "CallExpression",
        callee : {
            name : "m"
        }
    });

// Is this a valid child node that we understand?
// TODO: add support for single-item arrays
exports.isChild = (node) =>
    exports.isText(node) || false;

// Are these valid children nodes that we understand?
exports.isChildren = (nodes) =>
    nodes.every(exports.isChild);

// Is this node an attributes object?
exports.isAttributes = (node) =>
    match(node, {
        type : "ObjectExpression"
    });

// Is this node a mithril invocation?
exports.isMithril = (node) => {
    // m(...)
    if(!exports.isM(node)) {
        return false;
    }
    
    // m("...")
    if(!match(node.arguments[0], { type : "StringLiteral" })) {
        return false;
    }
    
    // m("...")
    if(node.arguments.length === 1) {
        return true;
    }
    
    // m("...", {...} )
    // m("...", "test")
    // TODO: m("...", [...])
    return exports.isAttributes(node.arguments[1]) || exports.isChild(node.arguments[1]);
};
