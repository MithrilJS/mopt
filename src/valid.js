"use strict";

var match = require("./match.js"),
    
    stringMethodsRegex = /charAt|charCodeAt|codePointAt|concat|fromCharCode|fromCodePoint|normalize|repeat|replace|slice|substr|substring|toLocaleLowerCase|toLocaleUpperCase|toLowerCase|toString|toUpperCase|trim|trimLeft|trimRight|valueOf/;

exports.isString = (node) =>
    match(node, { type : "StringLiteral" }) ||
    // String.prototype methods that return a string
    match(node, {
        type   : "CallExpression",
        callee : {
            object   : exports.isString,
            property : (prop) => stringMethodsRegex.test(prop.name) || stringMethodsRegex.test(prop.value)
        }
    }) ||
    // JSON.stringify returns a string
    match(node, {
        type   : "CallExpression",
        callee : {
            object   : { name : "JSON" },
            property : { name : "stringify" }
        }
    });

exports.isText = (node) =>
    match(node, {
        type : /NumericLiteral|BooleanLiteral/
    }) ||
    exports.isString(node);

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
        callee : { name : "m" }
    });

exports.isMVnode = (node) =>
    match(node, {
        type   : "CallExpression",
        callee : {
            type     : "MemberExpression",
            object   : { name : "m" },
            property : { name : "vnode" }
        }
    });

exports.isMTrust = (node) =>
    match(node, {
        type   : "CallExpression",
        callee : {
            type     : "MemberExpression",
            object   : { name : "m" },
            property : { name : "trust" }
        }
    });

// Is this a valid child node that we understand?
exports.isChild = (node) => {
    if(
        exports.isText(node) ||
        exports.isTextArray(node) ||
        exports.isM(node) ||
        exports.isMVnode(node) ||
        exports.isMTrust(node)
    ) {
        return true;
    }

    if(match(node, { type : "ArrayExpression" })) {
        return exports.isChildren(node.elements);
    }

    return false;
};

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
