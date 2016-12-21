"use strict";

var code = require("./lib/code");

describe.skip("mithril-objectify", function() {
    describe("Children", function() {
        describe("Array Children", function() {
            it("should support array children", function() {
                assert.deepEqual(
                    code('m("div", [ "test" ])'),
                    `m.vnode("div", [ "test" ])`
                );
                
                assert.deepEqual(
                    code('m("div", [ 1, 2, 3 ])'),
                    `m.vnode("div", [ 1, 2, 3 ])`
                );
            });
            
            it("should support attrs + array children", function() {
                assert.deepEqual(
                    code('m("div", { title : "bar" }, [ "test" ])'),
                    `m.vnode("div", { title : "bar" }, [ "test" ])`
                );
            });

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
            
            it("should support Array.prototype comprehensions when there are multiple children", function() {
                assert.deepEqual(
                    code('m("div", [ 1, 2 ], [ 3, 4 ].map(function(val) { return val; }))'),
                    '({tag:"div",attrs:undefined,children:[{tag:"[",attrs:undefined,children:[{tag:"#",attrs:undefined,children:1,dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined},{tag:"#",attrs:undefined,children:2,dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined}],dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined},{tag:"[",attrs:undefined,children:[3,4].map(function(val){return val;}),dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined}],dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined});'
                );
            });
            
            it("should handle Array.prototype methods that return a string", function() {
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
            
            it("shouldn't attempt to transform array.prototype methods on unknown targets", function() {
                assert.equal(
                    code('m("div", a.map(function(val) { return val; }))'),
                    'm("div",a.map(function(val){return val;}));'
                );
            });
        });
    });
});
