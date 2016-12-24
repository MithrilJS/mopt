"use strict";

function valnode(types, value) {
    return types.isNode(value) ?
        value :
        types.valueToNode(value);
}

function vnode(types, tag, value, loc) {
    var node = types.callExpression(
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

    if(loc) {
        node.loc = loc;
    }

    return node;
}

exports.prop = (types, key, value, loc) => {
    var prop = types.objectProperty(
        types.isValidIdentifier(key) ?
            types.identifier(key) :
            types.stringLiteral(key),
        valnode(types, value)
    );

    if(loc) {
        prop.loc = loc;
    }

    return prop;
};

exports.textVnode = (types, value, loc) =>
    vnode(types, "#", value, loc);

exports.trustVnode = (types, value, loc) =>
    vnode(types, "<", value.arguments[0], loc);

exports.fragmentVnode = (types, value, loc) =>
    vnode(types, "[", value, loc);


