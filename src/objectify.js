"use strict";

// safe Array.prototype methods that we can optimize (because they return an array)
var safe = [
        "concat",
        "filter",
        "map",
        "reverse",
        "slice",
        "sort",
        "splice"
    ];

function getClass(node) {
    var type = "className";

    if(node.arguments[1] && node.arguments[1].type === "ObjectExpression") {
        node.arguments[1].properties.some(function(property) {
            var key = property.key.name;

            if(key === "class") {
                type = "class";

                return true;
            }
        });
    }

    return type;
}

function isString(node) {
    return node.type === "Literal" && typeof node.value === "string";
}

// Check if this is an invocation of an Array.prototype method on an array
function arrayExpression(node) {
    return node.type === "CallExpression" &&
           node.callee.type === "MemberExpression" &&
           node.callee.object.type === "ArrayExpression" &&
           node.callee.property.type === "Identifier" &&
           safe.indexOf(node.callee.property.name) !== -1;
}

// Check if this is an invocation of m()
function invocation(node) {
    return node.type === "CallExpression" &&
           node.callee.type === "Identifier" &&
           node.callee.name === "m";
}

function valid(node) {
    // Table stakes: m()
    if(!invocation(node)) {
        return false;
    }
    
    // We can only safely optimize static string selectors: m(".fooga.wooga")
    if(node.arguments[0].type !== "Literal") {
        return false;
    }
    
    // What should be allowed?
    // m(".fooga")
    // m(".fooga", [ .. ])
    // m(".fooga", { ... }, ...)
    // m(".fooga", m(".booga"), ...)
    // m(".fooga", [ ... ].map)
    return node.arguments.length === 1 ||
        (node.arguments.length >= 2 &&
           (node.arguments[1].type === "ObjectExpression" ||
            node.arguments[1].type === "ArrayExpression" ||
            node.arguments[1].type === "Literal" ||
            invocation(node.arguments[1]) ||
            arrayExpression(node.arguments[1]))
       );
}

function parseSelector(node, out) {
    var classes = [];
    
    // No need to parse the empty selector
    if(!node.arguments[0].value) {
        return;
    }
    
    node.arguments[0].value.match(/(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g).forEach(function(match) {
        var lead = match.charAt(0),
            parts;

        if(lead === "#") {
            out.attrs.id = "\"" + match.slice(1) + "\"";

            return;
        }

        if(lead === ".") {
            classes.push(match.slice(1));

            return;
        }

        if(lead === "[") {
            parts = match.match(/\[(.+?)(?:=("|'|)(.*?)\2)?\]/);
            out.attrs[parts[1]] = parts[3] ? "\"" + parts[3] + "\"" : true;

            return;
        }

        out.tag = match;
    });

    if(classes.length > 0) {
        out.attrs[getClass(node)] = classes;
    }
}

function parseAttrs(node, out) {
    var className = getClass(node);

    node.arguments[1].properties.forEach(function(property) {
        var key = property.key.name,
            css;

        // Class combinations get weird, so handling specially
        if(out.attrs[className] && key === className) {
            css = out.attrs[className].join(" ");

            // Strings get concatted
            if(isString(property.value)) {
                // But only if it's worth adding a new value
                if(property.value.value.length) {
                    out.attrs[className] = "\"" + css + " " + property.value.value + "\"";
                }
                
                return;
            }

            out.attrs[className] = "\"" + css + " \" + (" + property.value.source() + ")";

            return;
        }

        // Strings need to be quoted
        if(isString(property.value)) {
            out.attrs[key] = "\"" + property.value.value + "\"";

            return;
        }

        out.attrs[key] = property.value.source();
    });
}

function transform(node) {
    var out = {
            tag      : "div",
            attrs    : {},
            children : []
        },
        children  = 1,
        className = getClass(node);

    parseSelector(node, out);

    // Is the second argument an object? Then it's attrs and we should parse 'em!
    if(node.arguments[1] && node.arguments[1].type === "ObjectExpression") {
        parseAttrs(node, out);

        children = 2;
    }
    
    // Suck up all the children and stick 'em into their places
    if(node.arguments.length > children) {
        out.children = node.arguments.slice(children);

        if(out.children.length === 1 && out.children[0].type === "ArrayExpression") {
            out.children = out.children[0].elements;
        }
    }

    // parseSelector leaves this an array for ease of use in parseAttrs,
    // but if parseAttrs never ran we need to convert it to a string
    if(Array.isArray(out.attrs[className])) {
        out.attrs[className] = "\"" + out.attrs[className].join(" ") + "\"";
    }

    // Map attrs to an array for exporting (can't use JSON.stringify because it eats functions)
    out.attrs = Object.keys(out.attrs).map(function(key) {
        return "\"" + key + "\": " + out.attrs[key];
    });

    if(out.children.length === 1 && arrayExpression(out.children[0])) {
        out.children = out.children[0].source();
    } else {
        out.children = out.children.map(function(child) {
            return child.source();
        });

        out.children = "[ " + out.children.join(",") + " ]";
    }

    node.update("({ tag: \"" + out.tag + "\", attrs: { " + out.attrs.join(", ") + " }, children: " + out.children + " })");
}

module.exports = function(node) {
    if(!valid(node)) {
        return;
    }
    
    transform(node);
};
