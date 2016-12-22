"use strict";

exports.prop = function(types, key, value) {
    return types.objectProperty(
        types.isValidIdentifier(key) ?
            types.identifier(key) :
            types.stringLiteral(key),
        value
    );
};

exports.literal = function(types, val) {
    var type = [ "boolean", "string", "number" ].find((choice) => (typeof val === choice));
    
    return types[`${type}Literal`](val);
};
