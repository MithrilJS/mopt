"use strict";

var t = require("babel-core").types;

exports.prop = function(key, value) {
    return t.objectProperty(
        t.isValidIdentifier(key) ? t.identifier(key) : t.stringLiteral(key),
        value
    );
};

exports.vnode = function(state) {
    if(!state.attrs.properties.length) {
        state.attrs = t.identifier("undefined");
    }

    return t.objectExpression([
        t.objectProperty(t.identifier("tag"), state.tag),
        t.objectProperty(t.identifier("attrs"), state.attrs),
        t.objectProperty(t.identifier("children"), state.nodes),
        t.objectProperty(t.identifier("dom"), t.identifier("undefined")),
        t.objectProperty(t.identifier("domSize"), t.identifier("undefined")),
        t.objectProperty(t.identifier("events"), t.identifier("undefined")),
        t.objectProperty(t.identifier("key"), t.identifier("undefined")),
        t.objectProperty(t.identifier("state"), t.objectExpression([])),
        t.objectProperty(t.identifier("text"), state.text)
    ]);
};
