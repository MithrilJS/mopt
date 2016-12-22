"use strict";

exports.prop = (types, key, value) =>
    types.objectProperty(
        types.isValidIdentifier(key) ?
            types.identifier(key) :
            types.stringLiteral(key),
        types.isNode(value) ?
            value :
            types.valueToNode(value)
    );

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
