"use strict";

var valid  = require("./valid.js"),
    parse  = require("./parse.js"),
    match  = require("./match.js"),
    create = require("./create.js");

function partition(array, test) {
    var success = [],
        failure = [];
    
    array.forEach((val) => (test(val) ?
        success.push(val) :
        failure.push(val)
    ));

    return {
        success,
        failure
    };
}

function processAttrs(types, buckets) {
    var merged = buckets.reduce((p, c) => p.concat(c), []),
        result = partition(merged, (prop) =>
            match(prop, {
                key : { name : /^class$|^className$/ }
            })
        ),
        
        css = result.success
            .map((prop) => prop.value.value)
            .filter((str) => str.length);
    
    if(css.length) {
        result.failure.unshift(
            create.prop(types, "className", css.join(" "))
        );
    }

    return result.failure;
}

module.exports = function(babel) {
    var t     = babel.types,
        undef = t.identifier("undefined");

    return {
        visitor : {
            CallExpression(path) {
                /* eslint max-statements:off */
                var selector, args, parts,
                    tag      = undef,
                    key      = undef,
                    attrs    = undef,
                    children = undef,
                    text     = undef,
                    dom      = undef;

                if(!valid.isMithril(path.node)) {
                    return;
                }
                
                selector = parse.selector(t, path.node);
                args = parse.args(t, path.node);

                attrs = processAttrs(t, [ selector.attrs, args.attrs ]);
                
                tag = selector.tag;
                
                // Find any `key` properties and extract them
                parts = partition(attrs, (attr) => match(attr, {
                    key : { name : "key" }
                }));

                key   = parts.success.length ? parts.success.reduce((p, c) => c).value : undef;
                attrs = parts.failure.length ? t.objectExpression(parts.failure) : undef;

                if(args.children) {
                    children = args.children;
                }

                if(args.text) {
                    text = args.text;
                }

                // Vnode(tag, key, attrs, children, text, dom)
                path.replaceWith(t.callExpression(
                    t.memberExpression(
                        t.identifier("m"),
                        t.identifier("vnode")
                    ),
                    [
                        tag,
                        key,
                        attrs,
                        children,
                        text,
                        dom
                    ]
                ));
            }
        }
    };
};
