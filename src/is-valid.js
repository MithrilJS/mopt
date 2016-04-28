"use strict";

var isMithril = require("./is-mithril"),
    arrayExpression = require("./array-expression"),
    stringExpression = require("./string-expression"),
    conditionalExpression = require("./conditional-expression"),
    
    safeTypes = [
        "ObjectExpression",
        "ArrayExpression",
        "Literal",
        "BinaryExpression"
    ];

// Test arguments
exports.arg = function(node) {
    // m(".fooga", [ .. ])
    // m(".fooga", { ... }, ...)
    // m(".fooga", "wooga")
    // m(".fooga", "wooga" + "booga")
    if(safeTypes.indexOf(node.type) > -1) {
        return true;
    }
    
    // m(".fooga", m(".booga"), ...)
    if(exports.mithril(node)) {
        return true;
    }
    
    // m(".fooga", [ ... ].map)
    if(arrayExpression(node)) {
        return true;
    }
    
    // m(".fooga", "foo".replace())
    if(stringExpression(node)) {
        return true;
    }
    
    // TODO: m(".fooga", foo ? "bar" : "baz")
    if(conditionalExpression(node)) {
        return true;
    }
    
    return false;
};

// Test to see if a node is a passable mithril invocation
exports.mithril = function(node) {
    // Table stakes: m()
    if(!isMithril(node)) {
        return false;
    }
    
    // We can only safely optimize static string selectors: m(".fooga.wooga")
    if(node.arguments[0].type !== "Literal") {
        return false;
    }
    
    // What should be allowed?
    // m(".fooga")
    if(node.arguments.length === 1) {
        return true;
    }
    
    return exports.arg(node.arguments[1]);
};
