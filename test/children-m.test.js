"use strict";

var assert = require("assert"),

    code = require("./lib/code");

describe("mithril-objectify", function() {
    describe("Children", function() {
        describe("Nested m()", function() {
            it("should support nested m() invocations", function() {
                assert.deepEqual(
                    code('m("div", m("div"))'),
                    m("div", m("div"))
                );
            });
            
            it("should support arrays of nested m() invocations", function() {
                assert.deepEqual(
                    code('m("div", [ m("div") ])'),
                    m("div", [ m("div") ])
                );
                
                assert.deepEqual(
                    code('m("div", [ m("p") ])'),
                    m("div", [ m("p") ])
                );
                
                assert.deepEqual(
                    code('m("div", [ m("a[href=\'http://google.com\']") ])'),
                    m("div", [ m("a[href='http://google.com']") ])
                );
            });
            
            it("should support multiple nested m() invocations", function() {
                assert.deepEqual(
                    code('m("div", m("div"), m("i"), m("span"))'),
                    m("div", m("div"), m("i"), m("span"))
                );
            });
            
            it("should support attrs + nested m() invocations", function() {
                assert.deepEqual(
                    code('m("div", { title : "bar" }, m("div"))'),
                    m("div", { title : "bar" }, m("div"))
                );
            });
            
            it("should supported attrs + arrays of nested m() invocations", function() {
                assert.deepEqual(
                    code('m("div", { title : "bar" }, [ m("div") ])'),
                    m("div", { title : "bar" }, [ m("div") ])
                );
            });
            
            it("should support attrs + multiple nested m() invocations", function() {
                assert.deepEqual(
                    code('m("div", { title : "bar" }, m("div"), m("i"), m("span"))'),
                    m("div", { title : "bar" }, m("div"), m("i"), m("span"))
                );
            });
        });
    });
});
