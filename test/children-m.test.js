"use strict";

var assert = require("assert"),

    code = require("./lib/code");

describe("Children", function() {
    describe("Nested m()", function() {
        it("should support nested m() invocations", function() {
            assert.equal(
                code(`m("0", m("div"))`),
                `m.vnode("0",undefined,undefined,[m.vnode("div",undefined,undefined,[],undefined,undefined)],undefined,undefined);`
            );
        });
        
        it("should support an array with an m() invocation", function() {
            assert.equal(
                code(`m("0", [ m("div") ])`),
                `m.vnode("0",undefined,undefined,[m.vnode("div",undefined,undefined,[],undefined,undefined)],undefined,undefined);`
            );
        });
        
        it("should support an array with m() invocations", function() {
            assert.equal(
                code(`m("0", [ m("p"), m("i") ])`),
                `m.vnode("0",undefined,undefined,[m.vnode("p",undefined,undefined,[],undefined,undefined),m.vnode("i",undefined,undefined,[],undefined,undefined)],undefined,undefined);`
            );
        });

        it("should support arrays of nested m() invocations & plain nodes", function() {
            assert.equal(
                code(`m("one", [ m("two"), "three" ])`),
                `m.vnode("one",undefined,undefined,[m.vnode("two",undefined,undefined,[],undefined,undefined),m.vnode("#",undefined,undefined,"three",undefined,undefined)],undefined,undefined);`
            );
        });
        
        it("should support multiple nested m() invocations", function() {
            assert.equal(
                code(`m("0", m("div"), m("i"), m("span"))`),
                `m.vnode("0",undefined,undefined,[m.vnode("div",undefined,undefined,[],undefined,undefined),m.vnode("i",undefined,undefined,[],undefined,undefined),m.vnode("span",undefined,undefined,[],undefined,undefined)],undefined,undefined);`
            );
        });
        
        it("should support attrs + nested m() invocations", function() {
            assert.equal(
                code(`m("0", { title : "bar" }, m("div"))`),
                `m.vnode("0",undefined,{title:"bar"},[m.vnode("div",undefined,undefined,[],undefined,undefined)],undefined,undefined);`
            );
        });
        
        it("should supported attrs + arrays of nested m() invocations", function() {
            assert.equal(
                code(`m("0", { title : "bar" }, [ m("div") ])`),
                `m.vnode("0",undefined,{title:"bar"},[m.vnode("div",undefined,undefined,[],undefined,undefined)],undefined,undefined);`
            );
        });
        
        it("should support attrs + multiple nested m() invocations", function() {
            assert.equal(
                code(`m("0", { title : "bar" }, m("div"), m("i"), m("span"))`),
                `m.vnode("0",undefined,{title:"bar"},[m.vnode("div",undefined,undefined,[],undefined,undefined),m.vnode("i",undefined,undefined,[],undefined,undefined),m.vnode("span",undefined,undefined,[],undefined,undefined)],undefined,undefined);`
            );
        });
    });
});
