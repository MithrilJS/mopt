"use strict";

function getClass(node) {
    var type = "className";

    if(node.arguments[1] && node.arguments[1].type === "ObjectExpression") {
        node.arguments[1].properties.some(function(property) {
            var key = property.key.name || property.key.value;

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

function valid(node) {
    return node.type === "CallExpression" &&
           node.callee.type === "Identifier" &&
           node.callee.name === "m";
}

function parseSelector(node, out) {
    var classes = [];
    
    node.arguments[0].value.match(/(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g).forEach(function(match) {
        var lead = match.charAt(0),
            parts;

        if(lead === "#") {
            out.attrs.id = match.slice(1);

            return;
        }

        if(lead === ".") {
            classes.push(match.slice(1));

            return;
        }

        if(lead === "[") {
            parts = match.match(/\[(.+?)=("|'|)(.+?)\2\]/);
            out.attrs[parts[1]] = `"${parts[3]}"`;

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
        var key = property.key.name || property.key.value,
            css;

        // Class combinations get weird, so handling specially
        if(out.attrs[className] && key === className) {
            css = out.attrs[className].join(" ");

            // Strings get concatted
            if(isString(property.value)) {
                // But only if it's worth adding a new value
                if(property.value.value.length) {
                    out.attrs[className] = `"${css} ${property.value.value}"`;
                }
                
                return;
            }

            out.attrs[className] = `"${css} " + (${property.value.source()})`;
    
            return;
        }

        // Strings need to be quoted
        if(isString(property.value)) {
            out.attrs[key] = `"${property.value.value}"`;

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

    // TODO: This check seems like it isn't good enough!
    if(node.arguments[1] && node.arguments[1].type === "ObjectExpression") {
        parseAttrs(node, out);

        children = 2;
    }

    // Suck up all the children and stick 'em into their places
    if(node.arguments.length >= children) {
        out.children = node.arguments.slice(children);

        if(out.children.length === 1 && out.children[0].type === "ArrayExpression") {
            out.children = out.children[0].elements;
        }

        out.children = out.children.map(function(child) {
            return child.source();
        });
    }

    // parseSelector leaves this an array for ease of use in parseAttrs,
    // but if parseAttrs never ran we need to convert it to a string
    if(Array.isArray(out.attrs[className])) {
        out.attrs[className] = `"${out.attrs[className].join(" ")}"`;
    }

    // Map attrs to an array for exporting (can't use JSON.stringify because it eats functions)
    out.attrs = Object.keys(out.attrs).map(function(key) {
        return `"${key}": ${out.attrs[key]}`;
    });

    node.update(`({ tag: "${out.tag}", attrs: { ${out.attrs.join(", ")} }, children: [ ${out.children.join(", ")} ] })`);
}

module.exports = function(node) {
    if(!valid(node)) {
        return;
    }
    
    transform(node);
};
