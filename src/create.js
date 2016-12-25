"use strict";

function valnode(types, value) {
    return types.isNode(value) ?
        value :
        types.valueToNode(value);
}

function location(node, loc) {
    if(loc) {
        node.loc = loc;
    }

    return node;
}

exports.vnode = (types, tag, key, attrs, children, text, dom, loc) =>
    /* eslint max-params: off */
    location(
        types.callExpression(
            types.memberExpression(
                types.identifier("m"),
                types.identifier("vnode")
            ),
            [
                // tag, key, attrs, children, text, dom
                types.stringLiteral(tag),
                key || types.identifier("undefined"),
                attrs || types.identifier("undefined"),
                children ? valnode(types, children) : types.identifier("undefined"),
                text || types.identifier("undefined"),
                dom || types.identifier("undefined")
            ]
        ),
        loc
    );

exports.prop = (types, key, value, loc) =>
    location(
        types.objectProperty(
            types.isValidIdentifier(key) ?
                types.identifier(key) :
                types.stringLiteral(key),
            valnode(types, value)
        ),
        loc
    );

exports.normalize = (types, node, loc) =>
    location(
        types.callExpression(
            types.memberExpression(
                types.memberExpression(
                    types.identifier("m"),
                    types.identifier("vnode")
                ),
                types.identifier("normalize")
            ),
            [ node ]
        ),
        loc
    );

exports.normalizeChildren = (types, node, loc) =>
    location(
        types.callExpression(
            types.memberExpression(
                types.memberExpression(
                    types.identifier("m"),
                    types.identifier("vnode")
                ),
                types.identifier("normalizeChildren")
            ),
            [ node ]
        ),
        loc
    );

exports.textVnode = (types, value, loc) =>
    exports.vnode(types, "#", null, null, value, null, null, loc);

exports.trustVnode = (types, value, loc) =>
    exports.vnode(types, "<", null, null, value.arguments[0], null, null, loc);

exports.fragmentVnode = (types, value, loc) =>
    exports.vnode(types, "[", null, null, value, null, null, loc);
