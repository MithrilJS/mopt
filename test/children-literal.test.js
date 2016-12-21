"use strict";

var assert = require("assert"),
    
    code = require("./lib/code");

describe("mithril-objectify", function() {
    describe("Children", function() {
        describe.only("literal children", function() {
            it("should optimize the empty selector", function() {
                assert.deepEqual(
                    code('m("")'),
                    `m.vnode("div",undefined,undefined,[],undefined,undefined);`
                );
            });

            it("should optimize a selector containing a tag", function() {
                assert.equal(
                    code(`m("p")`),
                    `m.vnode("p",undefined,undefined,[],undefined,undefined);`
                );
            });

            it("should optimize a selector containing only an id", function() {
                assert.deepEqual(
                    code('m("#fooga")'),
                    `m.vnode("div",undefined,{id:"fooga"},[],undefined,undefined);`
                );
            });

            it("should optimize a selector containing an attribute w/o a value", function() {
                assert.deepEqual(
                    code('m("div[fooga]")'),
                    `m.vnode("div[fooga]")`
                );
            });

            it("should support single literal children (string)", function() {
                assert.deepEqual(
                    code('m("div", "test")'),
                    `m.vnode("div", "test")`
                );
            });

            it("should support expressions with literal values (strings)", function() {
                assert.equal(
                    code('m("div", "fooga" + "wooga")'),
                    '({tag:"div",attrs:undefined,children:["fooga"+"wooga"],dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined});'
                );
            });

            it("should support expressions with literal values (numbers)", function() {
                assert.equal(
                    code('m("div", 1 + 2)'),
                    '({tag:"div",attrs:undefined,children:["fooga"+"wooga"],dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined});'
                );
            });

            it("should support expressions with literal values (strings + numbers)", function() {
                assert.equal(
                    code('m("div", 1 + "wooga")'),
                    '({tag:"div",attrs:undefined,children:["fooga"+"wooga"],dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined});'
                );
            });

            it("should not convert expressions with operators other than +", function() {
                assert.equal(
                    code('m("input" - 2)'),
                    'm("input"-2);'
                );
                
                assert.equal(
                    code("m(3 * 2)"),
                    "m(3*2);"
                );
            });
            
            // TODO: why not?
            it.skip("should not convert expressions containing more than 2 values", function() {
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

            it("should not transform invocations containing identifiers", function() {
                // Identifiers can't be resolved at compile time, so ignore
                assert.equal(
                    code('m(".fooga", identifier)'),
                    'm(".fooga",identifier);'
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
            
            it("should support single literal children (undefined)", function() {
                assert.deepEqual(
                    code('m("div", [ undefined ])'),
                    `m.vnode("div", [ undefined ])`
                );
            });
            
            it("should support single literal children (object)", function() {
                assert.deepEqual(
                    code('m("div", [ { foo : "bar" } ])'),
                    `m.vnode("div", [ { foo : "bar" } ])`
                );
            });
            
            it("should multiple literal children", function() {
                assert.deepEqual(
                    code('m("div", "test", "test2")'),
                    `m.vnode("div", "test", "test2")`
                );
            });
            
            it("should support attrs + single children", function() {
                assert.deepEqual(
                    code('m("div", { title : "bar" }, "test")'),
                    `m.vnode("div", { title : "bar" }, "test")`
                );
            });
            
            it("should support attrs + multiple children", function() {
                assert.deepEqual(
                    code('m("div", { title : "bar" }, "test0", "test1", "test2", "test3")'),
                    `m.vnode("div", { title : "bar" }, "test0", "test1", "test2", "test3")`
                );
            });
        });
    });
});
