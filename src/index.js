"use strict";

var partition = require("lodash.partition"),
    
    valid  = require("./valid.js"),
    parse  = require("./parse.js"),
    match  = require("./match.js"),
    create = require("./create.js");

// Combine any selector class/classNames with anything defined in code
function processAttrs(types, buckets, loc) {
    var merged = buckets.reduce((p, c) => p.concat(c), []),
        props  = partition(merged, (prop) =>
            match(prop, {
                key : { name : /^class$|^className$/ }
            })
        ),
        
        strings = props[0].filter((prop) =>
            valid.isStringish(prop.value)
        );

    // All class/className props were strings, if they're all empty we can early-out
    if(
        strings.length === props[0].length &&
        strings.every((node) => valid.isString(node.value) && !node.value.value.length)
    ) {
        return props[1];
    }

    // Some class/className props were strings
    if(strings.length) {
        props[1].unshift(
            create.prop(
                types,
                "className",
                create.stringify(types, props[0].map((prop) => prop.value), loc),
                loc
            )
        );

        return props[1];
    }

    // Combine everything
    return merged;
}

module.exports = function(babel) {
    var t     = babel.types,
        undef = t.identifier("undefined");

    return {
        visitor : {
            CallExpression(path) {
                var selector, args, parts, attrs;

                if(!valid.isMithril(path.node)) {
                    return;
                }
                
                selector = parse.selector(t, path.node);
                args = parse.args(t, path.node);

                attrs = processAttrs(t, [ selector.attrs, args.attrs ], path.node.loc);
                
                // Find any `key` properties and extract them
                parts = partition(attrs, (attr) => match(attr, {
                    key : { name : "key" }
                }));

                // Vnode(tag, key, attrs, children, text, dom)
                path.replaceWith(
                    create.vnode(
                        t,
                        selector.tag,
                        
                        // Use the last key attribute found
                        parts[0].length ? parts[0].pop().value : undef,
                        
                        // Create attributes object
                        parts[1].length ? t.objectExpression(parts[1]) : undef,
                        args.children || undef,
                        args.text || undef,
                        undef,
                        path.node.loc
                    )
                );
            }
        }
    };
};
