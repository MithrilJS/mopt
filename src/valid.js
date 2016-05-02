"use strict";

var mithril = require("./mithril"),
    
    json = require("./json"),
    
    arrayExpression       = require("./array-expression"),
    stringExpression      = require("./string-expression"),
    conditionalExpression = require("./conditional-expression"),
    
    childrenTypes = [
        "ArrayExpression",
        "BinaryExpression",
        "Literal"
    ];

exports.children = function(node) {
    // m(".fooga", [ ... ])
    // m(".fooga", "wooga")
    // m(".fooga", "wooga" + "booga")
    if(childrenTypes.indexOf(node.type) > -1) {
        return true;
    }
    
    // m(".fooga", m(".booga"), ...)
    if(mithril.m(node)) {
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
    
    // m(".fooga", foo ? "bar" : "baz")
    if(conditionalExpression(node)) {
        return true;
    }
    
    // m(".fooga", m.trust("<div>"))
    if(mithril.trust(node)) {
        return true;
    }
    
    // m(".fooga", m.component(thing))
    if(mithril.component(node)) {
        return true;
    }
    
    // m(".fooga", JSON.stringify({}))
    if(json.stringify(node)) {
        return true;
    }
    
    return false;
};

// Test arguments
exports.arg = function(node) {
    // m(".fooga", { ... })
    if(node.type === "ObjectExpression") {
        return true;
    }
    
    return exports.children(node);
};

// Test to see if a node is a passable mithril invocation
exports.mithril = function(node) {
    // Table stakes: m()
    if(!mithril.m(node)) {
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
