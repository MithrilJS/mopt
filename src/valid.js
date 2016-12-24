"use strict";

var match = require("./match.js"),
    
    stringToStringRegex = /charAt|charCodeAt|codePointAt|concat|fromCharCode|fromCodePoint|normalize|repeat|replace|slice|substr|substring|toLocaleLowerCase|toLocaleUpperCase|toLowerCase|toString|toUpperCase|trim|trimLeft|trimRight|valueOf/,
    arrayToArrayRegex   = /concat|copyWithin|filter|map|reverse|slice|sort|splice/,
    arrayToStringRegex  = /join/;

exports.isString = (node) =>
    // Simple string or template literal
    match(node, {
        type : /StringLiteral|TemplateLiteral/
    }) ||
    // String.prototype methods that return a string
    match(node, {
        type   : "CallExpression",
        callee : {
            type     : "MemberExpression",
            object   : exports.isString,
            property : (prop) => stringToStringRegex.test(prop.name) || stringToStringRegex.test(prop.value)
        }
    }) ||
    // JSON.stringify returns a string
    match(node, {
        type   : "CallExpression",
        callee : {
            type     : "MemberExpression",
            object   : { name : "JSON" },
            property : { name : "stringify" }
        }
    }) ||
    // Array.prototype methods that return a string
    match(node, {
        type   : "CallExpression",
        callee : {
            type     : "MemberExpression",
            object   : exports.isArray,
            property : (prop) => arrayToStringRegex.test(prop.name) || arrayToStringRegex.test(prop.value)
        }
    }) ||
    // Conditionals via ternary logic
    match(node, {
        type       : "ConditionalExpression",
        consequent : exports.isText,
        alternate  : exports.isText
    }) ||
    // String concatenation via plus signs
    match(node, {
        type  : "BinaryExpression",
        left  : exports.isText,
        right : exports.isText
    });

exports.isText = (node) =>
    match(node, {
        type : /NumericLiteral|BooleanLiteral/
    }) ||
    exports.isString(node);

exports.isTextArray = (node) =>
    match(node, {
        type     : "ArrayExpression",
        elements : (elements) => elements.length === 1 && exports.isText(elements[0])
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

exports.isArray = (node) =>
    match(node, { type : "ArrayExpression" }) ||
    match(node, {
        type   : "CallExpression",
        callee : {
            type     : "MemberExpression",
            object   : exports.isArray,
            property : (prop) => arrayToArrayRegex.test(prop.name) || arrayToArrayRegex.test(prop.value)
        }
    });

// Is this a valid child node that we understand?
exports.isChild = (node) =>
    exports.isText(node) ||
    exports.isTextArray(node) ||
    exports.isM(node) ||
    exports.isMVnode(node) ||
    exports.isMTrust(node) ||
    exports.isArray(node);

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
    // Can't do anything more exciting here because it isn't parsable :(
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
