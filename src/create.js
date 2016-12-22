"use strict";

function valnode(types, value) {
    return types.isNode(value) ?
        value :
        types.valueToNode(value);
}

exports.prop = (types, key, value) =>
    types.objectProperty(
        types.isValidIdentifier(key) ?
            types.identifier(key) :
            types.stringLiteral(key),
        valnode(types, value)
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

exports.textVnode = (types, value) =>
    types.callExpression(
        types.memberExpression(
            types.identifier("m"),
            types.identifier("vnode")
        ),
        [
            // tag, key, attrs, children, text, dom
            types.stringLiteral("#"),
            types.identifier("undefined"),
            types.identifier("undefined"),
            valnode(types, value),
            types.identifier("undefined"),
            types.identifier("undefined")
        ]
    );
