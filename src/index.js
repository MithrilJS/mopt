"use strict";

var t = require("babel-core").types,
    
    valid = require("./valid");

function getClass(path) {
    var node = path.node,
        type = "className";
    
    if(node.arguments[1] && t.isObjectExpression(node.arguments[1])) {
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

function parseSelector(state) {
    var node = state.path.node,
        css  = [];
    
    // No need to parse the empty selector
    if(!node.arguments[0].value) {
        return;
    }
    
    node.arguments[0].value.match(/(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g).forEach(function(match) {
        var lead = match.charAt(0),
            parts;

        if(lead === "#") {
            state.attrs.id = t.stringLiteral(match.slice(1));

            return;
        }

        if(lead === ".") {
            css.push(match.slice(1));

            return;
        }

        if(lead === "[") {
            parts = match.match(/\[(.+?)(?:=("|'|)(.*?)\2)?\]/);
            state.attrs[parts[1]] = t.stringLiteral(parts[3] || "");
            
            return;
        }

        state.tag = match;
    });
    
    if(css.length > 0) {
        state.attrs[state.key] = t.stringLiteral(css.join(" "));
    }
}

function parseAttrs(state) {
    var existing = state.attrs[state.key];
    
    state.path.node.arguments[1].properties.forEach(function(property) {
        var key = property.key.name || property.key.value;
        
        // Combining class strings is a little trickier
        if(key === state.key && existing && existing.value.length) {
            // Ignore empty strings
            if(t.isStringLiteral(property.value) && property.value.value === "") {
                return;
            }
            
            // Literals get merged as a string
            if(t.isStringLiteral(property.value) ||
               t.isNumericLiteral(property.value) ||
               t.isBooleanLiteral(property.value)
               ) {
                state.attrs[state.key] = t.stringLiteral(existing.value + " " + property.value.value);
                
                return;
            }
            
            // Non-literals get combined w/ a "+"
            state.attrs[state.key] = t.binaryExpression("+", t.stringLiteral(existing.value + " "), property.value);

            return;
        }

        state.attrs[key] = property.value;
    });
}

function transform(path) {
    var state = {
            path  : path,
            tag   : "div",
            attrs : {},
            nodes : [],
            start : 1,
            key   : getClass(path)
        };

    parseSelector(state);
    
    // Is the second argument an object? Then it's attrs and they need to be parsed
    if(t.isObjectExpression(path.node.arguments[1])) {
        parseAttrs(state);

        state.start = 2;
    }
    
    // Make sure children is accurately sized
    if(path.node.arguments.length > state.start) {
        state.nodes = path.node.arguments.slice(state.start);
    }
    
    // Modify children based on contents
    if(state.nodes.length === 1) {
        if(t.isArrayExpression(state.nodes[0])) {
            // Make sure we don't end up w/ [ [ ... ] ]
            state.nodes = t.arrayExpression(state.nodes[0].elements);
        } else if(valid.arrayExpression(state.nodes[0])) {
            // Array expressions that return arrays get unwrapped
            state.nodes = state.nodes[0];
        } else {
            // Otherwise wrap it in an array
            state.nodes = t.arrayExpression(state.nodes);
        }
    } else {
        state.nodes = t.arrayExpression(state.nodes);
    }
    
    return state;
}

module.exports = function() {
    return {
        visitor : {
            CallExpression : function(path) {
                var state;
                
                if(!valid.mithril(path.node)) {
                    return;
                }

                state = transform(path);
                    
                path.replaceWith(t.objectExpression([
                    t.objectProperty(t.identifier("tag"), t.stringLiteral(state.tag)),
                    t.objectProperty(t.identifier("attrs"), t.objectExpression(Object.keys(state.attrs).map(function(key) {
                        return t.objectProperty(t.identifier(key), state.attrs[key]);
                    }))),
                    t.objectProperty(t.identifier("children"), state.nodes)
                ]));
            }
        }
    };
};
