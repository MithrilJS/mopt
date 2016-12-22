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

exports.args = function parseChildren(types, node) {
    var out = {
            attrs    : [],
            text     : null,
            children : null
        };
    
    // m("...", { ... })
    if(valid.isAttributes(node.arguments[1])) {
        out.attrs = out.attrs.concat(node.arguments[1].properties);
    }

    return out;
};
