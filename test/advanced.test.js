"use strict";

var assert = require("assert"),

    m     = require("mithril/render/hyperscript"),

    run    = require("./lib/run"),
    code   = require("./lib/code");

describe("mithril-objectify", function() {
    it("Dynamic classes", function() {
        assert.deepEqual(
            run('m("input.fooga", { class : true ? "true" : "false" })'),
            m("input.fooga", { class : true ? "true" : "false" }) // eslint-disable-line
        );
    });

    it("Empty selector", function() {
        assert.deepEqual(
            run('m("")'),
            m("")
        );
    });

    it("Selector w/ id", function() {
        assert.deepEqual(
            run('m("#fooga")'),
            m("#fooga")
        );
    });
    
    it("Selector w/ attribute w/ no value", function() {
        assert.deepEqual(
            run('m("div[fooga]")'),
            m("div[fooga]")
        );
    });

    it("Non-string attr values", function() {
        assert.deepEqual(
            run('m("div", { fooga : 0 })'),
            m("div", { fooga : 0 })
        );
        
        assert.deepEqual(
            run('m("div", { fooga : false })'),
            m("div", { fooga : false })
        );
        
        assert.deepEqual(
            run('m("div", { fooga : null })'),
            m("div", { fooga : null })
        );
        
        assert.deepEqual(
            run('m("div", { fooga : undefined })'),
            m("div", { fooga : undefined })
        );
    });

    it("Quoted properties (issue #6)", function() {
        /* eslint quote-props:0 */
        assert.deepEqual(
            run('m("div", { "fooga" : 0 })'),
            m("div", { "fooga" : 0 })
        );
    });

    it("Nested m()", function() {
        assert.deepEqual(
            run('m("div", m("div"))'),
            m("div", m("div"))
        );
        
        assert.deepEqual(
            run('m("div", m("div", m("div")), m("div"))'),
            m("div", m("div", m("div")), m("div"))
        );
    });

    
    it("should not transform unsafe invocations", function() {
        // Ensure that the selector must be literal
        assert.equal(
            code('m(".fooga" + dynamic)'),
            'm(".fooga"+dynamic);'
        );
        
        // Identifiers can't be resolved at compile time, so ignore
        assert.equal(
            code('m(".fooga", identifier)'),
            'm(".fooga",identifier);'
        );
    });
    
    it("should output correct source maps", function() {
        assert.equal(
            code('m(".fooga")', { sourceMaps : "inline" }),
            '({tag:"div",attrs:{className:"fooga"},children:[],dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined});\n' +
            "//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVua25vd24iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoidW5rbm93biIsInNvdXJjZXNDb250ZW50IjpbIm0oXCIuZm9vZ2FcIikiXX0="
        );
    });
    
    describe("hyphenated attributes (issue #35)", function() {
        it("should support hyphenated attributes in the selector", function() {
            assert.deepEqual(
                run('m(".fooga[wooga-booga=1]")'),
                m(".fooga[wooga-booga=1]")
            );
        });
        
        it("should support hyphenated attributes as an attribute", function() {
            assert.deepEqual(
                run('m(".fooga", { "wooga-booga" : 1 })'),
                m(".fooga", { "wooga-booga" : 1 })
            );
        });
    });
    
    describe("Selector w/ BinaryExpression", function() {
        it("should convert simple literal addition", function() {
            assert.equal(
                code('m("input" + ".pure-u")'),
                '({tag:"input",attrs:{className:"pure-u"},children:[],dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined});'
            );
            
            assert.equal(
                code('m("input.a" + 3)'),
                '({tag:"input",attrs:{className:"a3"},children:[],dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined});'
            );
            
            assert.equal(
                code('m("input." + true)'),
                '({tag:"input",attrs:{className:"true"},children:[],dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined});'
            );
        });
        
        it("should not convert other operators", function() {
            assert.equal(
                code('m("input" - 2)'),
                'm("input"-2);'
            );
            
            assert.equal(
                code("m(3 * 2)"),
                "m(3*2);"
            );
        });
        
        it("should not convert more than 2 values", function() {
            assert.equal(
                code('m("input" + ".pure-u" + ".pure-u-1-2")'),
                'm("input"+".pure-u"+".pure-u-1-2");'
            );
        });
        
        it("should not convert non-literal values", function() {
            assert.equal(
                code('m("input" + identifier)'),
                'm("input"+identifier);'
            );
        });
    });

    

    describe("String children", function() {
        it("should support one", function() {
            assert.deepEqual(
                run('m("div", "fooga")'),
                m("div", "fooga")
            );
        });
        
        it("should support expressions", function() {
            assert.equal(
                code('m("div", "fooga" + "wooga")'),
                '({tag:"div",attrs:undefined,children:["fooga"+"wooga"],dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined});'
            );
        });
        
        it("should support String.prototype methods", function() {
            assert.equal(
                code('m("div", "fooga".replace("f", "g"))'),
                '({tag:"div",attrs:undefined,children:["fooga".replace("f","g")],dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined});'
            );
            
            assert.equal(
                code('m("div", "fooga"["replace"]("f", "g"))'),
                '({tag:"div",attrs:undefined,children:["fooga"["replace"]("f","g")],dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined});'
            );
        });
    });

    describe("Array.prototype comprehension", function() {
        it("should unwrap Array.prototype children that return an array", function() {
            assert.deepEqual(
                code('m("div", [ 1, 2 ].map(function(val) { return val; }))'),
                '({tag:"div",attrs:undefined,children:[1,2].map(function(val){return val;}),dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined});'
            );

            assert.deepEqual(
                code('m("div", [ 1, 2 ].filter(function(val) { return val === 1; }))'),
                '({tag:"div",attrs:undefined,children:[1,2].filter(function(val){return val===1;}),dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined});'
            );

            assert.deepEqual(
                code('m("div", [ 1, 2 ].sort())'),
                '({tag:"div",attrs:undefined,children:[1,2].sort(),dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined});'
            );
        });
        
        it("should handle Array.prototype methods that return a string", function() {
            // TODO: I think this is actually wrong
            assert.equal(
                code('m("div", [ 1, 2 ].join(""))'),
                '({tag:"div",attrs:undefined,children:undefined,dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:[1,2].join("")});'
            );
            
            // Yes this looks insane, but it's still valid
            assert.equal(
                code('m("div", [ 1, 2 ]["join"](""))'),
                '({tag:"div",attrs:undefined,children:undefined,dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:[1,2]["join"]("")});'
            );
        });
        
        it("shouldn't unwrap Array.prototype children when they don't return an array", function() {
            assert.equal(
                code('m("div", [ 1, 2 ].forEach(function(val) { return val === 1 }))'),
                'm("div",[1,2].forEach(function(val){return val===1;}));'
            );
            
            assert.equal(
                code('m("div", [ 1, 2 ].some(function(val) { return val === 1 }))'),
                'm("div",[1,2].some(function(val){return val===1;}));'
            );
        });
    });

    describe("Conditional expression children", function() {
        it("should convert when all entries are literals", function() {
            assert.equal(
                code('m("div", foo ? "bar" : "baz")'),
                '({tag:"div",attrs:undefined,children:[foo?"bar":"baz"],dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined});'
            );
        });
        
        it("should not convert when entries are not literals", function() {
            // Can't convert this, dunno what `bar` is
            assert.equal(
                code('m("div", foo ? bar : "baz")'),
                'm("div",foo?bar:"baz");'
            );
            
            assert.equal(
                code('m("div", foo ? { class : options.class } : null)'),
                'm("div",foo?{class:options.class}:null);'
            );
        });
    });

    describe("JSON function children", function() {
        it("should know that JSON.stringify is safe", function() {
            assert.equal(
                code('m("div", JSON.stringify({}))'),
                '({tag:"div",attrs:undefined,children:[JSON.stringify({})],dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined});'
            );
        });
        
        it("shouldn't transform JSON.parse since it may not be safe", function() {
            assert.equal(
                code('m("div", JSON.parse({}))'),
                'm("div",JSON.parse({}));'
            );
        });
    });
});
