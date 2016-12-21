"use strict";

exports.state = function() {
    return {
        tag   : t.stringLiteral("div"),
        attrs : t.objectExpression([]),
        nodes : t.arrayExpression([]),
        text  : t.identifier("undefined")
    };
};

exports.prop = function(key, value) {
    return t.objectProperty(
        t.isValidIdentifier(key) ? t.identifier(key) : t.stringLiteral(key),
        value
    );
};

exports.vnode = function(state) {
    var fields;
    
    if(!state.attrs.properties.length) {
        state.attrs = t.identifier("undefined");
    }
    
    fields = [
        exports.prop("tag", state.tag),
        exports.prop("attrs", state.attrs),
        exports.prop("children", state.nodes),
        exports.prop("dom", t.identifier("undefined")),
        exports.prop("domSize", t.identifier("undefined")),
        exports.prop("events", t.identifier("undefined")),
        exports.prop("key", t.identifier("undefined")),
        exports.prop("state", t.objectExpression([])),
        exports.prop("text", state.text)
    ];
    
    if(state.ns) {
        fields.push(exports.prop("ns", state.ns));
    }

    return t.objectExpression(fields);
};

exports.mTrust = function(html) {
    var state = exports.state();
    
    state.tag = t.stringLiteral("<");
    state.nodes = html;
    
    return exports.vnode(state);
};
