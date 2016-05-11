"use strict";

// safe Array.prototype methods that we can optimize (because they return an array)
var recast = require("recast"),
    n = recast.types.namedTypes,
    b = recast.types.builders,
    t = recast.types.builtInTypes,
    
    arrayExpression  = require("./array-expression"),
    
    isString = require("./string"),
    isValid  = require("./valid");

function getClass(path) {
    var node = path.node,
        type = "className";
    
    if(node.arguments[1] && n.ObjectExpression.check(node.arguments[1])) {
        // TODO: REWRITE
        node.arguments[1].properties.some(function(property) {
            var key = property.key.name || property.key.value;

            if(key === "class") {
                type = "class";

                return true;
            }
            
            return false;
        });
    }

    return type;
}

function parseSelector(path, out, className) {
    var node = path.node,
        classes = [];
    
    // No need to parse the empty selector
    if(!node.arguments[0].value) {
        return;
    }
    
    node.arguments[0].value.match(/(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g).forEach(function(match) {
        var lead = match.charAt(0),
            parts;

        if(lead === "#") {
            out.attrs.id = b.literal(match.slice(1));

            return;
        }

        if(lead === ".") {
            classes.push(match.slice(1));

            return;
        }

        if(lead === "[") {
            parts = match.match(/\[(.+?)(?:=("|'|)(.*?)\2)?\]/);
            out.attrs[parts[1]] = b.literal(parts[3] || "");
            
            return;
        }

        out.tag = match;
    });
    
    if(classes.length > 0) {
        out.attrs[className] = b.literal(classes.join(" "));
    }
}

function parseAttrs(path, out, className) {
    var existing = out.attrs[className];
    
    path.get("arguments", 1, "properties").value.forEach(function(property) {
        var key = property.key.name || property.key.value;
        
        // Combining class strings is a little trickier
        if(key === className && existing && existing.value.length) {
            // Ignore empty strings
            if(n.Literal.check(property.value) && property.value.value === "") {
                return;
            }
            
            // Literals get merged as a string
            if(n.Literal.check(property.value)) {
                out.attrs[className] = b.literal(existing.value + " " + property.value.value);
                
                return;
            }
            
            // Non-literals get combined w/ a "+"
            out.attrs[className] = b.binaryExpression("+", b.literal(existing.value + " "), property.value);

            return;
        }

        out.attrs[key] = property.value;
    });
}

function transform(path) {
    var node = path.node,
        out = {
            tag      : "div",
            attrs    : {},
            children : []
        },
        children  = 1,
        className = getClass(path);

    parseSelector(path, out, className);
    
    // Is the second argument an object? Then it's attrs and they need to be parsed
    if(n.ObjectExpression.check(node.arguments[1])) {
        parseAttrs(path, out, className);

        children = 2;
    }
    
    // Suck up all the children and stick 'em into their places
    if(node.arguments.length > children) {
        out.children = node.arguments.slice(children);
        
        // Make sure we don't end up w/ [ [ ... ] ]
        if(out.children.length === 1 && n.ArrayExpression.check(out.children[0])) {
            out.children = out.children[0].elements;
        }
    }

    // if(!out.children.length) {
    //     out.children = "[]";
    // } else if(out.children.length === 1 && arrayExpression(out.children[0])) {
    //     out.children = out.children[0].source();
    // } else {
    //     out.children = out.children.map(function(child) {
    //         return child.source();
    //     });

    //     out.children = "[ " + out.children.join(",") + " ]";
    // }
    
    return b.objectExpression([
        b.property("init", b.identifier("tag"), b.literal(out.tag)),
        b.property("init", b.identifier("attrs"), b.objectExpression(Object.keys(out.attrs).map(function(key) {
            return b.property("init", b.identifier(key), out.attrs[key]);
        }))),
        b.property("init", b.identifier("children"), b.arrayExpression(out.children))
    ]);
}

module.exports = function(source) {
    var ast = recast.parse(source);
    
    recast.types.visit(ast, {
        visitCallExpression : function(path) {
            if(isValid.mithril(path.node)) {
                path.replace(transform(path));
            }
            
            this.traverse(path);
        }
    });
    
    return recast.print(ast);
};
