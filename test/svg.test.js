"use strict";

var assert = require("assert"),

    code = require("./lib/code");

describe("mithril-objectify", function() {
    describe("SVG", function() {
        it("should support svg selectors", function() {
            assert.deepEqual(
                code('m("svg")'),
                m("svg")
            );
        });
        
        it("should support nested svg selectors", function() {
            assert.deepEqual(
                code('m("svg", m("g"))'),
                m("svg", m("g"))
            );
        });
    });
});
