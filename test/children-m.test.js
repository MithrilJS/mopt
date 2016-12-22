"use strict";

var assert = require("assert"),

    code = require("./lib/code");

describe.skip("mithril-objectify", function() {
    describe("Children", function() {
        describe("Nested m()", function() {
            it("should support nested m() invocations", function() {
                assert.equal(
                    code(`m("div", m("div"))`),
                    `m.vnode("div", m("div"))`
                );
            });
            
            it("should support arrays of nested m() invocations", function() {
                assert.equal(
                    code(`m("div", [ m("div") ])`),
                    `m.vnode("div", [ m("div") ])`
                );
                
                assert.equal(
                    code(`m("div", [ m("p") ])`),
                    `m.vnode("div", [ m("p") ])`
                );
                
                assert.equal(
                    code(`m("div", [ m("a[href=\'http://google.com\']") ])`),
                    `m.vnode("div", [ m("a[href='http://google.com']") ])`
                );
            });
            
            it("should support multiple nested m() invocations", function() {
                assert.equal(
                    code(`m("div", m("div"), m("i"), m("span"))`),
                    `m.vnode("div", m("div"), m("i"), m("span"))`
                );
            });
            
            it("should support attrs + nested m() invocations", function() {
                assert.equal(
                    code(`m("div", { title : "bar" }, m("div"))`),
                    `m.vnode("div", { title : "bar" }, m("div"))`
                );
            });
            
            it("should supported attrs + arrays of nested m() invocations", function() {
                assert.equal(
                    code(`m("div", { title : "bar" }, [ m("div") ])`),
                    `m.vnode("div", { title : "bar" }, [ m("div") ])`
                );
            });
            
            it("should support attrs + multiple nested m() invocations", function() {
                assert.equal(
                    code(`m("div", { title : "bar" }, m("div"), m("i"), m("span"))`),
                    `m.vnode("div", { title : "bar" }, m("div"), m("i"), m("span"))`
                );
            });
        });
    });
});
