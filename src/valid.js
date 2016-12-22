"use strict";

var match = require("./match.js");

exports.isText = (node) =>
    match(node, {
        type : /StringLiteral|NumericLiteral|BooleanLiteral/
    });

exports.isTextArray = (node) =>
    match(node, {
        type     : "ArrayExpression",
        elements : [
            exports.isText
        ]
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
    exports.isText(node) ||
    exports.isTextArray(node);

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
    var start = 1;

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
    if(exports.isAttributes(node.arguments[1])) {
        start = 2;
    }
    
    // m("...", "...")
    // m("...", [...])
    // m("...", {...}, "...")
    // m("...", {...}, [...])
    // m("...", {...}, "...", ...)
    return exports.isChildren(node.arguments.slice(start));
};
