"use strict";

var t = require("babel-core").types,
    
    valid  = require("./valid"),
    create = require("./create"),
    
    visitor;

function parseSelector(state) {
    var node = state.path.node,
        css  = [],
        src  = node.arguments[0];
    
    // Simple binary expressions like "foo" + "bar" can be statically handled
    // It'd be weird to write it, but you never know
    if(t.isBinaryExpression(src) && src.operator === "+") {
        src = src.left.value + src.right.value;
    } else {
        src = src.value;
    }
    
    if(!src) {
        return;
    }
    
    src.match(/(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g).forEach(function(match) {
        var lead = match.charAt(0),
            parts;

        if(lead === "#") {
            state.attrs.properties.push(create.prop("id", t.stringLiteral(match.slice(1))));

            return;
        }

        if(lead === ".") {
            css.push(match.slice(1));

            return;
        }

        if(lead === "[") {
            parts = match.match(/\[(.+?)(?:=("|'|)(.*?)\2)?\]/);
            
            state.attrs.properties.push(
                create.prop(parts[1], parts[3] ? t.stringLiteral(parts[3]) : t.identifier("true"))
            );
            
            return;
        }

        state.tag = t.stringLiteral(match);
    });
    
    if(css.length > 0) {
        state.attrs.properties.push(create.prop("className", t.stringLiteral(css.join(" "))));
    }
}

function parseAttrs(state) {
    var existing;

    state.attrs.properties.some(function(property) {
        if(property.key.name === "className") {
            existing = property;
        }

        return existing;
    });

    state.path.node.arguments[1].properties.forEach(function(property) {
        var key = property.key.name || property.key.value;

        if(key !== "class" && key !== "className") {
            state.attrs.properties.push(property);

            return;
        }

        // Existence of either class or className is enough to trigger setting the default
        if(!existing) {
            existing = create.prop("className", t.stringLiteral(""));

            state.attrs.properties.push(existing);
        }

        if(key === "class") {
            // Match mithril behavior (leave it, but set it to undefined)
            state.attrs.properties.push(create.prop("class", t.identifier("undefined")));
            
            // Ignore empty "class" strings
            if(t.isStringLiteral(property.value) && property.value.value === "") {
                return;
            }
        }

        if(!existing.value.value.length) {
            existing.value = property.value;

            return;
        }

        // Literals get merged as a string, but only if they exist
        if(valid.isValueLiteral(property.value)) {
            if(property.value.value.length) {
                existing.value = t.stringLiteral(existing.value.value + " " + property.value.value);
            }
            
            return;
        }
            
        // Non-literals get combined w/ a "+"
        existing.value = t.binaryExpression("+",
            existing.value,
            t.binaryExpression("+",
                t.stringLiteral(" "),
                property.value
            )
        );

        return;
    });
}

// Modify children based on contents
function processChildren(state) {
    var size = state.nodes.elements.length,
        child, first;
    
    if(!size) {
        state.nodes = t.arrayExpression([]);
        
        return;
    }

    // Multiple nodes means we need to walk them
    if(size > 1) {
        state.nodes = t.arrayExpression(state.nodes.elements.map(function(node) {
            if(valid.isArrayExpressionArray(node)) {
                child = create.state();
                
                child.tag = t.stringLiteral("[");
                child.nodes = node;
                
                return create.vnode(child);
            }
            
            if(t.isArrayExpression(node)) {
                child = create.state();

                child.tag = t.stringLiteral("[");
                child.nodes = node;
                
                processChildren(child);

                return create.vnode(child);
            }
            
            if(valid.isValueLiteral(node)) {
                child = create.state();
                
                child.tag = t.stringLiteral("#");
                child.nodes = node;
                
                return create.vnode(child);
            }
            
            return node;
        }));

        return;
    }

    first = state.nodes.elements[0];

    // Array expressions that return arrays get unwrapped
    if(valid.isArrayExpressionArray(first)) {
        state.nodes = first;
        
        return;
    }
    
    if(valid.isValueLiteral(first) || valid.isArrayExpressionString(first)) {
        // m("div", "text") modifies the "text" property
        if(valid.isSafeTag(state)) {
            state.text = first;
            state.nodes = t.identifier("undefined");
            
            return;
        }

        // Otherwise create a text node (tag: "#") and set it as the sole child
        child = create.state();

        child.tag = t.stringLiteral("#");
        child.nodes = first;

        state.nodes = t.arrayExpression([ create.vnode(child) ]);

        return;
    }
    
    // Make sure we don't end up w/ [ [ ... ] ]
    if(t.isArrayExpression(first)) {
        state.nodes = t.arrayExpression(first.elements);
        
        processChildren(state);

        return;
    }
    
    return;
}

function process(path) {
    var state = create.state(),
        start = 1;
    
    state.path = path;

    parseSelector(state);
    
    // Is the second argument an object? Then it's attrs and they need to be parsed
    if(t.isObjectExpression(path.node.arguments[1])) {
        parseAttrs(state);

        start = 2;
    }

    // Make sure children is accurately sized
    if(path.node.arguments.length > start) {
        state.nodes = t.arrayExpression(path.node.arguments.slice(start));
    }
    
    processChildren(state);
    
    return state;
}

visitor = {
    CallExpression : function(path) {
        var state;
                    
        if(!valid.isMithril(path.node)) {
            return;
        }
        
        return path.replaceWith(create.vnode(state));
    }
};

module.exports = function() {
    return {
        visitor : visitor
    };
};
