"use strict";

var t = require("babel-core").types,
    
    mithril = require("./mithril"),
    
    json = require("./json"),
    
    childrenTypes = [
        "ArrayExpression",
        "BinaryExpression",
        "StringLiteral",
        "NumberLiteral",
        "BooleanLiteral"
    ],
    
    safeStrings = [
        "fromCharCode",
        "fromCodePoint",
        "charAt",
        "charCodeAt",
        "codePointAt",
        "concat",
        "normalize",
        "repeat",
        "replace",
        "slice",
        "substr",
        "substring",
        "toLocaleLowerCase",
        "toLocaleUpperCase",
        "toLowerCase",
        "toString",
        "toUpperCase",
        "trim",
        "trimLeft",
        "trimRight",
        "valueOf"
    ],
    
    safeArrays = [
        "concat",
        "copyWithin",
        "filter",
        "join",
        "map",
        "reverse",
        "slice",
        "sort",
        "splice"
    ];
    
// Check if this is an invocation of an Array.prototype method on an array
exports.arrayExpression = function(node) {
    if(!t.isCallExpression(node) ||
       !t.isMemberExpression(node.callee) ||
       !t.isArrayExpression(node.callee.object)
    ) {
        return false;
    }
    
    if(t.isIdentifier(node.callee.property) &&
       safeArrays.indexOf(node.callee.property.name) !== -1
    ) {
        return true;
    }
    
    return t.isStringLiteral(node.callee.property) &&
        safeArrays.indexOf(node.callee.property.value) !== -1;
};

// Check if this is an invocation of a String.prototype method on a string
exports.stringExpression = function(node) {
    return t.isCallExpression(node) &&
           t.isMemberExpression(node.callee) &&
           t.isStringLiteral(node.callee.object) &&
           safeStrings.indexOf(node.callee.property.name) !== -1;
};

// Check if this is an invocation of an ConditionalExpression
exports.conditionalExpression = function(node) {
    return t.isConditionalExpression(node) &&
        exports.children(node.consequent) &&
        exports.children(node.alternate);
};

exports.children = function(node) {
    // m(".fooga", [ ... ])
    // m(".fooga", "wooga")
    // m(".fooga", "wooga" + "booga")
    // m(".fooga", 10)
    // m(".fooga", true)
    if(childrenTypes.indexOf(node.type) > -1) {
        return true;
    }
    
    // m(".fooga", m(".booga"), ...)
    if(mithril.m(node)) {
        return true;
    }
    
    // m(".fooga", [ ... ].map)
    if(exports.arrayExpression(node)) {
        return true;
    }
    
    // m(".fooga", "foo".replace())
    if(exports.stringExpression(node)) {
        return true;
    }
    
    // m(".fooga", foo ? "bar" : "baz")
    if(exports.conditionalExpression(node)) {
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
    if(t.isObjectExpression(node)) {
        return true;
    }
    
    return exports.children(node);
};

// Test to see if a node is a passable mithril invocation
exports.mithril = function(node) {
    // m()
    if(!mithril.m(node)) {
        return false;
    }
    
    // m(".fooga.wooga")
    if(!t.isStringLiteral(node.arguments[0])) {
        return false;
    }
    
    // m(".fooga")
    if(node.arguments.length === 1) {
        return true;
    }
    
    return exports.arg(node.arguments[1]);
};
