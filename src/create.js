"use strict";

exports.prop = (types, key, value) =>
    types.objectProperty(
        types.isValidIdentifier(key) ?
            types.identifier(key) :
            types.stringLiteral(key),
        value
    );

exports.literal = (types, val) => {
    var type = [ "boolean", "string", "number" ].find((choice) => (typeof val === choice));
    
    return types[`${type}Literal`](val);
};

exports.normalize = (types, children) =>
    types.callExpression(
        types.memberExpression(
            types.memberExpression(
                types.identifier("m"),
                types.identifier("vnode")
            ),
            types.identifier("normalizeChildren")
        ),
        [
            children
        ]
    );
