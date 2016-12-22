"use strict";

var valid  = require("./valid.js"),
    parse  = require("./parse.js"),
    create = require("./create.js");

module.exports = function(babel) {
    var t     = babel.types,
        undef = t.identifier("undefined");

    return {
        visitor : {
            CallExpression : {
                exit(path) {
                    // Vnode(tag, key, attrs, children, text, dom)
                    var selector, args, merged,
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

                    // Concat all attrs props together
                    merged = selector.attrs.concat(args.attrs);

                    tag = selector.tag;
                    
                    // TODO: support finding key from `merged`
                    
                    if(merged.length) {
                        attrs = t.objectExpression(merged);
                    }

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
