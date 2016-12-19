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
    
    safeArrayMethodsArray = [
        "concat",
        "copyWithin",
        "filter",
        "map",
        "reverse",
        "slice",
        "sort",
        "splice"
    ],
    
    safeArrayMethodsString = [
        "join"
    ],
    
    unsafeTags = [
        "[",
        "#",
        "<"
    ];

function makeCallExpressionCheck(obj, prop) {
    return function(node) {
        return t.isCallExpression(node) &&
            t.isMemberExpression(node.callee) &&
            t.isIdentifier(node.callee.object, { name : obj }) &&
            t.isIdentifier(node.callee.property, { name : prop });
    };
}

function makeArrayExpressionCheck(valid, node) {
    if(!t.isCallExpression(node) ||
       !t.isMemberExpression(node.callee) ||
       !t.isArrayExpression(node.callee.object)
    ) {
        return false;
    }
    
    if(t.isIdentifier(node.callee.property) &&
       valid.indexOf(node.callee.property.name) !== -1
    ) {
        return true;
    }
    
    return t.isStringLiteral(node.callee.property) &&
        valid.indexOf(node.callee.property.value) !== -1;
}

exports.isValueLiteral = function(node) {
    return literals.some(function(check) {
        return t["is" + check](node);
    });
};

// Check if this is an invocation of an Array.prototype method on an array that returns an array
exports.isArrayExpressionArray = makeArrayExpressionCheck.bind(null, safeArrayMethodsArray);

// Check if this is an invocation of an Array.prototype method on an array that returns a string
exports.isArrayExpressionString = makeArrayExpressionCheck.bind(null, safeArrayMethodsString);

// Check if this is an invocation of an Array.prototype method on an array
exports.isArrayExpression = makeArrayExpressionCheck.bind(null, safeArrayMethodsArray.concat(safeArrayMethodsString));

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
        exports.isChildren(node.consequent) &&
        exports.isChildren(node.alternate);
};

// JSON.stringify( ... )
exports.isJsonStringify = makeCallExpressionCheck("JSON", "stringify");

exports.isSafeTag = function(state) {
    return unsafeTags.indexOf(state.tag.value) === -1;
};

// m( ... )
exports.isM = function(node) {
    return t.isCallExpression(node) &&
        t.isIdentifier(node.callee, { name : "m" });
};

// m.trust(...)
exports.isMithrilTrust = makeCallExpressionCheck("m", "trust");

// Valid children nodes that we can optimize
exports.isChildren = function(node) {
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
    
    // m(".fooga", JSON.stringify({}))
    if(exports.isJsonStringify(node)) {
        return true;
    }
    
    return false;
};

// Is the param an argument, or children?
exports.isArg = function(node) {
    // m(".fooga", { ... })
    if(t.isObjectExpression(node)) {
        return true;
    }
    
    return exports.isChildren(node);
};

// Test to see if a node is a passable mithril invocation
exports.isMithril = function(node) {
    var first = node.arguments[0],
        argumentsLength = node.arguments.length;
    
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
    if(argumentsLength === 1) {
        return true;
    }
    
    return Array.prototype.slice.call(node.arguments, 1, argumentsLength).every( function(arg) {
        return exports.isArg(arg);
    });
};
