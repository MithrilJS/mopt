"use strict";

var assert = require("assert"),
    
    code = require("./lib/code");

describe("mithril-objectify", function() {
    describe("Children", function() {
        describe.only("literal children", function() {
            it("should support the empty selector", function() {
                assert.equal(
                    code('m("")'),
                    `m.vnode("div",undefined,undefined,[],undefined,undefined);`
                );
            });

            it("should support a selector containing a tag", function() {
                assert.equal(
                    code(`m("p")`),
                    `m.vnode("p",undefined,undefined,[],undefined,undefined);`
                );
            });

            it("should support a selector containing only an id", function() {
                assert.equal(
                    code('m("#fooga")'),
                    `m.vnode("div",undefined,{id:"fooga"},[],undefined,undefined);`
                );
            });

            it("should support a selector containing an attribute w/o a value", function() {
                assert.equal(
                    code('m("div[fooga]")'),
                    `m.vnode("div",undefined,{fooga:true},[],undefined,undefined);`
                );
            });

            it("should support single literal children (string)", function() {
                assert.equal(
                    code('m("div", "test")'),
                    `m.vnode("div",undefined,undefined,undefined,"test",undefined);`
                );
            });

            it("should support single literal children (undefined)", function() {
                assert.equal(
                    code('m("div", [ undefined ])'),
                    `m.vnode("div",undefined,undefined,[undefined],undefined,undefined);`
                );
            });
            
            it("should support single literal children (object)", function() {
                assert.equal(
                    code('m("div", [ { foo : "bar" } ])'),
                    `m.vnode("div",undefined,undefined,[{foo:"bar"}],undefined,undefined);`
                );
            });
            
            it.only("should support multiple literal children", function() {
                assert.equal(
                    code('m("div", "test", "test2")'),
                    `m.vnode("div",undefined,undefined,[m.vnode("#",undefined,undefined,undefined,"test",undefined),m.vnode("#",undefined,undefined,undefined,"test2",undefined)],undefined,undefined);`
                );
            });
            
            it("should support attrs + single children", function() {
                assert.equal(
                    code('m("div", { title : "bar" }, "test")'),
                    `m.vnode("div",undefined,{title:"bar"},undefined,"test",undefined);`
                );
            });
            
            it("should support attrs + multiple children", function() {
                assert.equal(
                    code('m("div", { title : "bar" }, "test0", "test1", "test2", "test3")'),
                    `m.vnode("div", { title : "bar" }, "test0", "test1", "test2", "test3")`
                );
            });

            it.skip("should support expressions with literal values (strings)", function() {
                assert.equal(
                    code('m("div", "fooga" + "wooga")'),
                    '({tag:"div",attrs:undefined,children:["fooga"+"wooga"],dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined});'
                );
            });

            it.skip("should support expressions with literal values (numbers)", function() {
                assert.equal(
                    code('m("div", 1 + 2)'),
                    '({tag:"div",attrs:undefined,children:["fooga"+"wooga"],dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined});'
                );
            });

            it.skip("should support expressions with literal values (strings + numbers)", function() {
                assert.equal(
                    code('m("div", 1 + "wooga")'),
                    '({tag:"div",attrs:undefined,children:["fooga"+"wooga"],dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined});'
                );
            });

            it.skip("should not convert expressions with operators other than +", function() {
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
            
            it.skip("should not convert non-literal values", function() {
                assert.equal(
                    code('m("input" + identifier)'),
                    'm("input"+identifier);'
                );
            });

            it.skip("should not transform invocations containing identifiers", function() {
                // Identifiers can't be resolved at compile time, so ignore
                assert.equal(
                    code('m(".fooga", identifier)'),
                    'm(".fooga",identifier);'
                );
            });
            
            it.skip("should support String.prototype methods", function() {
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
    });
});
