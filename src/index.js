"use strict";

var valid  = require("./valid.js"),
    parse  = require("./parse.js"),
    match  = require("./match.js"),
    create = require("./create.js");

function mergeAttrs(types, buckets) {
    // Concat all attrs props together
    var merged = buckets.reduce((p, c) => p.concat(c), []),
        classes = [],
        others  = [],
        css;

    merged.forEach((prop) => (match(prop, {
        key : { name : /^class$|^className$/ }
    }) ? classes.push(prop) : others.push(prop)));

    css = classes
        .map((prop) => prop.value.value)
        .filter((str) => str.length);
    
    if(css.length) {
        others.unshift(
            create.prop(types, "className", css.join(" "))
        );
    }

    return others;
}

module.exports = function(babel) {
    var t     = babel.types,
        undef = t.identifier("undefined");

    return {
        visitor : {
            CallExpression : {
                exit(path) {
                    // Vnode(tag, key, attrs, children, text, dom)
                    var selector, args,
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

                    attrs = mergeAttrs(t, [ selector.attrs, args.attrs ]);
                    
                    tag = selector.tag;
                    
                    // TODO: support finding key from `merged`
                    
                    attrs = attrs.length ? t.objectExpression(attrs) : undef;

                    if(args.children) {
                        children = args.children;
                    } else if(!args.text) {
                        children = t.arrayExpression();
                    }

                    if(args.text) {
                        text = args.text;
                    }

                    // console.log([
                    //     tag,
                    //     key,
                    //     attrs,
                    //     children,
                    //     text,
                    //     dom
                    // ]);

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
        }
    };
};
