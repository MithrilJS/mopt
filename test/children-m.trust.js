"use strict";

var assert = require("assert"),

    code = require("./lib/code");

describe("Children", function() {
    describe("Nested m.trust()", function() {
        it("should support nested m.trust() invocations", function() {
            assert.equal(
                code(`m("1", m.trust("1"))`),
                `m.vnode("1",undefined,undefined,[m.vnode("<",undefined,undefined,"1",undefined,undefined)],undefined,undefined);`
            );
        });
        
        it("should support a single-item array of nested m.trust() invocations", function() {
            assert.equal(
                code(`m("1", [ m.trust("2") ])`),
                `m.vnode("1",undefined,undefined,[m.vnode("<",undefined,undefined,"2",undefined,undefined)],undefined,undefined);`
            );
        });

        it("should support a multi-item array of nested m.trust() invocations", function() {
            assert.equal(
                code(`m("1", [ m.trust("2"), m.trust("3") ])`),
                `m.vnode("1",undefined,undefined,[m.vnode("<",undefined,undefined,"2",undefined,undefined),m.vnode("<",undefined,undefined,"3",undefined,undefined)],undefined,undefined);`
            );
        });

        it("should support arrays of nested m.trust() invocations & plain nodes", function() {
            assert.equal(
                code(`m("1", [ m("2"), "3" ])`),
                `m.vnode("1",undefined,undefined,[m.vnode("2",undefined,undefined,[],undefined,undefined),m.vnode("#",undefined,undefined,"3",undefined,undefined)],undefined,undefined);`
            );
        });
        
        it("should support multiple nested m.trust() invocations", function() {
            assert.equal(
                code(`m("1", m.trust("2"), m.trust("3"), m.trust("4"))`),
                `m.vnode("1",undefined,undefined,[m.vnode("<",undefined,undefined,"2",undefined,undefined),m.vnode("<",undefined,undefined,"3",undefined,undefined),m.vnode("<",undefined,undefined,"4",undefined,undefined)],undefined,undefined);`
            );
        });
        
        it("should support attrs + nested m.trust() invocations", function() {
            assert.equal(
                code(`m("1", { title : "bar" }, m.trust("2"))`),
                `m.vnode("1",undefined,{title:"bar"},[m.vnode("<",undefined,undefined,"2",undefined,undefined)],undefined,undefined);`
            );
        });
        
        it("should supported attrs + arrays of nested m.trust() invocations", function() {
            assert.equal(
                code(`m("1", { title : "bar" }, [ m.trust("2") ])`),
                `m.vnode("1",undefined,{title:"bar"},[m.vnode("<",undefined,undefined,"2",undefined,undefined)],undefined,undefined);`
            );
        });
        
        it("should support attrs + multiple nested m.trust() invocations", function() {
            assert.equal(
                code(`m("1", { title : "bar" }, m.trust("2"), m.trust("3"), m.trust("4"))`),
                `m.vnode("1",undefined,{title:"bar"},[m.vnode("<",undefined,undefined,"2",undefined,undefined),m.vnode("<",undefined,undefined,"3",undefined,undefined),m.vnode("<",undefined,undefined,"4",undefined,undefined)],undefined,undefined);`
            );
        });
    });
});
