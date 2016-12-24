"use strict";

var assert = require("assert"),
    
    code = require("./lib/code");

describe("Children", function() {
    describe("Array Children", function() {
        it("should support array children w/ 1 entry", function() {
            assert.equal(
                code(`m("0", [ 1 ])`),
                `m.vnode("0",undefined,undefined,undefined,1,undefined);`
            );

            assert.equal(
                code(`m("0", [ "1" ])`),
                `m.vnode("0",undefined,undefined,undefined,"1",undefined);`
            );

            assert.equal(
                code(`m("0", [ \`1\` ])`),
                `m.vnode("0",undefined,undefined,undefined,\`1\`,undefined);`
            );
        });

        it("should support attrs + array children w/ 1 entry", function() {
            assert.equal(
                code(`m("0", { title : "bar" }, [ 1 ])`),
                `m.vnode("0",undefined,{title:"bar"},undefined,1,undefined);`
            );
        });
        
        it("should support array children w/ > 1 entry", function() {
            assert.equal(
                code(`m("0", [ 1, 2 ])`),
                `m.vnode("0",undefined,undefined,[m.vnode("#",undefined,undefined,1,undefined,undefined),m.vnode("#",undefined,undefined,2,undefined,undefined)],undefined,undefined);`
            );
        });

        it("should support attrs + array children w/ > 1 entry", function() {
            assert.equal(
                code(`m("0", { title : "bar" }, [ 1, 2, 3 ])`),
                `m.vnode("0",undefined,{title:"bar"},[m.vnode("#",undefined,undefined,1,undefined,undefined),m.vnode("#",undefined,undefined,2,undefined,undefined),m.vnode("#",undefined,undefined,3,undefined,undefined)],undefined,undefined);`
            );
        });

        it("should support Array.prototype children that return an array", function() {
            assert.equal(
                code(`m("0", [ 1, 2 ].map(function(val) { return val; }))`),
                `m.vnode("0",undefined,undefined,[1,2].map(function(val){return val;}),undefined,undefined);`
            );

            assert.equal(
                code(`m("0", [ 1, 2 ].filter(function(val) { return val === 1; }))`),
                `m.vnode("0",undefined,undefined,[1,2].filter(function(val){return val===1;}),undefined,undefined);`
            );
        });
        
        it("shouldn't unwrap Array.prototype children that do not return an array", function() {
            assert.equal(
                code(`m("0", [ 1, 2 ].forEach(function(val) { return val === 1 }))`),
                `m("0",[1,2].forEach(function(val){return val===1;}));`
            );
            
            assert.equal(
                code(`m("0", [ 1, 2 ].some(function(val) { return val === 1 }))`),
                `m("0",[1,2].some(function(val){return val===1;}));`
            );
        });

        it("shouldn't unwrap Array.prototype children with a non-array object", function() {
            assert.equal(
                code(`m("0", a.map(function(val) { return val; }))`),
                `m("0",a.map(function(val){return val;}));`
            );
        });

        it("should support Array.prototype comprehensions when there are multiple children", function() {
            assert.equal(
                code(`m("0", [ 1 ], [ 2 ].map(function(val) { return val; }))`),
                `m.vnode("0",undefined,undefined,[m.vnode("[",undefined,undefined,[m.vnode("#",undefined,undefined,1,undefined,undefined)],undefined,undefined),[2].map(function(val){return val;})],undefined,undefined);`
            );
        });
        
        it("should handle Array.prototype methods that return a string", function() {
            assert.equal(
                code(`m("0", [ 1, 2 ].join(""))`),
                `m.vnode("0",undefined,undefined,undefined,[1,2].join(""),undefined);`
            );
            
            // Yes this looks insane, but it's still valid
            assert.equal(
                code(`m("0", [ 1, 2 ]["join"](""))`),
                `m.vnode("0",undefined,undefined,undefined,[1,2]["join"](""),undefined);`
            );
        });
    });
});
