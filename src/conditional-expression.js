"use strict";

var isValid = require("./valid");

// Check if this is an invocation of an ConditionalExpression
module.exports = function(node) {
    return node.type === "ConditionalExpression" &&
           isValid.arg(node.consequent) &&
           isValid.arg(node.alternate);
};
