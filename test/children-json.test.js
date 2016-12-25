"use strict";

var assert = require("assert"),

    code   = require("./lib/code");

describe("Children", function() {
    describe("JSON.prototype children", function() {
        it("should know that JSON.stringify is safe", function() {
            assert.equal(
                code(`m("div", JSON.stringify({}))`),
                `m.vnode("div",undefined,undefined,undefined,JSON.stringify({}),undefined);`
            );
        });
        
        it("shouldn't transform JSON.parse since it may not be safe", function() {
            assert.equal(
                code(`m("div", JSON.parse({}))`),
                `m("div",JSON.parse({}));`
            );
        });
    });
});
