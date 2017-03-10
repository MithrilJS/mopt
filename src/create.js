"use strict";

var valid = require("./valid.js");

function valnode(types, value) {
    return types.isNode(value) ?
        value :
        types.valueToNode(value);
}

function location(node, loc) {
    node.loc = loc;

    return node;
}

// Takes an array of nodes and returns string + nested binary expressions as needed
exports.stringify = (types, nodes, loc) =>
    nodes.reduce((prev, curr) => {
        if(valid.isString(curr)) {
            // filter out empty strings
            if(!curr.value.length) {
                return prev;
            }
            
            // multiple strings can be simply concatted
            if(valid.isString(prev)) {
                prev.value += ` ${curr.value}`;

                return prev;
            }
            
            // appending to something, need to add seperator
            curr.value = ` ${curr.value}`;
        }
        
        if(valid.isString(prev)) {
            prev.value += " ";
        }

        return location(
            types.binaryExpression(
                "+",
                prev,
                curr
            ),
            loc
        );
    });

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
