var valid  = require("./valid.js"),
    create = require("./create.js"),
    
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
    
    src.match(selectorRegex).forEach(function(part) {
        var lead = part.charAt(0),
            parts;

        if(lead === "#") {
            // TODO: add location info
            out.attrs.push(
                create.prop(types, "id", part.slice(1))
            );

            return;
        }

        if(lead === ".") {
            css.push(part.slice(1));

            return;
        }

        if(lead === "[") {
            parts = part.match(attrRegex);
            
            // TODO: add location info
            out.attrs.push(
                create.prop(types, parts[1], parts[3] ? parts[3] : true)
            );
            
            return;
        }

        out.tag = types.valueToNode(part);
    });
    
    if(css.length > 0) {
        out.attrs.push(
            create.prop(types, "className", css.join(" "))
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
    /* eslint max-statements:off */
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

    // m("...", 1)
    // m("...", "one")
    // m("...", true)
    // m("...", [ 1 ])
    // m("...", [ 1, "foo", true ])
    // m("...", [ m(...), 1 ])
    if(children.length === 1) {
        // m("...", 1)
        // m("...", "one")
        // m("...", true)
        if(valid.isText(children[0])) {
            out.text = children[0];

            return out;
        }

        // m("...", [ 1 ])
        // m("...", [ 1, "foo", true ])
        // m("...", [ m(...), 1 ])
        if(types.isArrayExpression(children[0])) {
            // m("...", [ 1 ])
            if(children[0].elements.length === 1 && valid.isText(children[0].elements[0])) {
                out.text = children[0].elements[0];

                return out;
            }

            // m("...", [ 1, "foo", true ])
            // m("...", [ m(...), 1 ])
            out.children = types.arrayExpression(
                children[0].elements.map((el) => (valid.isText(el) ? create.textVnode(types, el) : el))
            );

            return out;
        }

        //
        out.children = types.arrayExpression(children);

        return out;
    }
    
    if(children.length) {
        out.children = create.normalize(types, types.arrayExpression(children));
    }

    return out;
};
