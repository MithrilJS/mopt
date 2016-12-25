"use strict";

var assert = require("assert"),

    code = require("./lib/code");

describe("SVG", function() {
    it("should support svg selectors", function() {
        assert.equal(
            code(`m("svg")`),
            `m.vnode("svg",undefined,undefined,[],undefined,undefined);`
        );
    });
    
    it("should support nested svg selectors", function() {
        assert.equal(
            code(`m("svg", m("g"))`),
            `m.vnode("svg",undefined,undefined,[m.vnode("g",undefined,undefined,[],undefined,undefined)],undefined,undefined);`
        );
    });
});
