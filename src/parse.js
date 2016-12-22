var valid  = require("./valid.js"),
    create = require("./create.js"),
    match  = require("./match.js"),
    
    selectorRegex = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g,
    attrRegex     = /\[(.+?)(?:=("|'|)(.*?)\2)?\]/;

exports.selector = function parseSelector(types, node) {
    var src = node.arguments[0].value,
        css = [],
        out = {
            attrs : [],
            tag   : types.stringLiteral("div")
        };
    
    if(!src) {
        return out;
    }
    
    src.match(selectorRegex).forEach(function(match) {
        var lead = match.charAt(0),
            parts;

        if(lead === "#") {
            // TODO: add location info
            out.attrs.push(
                create.prop(types, "id", types.stringLiteral(match.slice(1)))
            );

            return;
        }

        if(lead === ".") {
            css.push(match.slice(1));

            return;
        }

        if(lead === "[") {
            parts = match.match(attrRegex);
            
            // TODO: add location info
            out.attrs.push(
                create.prop(types, parts[1], create.literal(types, parts[3] ? parts[3] : true))
            );
            
            return;
        }

        out.tag = create.literal(types, match);
    });
    
    if(css.length > 0) {
        out.attrs.push(
            create.prop(types, "className", types.stringLiteral(css.join(" ")))
        );
    }

    return out;
};

// m("...", "...")
// m("...", "...", "...")
// m("...", {...})
// m("...", {...}, "...")
// m("...", {...}, "...", ...)
exports.args = function parseChildren(types, node) {
    var out = {
            attrs    : [],
            text     : null,
            children : null
        },
        start = 1,
        children;

    if(valid.isAttributes(node.arguments[1])) {
        out.attrs = out.attrs.concat(node.arguments[1].properties);

        start = 2;
    }

    children = node.arguments.slice(start);

    if(children.length === 1) {
        if(valid.isText(children[0])) {
            out.text = children[0];
        }

        // m("...", [ 1 ])
        // m("...", [ 1, 2, 3 ])
        if(match(children[0], {
            type     : "ArrayExpression",
            elements : [
                valid.isText
            ]
        })) {
            if(children[0].elements.length === 1) {
                out.text = children[0].elements[0];
            } else {
                out.children = create.normalize(types, children[0]);
            }
        }

        return out;
    }
    
    if(children.length) {
        out.children = create.normalize(types, types.arrayExpression(children));

        return out;
    }

    return out;
};
