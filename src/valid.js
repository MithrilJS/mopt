"use strict";

var t = require("babel-core").types,
    
    literals = [
        "StringLiteral",
        "NumericLiteral",
        "BooleanLiteral"
    ],
    
    childrenTypes = [
        "ArrayExpression",
        "BinaryExpression",
        "StringLiteral",
        "NumericLiteral",
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

function makeCallExpressionCheck(obj, prop) {
    return function(node) {
        return t.isCallExpression(node) &&
            t.isMemberExpression(node.callee) &&
            t.isIdentifier(node.callee.object, { name : obj }) &&
            t.isIdentifier(node.callee.property, { name : prop });
    };
}

exports.isValueLiteral = function(node) {
    return literals.some(function(check) {
        return t["is" + check](node);
    });
};

// Check if this is an invocation of an Array.prototype method on an array
exports.isArrayExpression = function(node) {
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
exports.isStringExpression = function(node) {
    if(!t.isCallExpression(node) ||
       !t.isMemberExpression(node.callee) ||
       !t.isStringLiteral(node.callee.object)
    ) {
        return false;
    }
    
    if(t.isIdentifier(node.callee.property) &&
       safeStrings.indexOf(node.callee.property.name) !== -1
    ) {
        return true;
    }
    
    return t.isStringLiteral(node.callee.property) &&
        safeStrings.indexOf(node.callee.property.value) !== -1;
};

// Check if this is an invocation of an ConditionalExpression
exports.isConditionalExpression = function(node) {
    return t.isConditionalExpression(node) &&
        exports.children(node.consequent) &&
        exports.children(node.alternate);
};

// JSON.stringify( ... )
exports.isJsonStringify = makeCallExpressionCheck("JSON", "stringify");

// m( ... )
exports.isM = function(node) {
    return t.isCallExpression(node) &&
        t.isIdentifier(node.callee, { name : "m" });
};

// m.trust(...)
exports.isMithrilTrust = makeCallExpressionCheck("m", "trust");

// m.component(...)
exports.isMithrilComponent = makeCallExpressionCheck("m", "component");

// Valid children nodes that we can optimize
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
    if(exports.isM(node)) {
        return true;
    }
    
    // m(".fooga", [ ... ].map)
    if(exports.isArrayExpression(node)) {
        return true;
    }
    
    // m(".fooga", "foo".replace())
    if(exports.isStringExpression(node)) {
        return true;
    }
    
    // m(".fooga", foo ? "bar" : "baz")
    if(exports.isConditionalExpression(node)) {
        return true;
    }
    
    // m(".fooga", m.trust("<div>"))
    if(exports.isMithrilTrust(node)) {
        return true;
    }
    
    // m(".fooga", m.component(thing))
    if(exports.isMithrilComponent(node)) {
        return true;
    }
    
    // m(".fooga", JSON.stringify({}))
    if(exports.isJsonStringify(node)) {
        return true;
    }
    
    return false;
};

// Is the param an argument, or children?
exports.arg = function(node) {
    // m(".fooga", { ... })
    if(t.isObjectExpression(node)) {
        return true;
    }
    
    return exports.children(node);
};

// Test to see if a node is a passable mithril invocation
exports.mithril = function(node) {
    var first = node.arguments[0];
    
    // m()
    if(!exports.isM(node)) {
        return false;
    }
    
    // m(".fooga" + ".wooga")
    if(t.isBinaryExpression(first, { operator : "+" }) &&
       exports.isValueLiteral(first.left) &&
       exports.isValueLiteral(first.right)
    ) {
        return true;
    }
    
    // m(".fooga.wooga")
    if(!t.isStringLiteral(first)) {
        return false;
    }
    
    // m(".fooga")
    if(node.arguments.length === 1) {
        return true;
    }
    
    return exports.arg(node.arguments[1]);
};
