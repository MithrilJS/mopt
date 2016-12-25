"use strict";

var assert = require("assert"),

    code = require("./lib/code");

describe("Attributes", function() {
    describe("key", function() {
        it("should extract the key attribute (number)", function() {
            assert.equal(
                code(`m("div", { key : 1 })`),
                `m.vnode("div",1,undefined,[],undefined,undefined);`
            );
        });

        it("should extract the key attribute (string)", function() {
            assert.equal(
                code(`m("div", { key : "1" })`),
                `m.vnode("div","1",undefined,[],undefined,undefined);`
            );
        });

        it("should extract the key attribute (boolean)", function() {
            assert.equal(
                code(`m("div", { key : true })`),
                `m.vnode("div",true,undefined,[],undefined,undefined);`
            );
        });

        it("should extract the key attribute (identifier)", function() {
            assert.equal(
                code(`m("div", { key : fooga })`),
                `m.vnode("div",fooga,undefined,[],undefined,undefined);`
            );
        });
    });
});
