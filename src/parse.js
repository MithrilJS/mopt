var valid  = require("./valid.js"),
    create = require("./create.js"),
    
    selectorRegex = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g,
    attrRegex     = /\[(.+?)(?:=("|'|)(.*?)\2)?\]/;

exports.selector = (types, node) => {
    var src = node.arguments[0].value,
        css = [],
        out = {
            src,
            attrs : [],
            tag   : "div"
        };
    
    if(!src) {
        return out;
    }
    
    src.match(selectorRegex).forEach(function(part) {
        var lead = part.charAt(0),
            parts;

        if(lead === "#") {
            out.attrs.push(
                create.prop(types, "id", part.slice(1), node.arguments[0].loc)
            );

            return;
        }

        if(lead === ".") {
            css.push(part.slice(1));

            return;
        }

        if(lead === "[") {
            parts = part.match(attrRegex);
            
            out.attrs.push(
                create.prop(types, parts[1], parts[3] ? parts[3] : true, node.arguments[0].loc)
            );
            
            return;
        }

        out.tag = part;
    });
    
    if(css.length > 0) {
        out.attrs.push(
            create.prop(types, "className", css.join(" "), node.arguments[0].loc)
        );
    }

    return out;
};

function parseChildren(types, nodes) {
    return nodes.map((node) => {
        // optimize simple text nodes
        if(valid.isText(node)) {
            return create.textVnode(types, node, node.loc);
        }

        // optimize m.trust
        if(valid.isMTrust(node)) {
            return create.trustVnode(types, node, node.loc);
        }

        // Will be transformed later
        if(valid.isM(node)) {
            return node;
        }

        // Turn arrays into fragments
        if(types.isArrayExpression(node)) {
            return create.fragmentVnode(
                types,
                types.arrayExpression(parseChildren(types, node.elements)),
                node.loc
            );
        }
        
        // Can't optimize, normalize at run time :(
        return create.normalize(types, node, node.loc);
    });
}

// m("...", "...")
// m("...", "...", "...")
// m("...", {...})
// m("...", {...}, "...")
// m("...", {...}, "...", ...)
// m("...", [...])
// m("...", {...}, [...])
exports.args = (types, node) => {
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

    // Special-cased for a single text node or an array with a single text node
    // m("...", 1)
    // m("...", "one")
    // m("...", true)
    // m("...", [ 1 ])
    if(children.length === 1) {
        // m("...", "one")
        if(valid.isText(children[0])) {
            out.text = children[0];

            return out;
        }

        // m("...", [ "one" ])
        if(valid.isTextArray(children[0])) {
            out.text = children[0].elements[0];

            return out;
        }

        // m("...", [ 1, m("..."), m.trust("...") ])
        if(types.isArrayExpression(children[0])) {
            out.children = types.arrayExpression(
                parseChildren(types, children[0].elements)
            );

            return out;
        }

        // TODO: needs to wrap array in m.vnode.normalizeChildren
        // m("...", [...].map(...))
        // m("...", [...].filter(...))
        if(valid.isArray(children[0])) {
            out.children = create.normalizeChildren(types, children[0], children[0].loc);

            return out;
        }
    }

    // m("...", ... )
    out.children = types.arrayExpression(
        parseChildren(types, children)
    );

    return out;
};
