"use strict";

var assert = require("assert"),

    code = require("./lib/code");

describe.skip("mithril-objectify", function() {
    describe("SVG", function() {
        it("should support svg selectors", function() {
            assert.equal(
                code(`m("svg")`),
                `m.vnode("svg")`
            );
        });
        
        it("should support nested svg selectors", function() {
            assert.equal(
                code(`m("svg", m("g"))`),
                `m.vnode("svg", m("g"))`
            );
        });
    });
});
