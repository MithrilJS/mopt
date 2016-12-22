"use strict";

var assert = require("assert"),
    
    code = require("./lib/code");

describe("Children", function() {
    describe("literal children", function() {
        it("should support single literal children (string)", function() {
            assert.equal(
                code(`m("div", "test")`),
                `m.vnode("div",undefined,undefined,undefined,"test",undefined);`
            );
        });

        it("should support single literal children (number)", function() {
            assert.equal(
                code(`m("div", 1)`),
                `m.vnode("div",undefined,undefined,undefined,1,undefined);`
            );
        });

        it("should support single literal children (boolean)", function() {
            assert.equal(
                code(`m("div", true)`),
                `m.vnode("div",undefined,undefined,undefined,true,undefined);`
            );
        });

        it("should support multiple literal children", function() {
            assert.equal(
                code(`m("div", "test", "test2")`),
                `m.vnode("div",undefined,undefined,m.vnode.normalizeChildren(["test","test2"]),undefined,undefined);`
            );
        });
        
        it("should support attrs + single literal children children", function() {
            assert.equal(
                code(`m("div", { title : "bar" }, "test")`),
                `m.vnode("div",undefined,{title:"bar"},undefined,"test",undefined);`
            );
        });
        
        it("should support attrs + multiple children", function() {
            assert.equal(
                code(`m("div", { title : "bar" }, "test0", "test1", "test2", "test3")`),
                `m.vnode("div",undefined,{title:"bar"},m.vnode.normalizeChildren(["test0","test1","test2","test3"]),undefined,undefined);`
            );
        });

        it("should not transform invocations containing identifiers", function() {
            // Identifiers can't be resolved at compile time, so ignore
            assert.equal(
                code(`m(".fooga", identifier)`),
                `m(".fooga",identifier);`
            );
        });
        
        it.skip("should support String.prototype methods", function() {
            assert.equal(
                code(`m("div", "fooga".replace("f", "g"))`),
                `({tag:"div",attrs:undefined,children:["fooga".replace("f","g")],dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined});`
            );
            
            assert.equal(
                code(`m("div", "fooga"["replace"]("f", "g"))`),
                `({tag:"div",attrs:undefined,children:["fooga"["replace"]("f","g")],dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined});`
            );
        });
    });
});
