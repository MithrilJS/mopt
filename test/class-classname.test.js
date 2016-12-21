"use strict";

var assert = require("assert"),

    code = require("./lib/code");

describe("mithril-objectify", function() {
    describe("Attributes: class vs className", function() {
        it("should combine tag class & attr class", function() {
            assert.deepEqual(
                code('m(".foo", { class : "bar" })'),
                m(".foo", { class : "bar" })
            );
        });

        it("should combine tag class & attr className", function() {
            assert.deepEqual(
                code('m(".foo", { className : "bar" })'),
                m(".foo", { className : "bar" })
            );
        });
        
        it("should combine tag class & attr className", function() {
            assert.deepEqual(
                code('m(".foo[checked]", { className : "bar" })'),
                m(".foo[checked]", { className : "bar" })
            );
        });
        
        it("selector class, empty className attr", function() {
            assert.deepEqual(
                code('m(".foo", { className : "" })'),
                m(".foo", { className : "" })
            );
        });

        it("no selector class, empty className attr", function() {
            assert.deepEqual(
                code('m("div", { className : "" })'),
                m("div", { className : "" })
            );
        });

        it("no selector class, empty class attr", function() {
            assert.deepEqual(
                code('m("div", { class : "" })'),
                m("div", { class : "" })
            );
        });
    });
});
