"use strict";

var valid = require("./valid.js");

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

// Takes an array of nodes and returns the smallest string it can
exports.stringify = (types, nodes, loc) => {
    var output = [];

    // Combine successive strings
    nodes.forEach((node) => {
        if(valid.isString(node)) {
            if(!node.value.length) {
                return;
            }
        
            if(valid.isString(output[output.length - 1])) {
                output[output.length - 1].value += ` ${node.value}`;

                return;
            }
        }

        output.push(node);
    });

    // Single strings just return that
    if(output.length === 1) {
        return location(output[0], loc);
    }

    // Return nested binary expressions as needed
    return output.reverse().reduce((prev, curr) => {
        if(!prev) {
            return curr;
        }

        if(valid.isString(curr)) {
            curr.value += " ";
        }

        if(valid.isString(prev)) {
            prev.value = ` ${prev.value}`;
        }

        return location(
            types.binaryExpression(
                "+",
                curr,
                prev
            ),
            loc
        );
    });
};

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
