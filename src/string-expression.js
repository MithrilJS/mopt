"use strict";

var isString = require("./string"),
    
    safe = [
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
    ];

// Check if this is an invocation of a String.prototype method on a string
module.exports = function(node) {
    return node.type === "CallExpression" &&
           node.callee.type === "MemberExpression" &&
           isString(node.callee.object) &&
           safe.indexOf(node.callee.property.name) !== -1;
};
