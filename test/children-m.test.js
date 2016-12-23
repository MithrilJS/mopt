"use strict";

var assert = require("assert"),

    code = require("./lib/code");

describe("Children", function() {
    describe("Nested m()", function() {
        it("should support nested m() invocations", function() {
            assert.equal(
                code(`m("div", m("div"))`),
                `m.vnode("div",undefined,undefined,[m.vnode("div",undefined,undefined,[],undefined,undefined)],undefined,undefined);`
            );
        });
        
        it("should support arrays of nested m() invocations", function() {
            assert.equal(
                code(`m("div", [ m("div") ])`),
                `m.vnode("div",undefined,undefined,[m.vnode("div",undefined,undefined,[],undefined,undefined)],undefined,undefined);`
            );
            
            assert.equal(
                code(`m("div", [ m("a[href='http://google.com']") ])`),
                `m.vnode("div",undefined,undefined,[m.vnode("a",undefined,{href:"http://google.com"},[],undefined,undefined)],undefined,undefined);`
            );
            
            assert.equal(
                code(`m("div", [ m("p"), m("i") ])`),
                `m.vnode("div",undefined,undefined,[m.vnode("p",undefined,undefined,[],undefined,undefined),m.vnode("i",undefined,undefined,[],undefined,undefined)],undefined,undefined);`
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
                code(`m("div", m("div"), m("i"), m("span"))`),
                `m.vnode("div",undefined,undefined,m.vnode.normalizeChildren([m.vnode("div",undefined,undefined,[],undefined,undefined),m.vnode("i",undefined,undefined,[],undefined,undefined),m.vnode("span",undefined,undefined,[],undefined,undefined)]),undefined,undefined);`
            );
        });
        
        it("should support attrs + nested m() invocations", function() {
            assert.equal(
                code(`m("div", { title : "bar" }, m("div"))`),
                `m.vnode("div",undefined,{title:"bar"},[m.vnode("div",undefined,undefined,[],undefined,undefined)],undefined,undefined);`
            );
        });
        
        it("should supported attrs + arrays of nested m() invocations", function() {
            assert.equal(
                code(`m("div", { title : "bar" }, [ m("div") ])`),
                `m.vnode("div",undefined,{title:"bar"},[m.vnode("div",undefined,undefined,[],undefined,undefined)],undefined,undefined);`
            );
        });
        
        it("should support attrs + multiple nested m() invocations", function() {
            assert.equal(
                code(`m("div", { title : "bar" }, m("div"), m("i"), m("span"))`),
                `m.vnode("div",undefined,{title:"bar"},m.vnode.normalizeChildren([m.vnode("div",undefined,undefined,[],undefined,undefined),m.vnode("i",undefined,undefined,[],undefined,undefined),m.vnode("span",undefined,undefined,[],undefined,undefined)]),undefined,undefined);`
            );
        });
    });
});
