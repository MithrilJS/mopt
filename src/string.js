"use strict";

module.exports = function(node) {
    return node.type === "Literal" && typeof node.value === "string";
};
