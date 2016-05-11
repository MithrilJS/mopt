"use strict";

var t = require("babel-core").types;

module.exports = function(obj, prop, node) {
    return t.isCallExpression(node) &&
        t.isMemberExpression(node.callee) &&
        t.isIdentifier(node.callee.object, { name : obj }) &&
        t.isIdentifier(node.callee.property, { name : prop });
};
