"use strict";

module.exports = function(obj, prop, node) {
    if(node.type !== "CallExpression") {
        return false;
    }
    
    if(node.callee.type !== "MemberExpression") {
        return false;
    }
    
    return node.callee.object.type === "Identifier" &&
       node.callee.object.name === obj &&
       node.callee.property.type === "Identifier" &&
       node.callee.property.name === prop;
};
