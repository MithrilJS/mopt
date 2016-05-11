"use strict";

// safe Array.prototype methods that we can optimize (because they return an array)
var recast = require("recast"),
    n = recast.types.namedTypes,
    b = recast.types.builders,
    
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
            out.attrs.id.loc = node.arguments[0].loc;

            return;
        }

        if(lead === ".") {
            classes.push(match.slice(1));

            return;
        }

        if(lead === "[") {
            parts = match.match(/\[(.+?)(?:=("|'|)(.*?)\2)?\]/);
            out.attrs[parts[1]] = b.literal(parts[3] || "");
            out.attrs[parts[1]].loc = node.arguments[0].loc;
            
            return;
        }

        out.tag = match;
    });
    
    if(classes.length > 0) {
        out.attrs[className] = b.literal(classes.join(" "));
        out.attrs[className].loc = node.arguments[0].loc;
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
                out.attrs[className].loc = existing.loc;
                
                return;
            }
            
            // Non-literals get combined w/ a "+"
            out.attrs[className] = b.binaryExpression("+", b.literal(existing.value + " "), property);
            out.attrs[className].loc = existing.loc;

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
    
    // Make sure children is accurately sized
    if(node.arguments.length > children) {
        out.children = node.arguments.slice(children);
    }
    
    // Modify children based on contents
    if(out.children.length === 1) {
        if(n.ArrayExpression.check(out.children[0])) {
            // Make sure we don't end up w/ [ [ ... ] ]
            out.children = b.arrayExpression(out.children[0].elements);
        } else if(arrayExpression(out.children[0])) {
            // Array expressions that return arrays get unwrapped
            out.children = out.children[0];
        } else {
            // Otherwise wrap it in an array
            out.children = b.arrayExpression(out.children);
        }
    } else {
        out.children = b.arrayExpression(out.children);
    }
    
    return b.objectExpression([
        b.property("init", b.identifier("tag"), b.literal(out.tag)),
        b.property("init", b.identifier("attrs"), b.objectExpression(Object.keys(out.attrs).map(function(key) {
            return b.property("init", b.identifier(key), out.attrs[key]);
        }))),
        b.property("init", b.identifier("children"), out.children)
    ]);
}

module.exports = function(source, options) {
    var ast = recast.parse(source, options);
    
    recast.visit(ast, {
        visitCallExpression : function(path) {
            var node = path.node;
            if(isValid.mithril(path.node)) {
                path.replace(transform(path));
                path.node.loc = node.loc;
                
                console.log(path.node);
            }
            
            this.traverse(path);
        }
    });
    
    return recast.print(ast, options);
};
