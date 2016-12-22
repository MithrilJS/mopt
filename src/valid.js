"use strict";

var match = require("./match.js"),
    
    // TODO: REMOVE REMOVE REMOVE
    t = require("babel-core").types,
    
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

exports.isText = (node) => exports.isValueLiteral(node) || exports.isStringExpression(node);

// m.trust(...)
// exports.isMithrilTrust = makeCallExpressionCheck("m", "trust");

// m( ... )
exports.isM = (node) => match(node, {
    type   : "CallExpression",
    callee : {
        name : "m"
    }
});

// Are these valid children nodes that we understand?
exports.isChildren = (nodes) => nodes.every((node) => {
    // [ ... ]
    // "wooga"
    // "wooga" + "booga"
    // 10
    // true
    if(childrenTypes.indexOf(node.type) > -1) {
        return true;
    }
    
    // m(".booga"), ...
    if(exports.isMithril(node)) {
        return true;
    }
    
    // [ ... ].map
    if(exports.isArrayExpression(node)) {
        return true;
    }
    
    // "foo".replace()
    if(exports.isStringExpression(node)) {
        return true;
    }
    
    // foo ? "bar" : "baz"
    if(exports.isConditionalExpression(node)) {
        return true;
    }
    
    // m.trust("<div>")
    // if(exports.isMithrilTrust(node)) {
    //     return true;
    // }
    
    // JSON.stringify({})
    if(exports.isJsonStringify(node)) {
        return true;
    }
    
    return false;
});

// Is this node an attributes object?
exports.isAttributes = function(node) {
    // m(".fooga", { ... })
    return t.isObjectExpression(node);
};

// Is this node a mithril invocation?
exports.isMithril = function(node) {
    // m( ... )
    if(!exports.isM(node)) {
        return false;
    }
    
    // m(".fooga" + ".wooga")
    // if(t.isBinaryExpression(first, { operator : "+" }) &&
    //    exports.isValueLiteral(first.left) &&
    //    exports.isValueLiteral(first.right)
    // ) {
    //     return true;
    // }
    
    // m("...")
    if(!match(node.arguments[0], { type : "StringLiteral" })) {
        return false;
    }
    
    // m(".fooga")
    if(node.arguments.length === 1) {
        return true;
    }
    
    if(node.arguments.length > 2) {
        // m(".fooga", { ... }, "wooga" )
        // m(".fooga", "wooga", "booga")
        // m(".fooga", "wooga", "booga", ...)
        return exports.isAttributes(node.arguments[1]) ?
            exports.isChildren(node.arguments.slice(2)) :
            exports.isChildren(node.arguments.slice(1));
    }

    // m(".fooga", { ... } )
    // m(".fooga", "test")
    return exports.isAttributes(node.arguments[1]) || exports.isChildren(node.arguments.slice(1));
};
