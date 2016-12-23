"use strict";

function valnode(types, value) {
    return types.isNode(value) ?
        value :
        types.valueToNode(value);
}

function vnode(types, tag, value) {
    return types.callExpression(
        types.memberExpression(
            types.identifier("m"),
            types.identifier("vnode")
        ),
        [
            // tag, key, attrs, children, text, dom
            types.stringLiteral(tag),
            types.identifier("undefined"),
            types.identifier("undefined"),
            valnode(types, value),
            types.identifier("undefined"),
            types.identifier("undefined")
        ]
    );
}

exports.prop = (types, key, value) =>
    types.objectProperty(
        types.isValidIdentifier(key) ?
            types.identifier(key) :
            types.stringLiteral(key),
        valnode(types, value)
    );

exports.textVnode = (types, value) =>
    vnode(types, "#", value);

exports.trustVnode = (types, value) =>
    vnode(types, "<", value.arguments[0]);

exports.fragmentVnode = (types, value) =>
    vnode(types, "[", value);
