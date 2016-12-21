"use strict";

var valid = require("./valid.js"),
    t;

function parseSelector(node) {
    var attrs = {},
        css   = [],
        src   = node.arguments[0].value,
        tag   = "div";
    
    if(!src) {
        return {
            tag
        };
    }
    
    src.match(/(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g).forEach(function(match) {
        var lead = match.charAt(0),
            parts;

        if(lead === "#") {
            attrs.id = match.slice(1);

            return;
        }

        if(lead === ".") {
            css.push(match.slice(1));

            return;
        }

        if(lead === "[") {
            parts = match.match(/\[(.+?)(?:=("|'|)(.*?)\2)?\]/);
            
            attrs[parts[1]] = parts[3] ? parts[3] : true;
            
            return;
        }

        tag = match;
    });
    
    if(css.length > 0) {
        attrs.className = css.join(" ");
    }

    return {
        tag,

        // Only want this to have a value if there was something there
        attrs : Object.keys(attrs).length ? attrs : null
    };
}

module.exports = function(babel) {
    // make available to other fns (yes this is hella weird shut up)
    t = babel.types;

    return {
        visitor : {
            CallExpression : {
                exit(path) {
                    var selector;

                    if(!valid.isMithril(path.node)) {
                        return;
                    }

                    selector = parseSelector(path.node);

                    console.log(selector);
                    
                    return path.replaceWith(t.callExpression(
                        t.memberExpression(
                            t.identifier("m"),
                            t.identifier("vnode")
                        ),
                        [
                            t.stringLiteral(selector.tag),
                            t.identifier("undefined"),
                            selector.attrs ?
                                t.objectExpression(
                                    Object.keys(selector.attrs).map((key) =>
                                        t.objectProperty(
                                            t.identifier(key),
                                            t.stringLiteral(selector.attrs[key])
                                        )
                                    )
                                ) :
                                t.identifier("undefined"),
                            t.arrayExpression(),
                            t.identifier("undefined"),
                            t.identifier("undefined")
                        ]
                    ));
                }
            }
        }
    };
};
