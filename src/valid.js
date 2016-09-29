"use strict";

var literals = [
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

module.exports = function(api) {
    var t   = api.types,
        out = {};

    function makeCallExpressionCheck(obj, prop) {
        return function(node) {
            return t.isCallExpression(node) &&
                t.isMemberExpression(node.callee) &&
                t.isIdentifier(node.callee.object, { name : obj }) &&
                t.isIdentifier(node.callee.property, { name : prop });
        };
    }

    out.isValueLiteral = function(node) {
        return literals.some(function(check) {
            return t[`is${check}`](node);
        });
    };

    // Check if this is an invocation of an Array.prototype method on an array
    out.isArrayExpression = function(node) {
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
    out.isStringExpression = function(node) {
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
    out.isConditionalExpression = function(node) {
        return t.isConditionalExpression(node) &&
            out.children(node.consequent) &&
            out.children(node.alternate);
    };

    // JSON.stringify( ... )
    out.isJsonStringify = makeCallExpressionCheck("JSON", "stringify");

    // m( ... )
    out.isM = function(node) {
        return t.isCallExpression(node) &&
            t.isIdentifier(node.callee, { name : "m" });
    };

    // m.trust(...)
    out.isMithrilTrust = makeCallExpressionCheck("m", "trust");

    // m.component(...)
    out.isMithrilComponent = makeCallExpressionCheck("m", "component");

    // Valid children nodes that we can optimize
    out.children = function(node) {
        /* eslint max-statements:[ 2, 17 ] */
        // m(".fooga", [ ... ])
        // m(".fooga", "wooga")
        // m(".fooga", "wooga" + "booga")
        // m(".fooga", 10)
        // m(".fooga", true)
        if(childrenTypes.indexOf(node.type) > -1) {
            return true;
        }
        
        // m(".fooga", m(".booga"), ...)
        if(out.isM(node)) {
            return true;
        }
        
        // m(".fooga", [ ... ].map)
        if(out.isArrayExpression(node)) {
            return true;
        }
        
        // m(".fooga", "foo".replace())
        if(out.isStringExpression(node)) {
            return true;
        }
        
        // m(".fooga", foo ? "bar" : "baz")
        if(out.isConditionalExpression(node)) {
            return true;
        }
        
        // m(".fooga", m.trust("<div>"))
        if(out.isMithrilTrust(node)) {
            return true;
        }
        
        // m(".fooga", m.component(thing))
        if(out.isMithrilComponent(node)) {
            return true;
        }
        
        // m(".fooga", JSON.stringify({}))
        if(out.isJsonStringify(node)) {
            return true;
        }
        
        return false;
    };

    // Is the param an argument, or children?
    out.arg = function(node) {
        // m(".fooga", { ... })
        if(t.isObjectExpression(node)) {
            return true;
        }
        
        return out.children(node);
    };

    // Test to see if a node is a passable mithril invocation
    out.mithril = function(node) {
        var first = node.arguments[0];
        
        // m()
        if(!out.isM(node)) {
            return false;
        }
        
        // m(".fooga" + ".wooga")
        if(t.isBinaryExpression(first, { operator : "+" }) &&
        out.isValueLiteral(first.left) &&
        out.isValueLiteral(first.right)
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
        
        return out.arg(node.arguments[1]);
    };

    return out;
};
