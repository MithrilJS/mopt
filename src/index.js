"use strict";

var partition = require("lodash.partition"),
    
    valid  = require("./valid.js"),
    parse  = require("./parse.js"),
    match  = require("./match.js"),
    create = require("./create.js");

function processAttrs(types, buckets) {
    var merged = buckets.reduce((p, c) => p.concat(c), []),
        result = partition(merged, (prop) =>
            match(prop, {
                key : { name : /^class$|^className$/ }
            })
        ),
        
        css = result[0]
            .map((prop) => prop.value.value)
            .filter(Boolean);
    
    if(css.length) {
        result[1].unshift(
            create.prop(types, "className", css.join(" "))
        );
    }

    return result[1];
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

                attrs = processAttrs(t, [ selector.attrs, args.attrs ]);
                
                // Find any `key` properties and extract them
                parts = partition(attrs, (attr) => match(attr, {
                    key : { name : "key" }
                }));

                // Vnode(tag, key, attrs, children, text, dom)
                path.replaceWith(t.callExpression(
                    t.memberExpression(
                        t.identifier("m"),
                        t.identifier("vnode")
                    ),
                    [
                        selector.tag,
                        // Use the last key attribute found
                        parts[0].length ? parts[0].pop().value : undef,
                        // Create attributes object
                        parts[1].length ? t.objectExpression(parts[1]) : undef,
                        args.children || undef,
                        args.text || undef,
                        undef
                    ]
                ));
            }
        }
    };
};
