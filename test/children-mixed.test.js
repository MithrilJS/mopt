"use strict";

var assert = require("assert"),

    code = require("./lib/code");

describe("Children", function() {
    describe("Mixed Children", function() {
        it("should support mixed array and literal children", function() {
            assert.equal(
                code(`m("div", [ 1 ], 2)`),
                `m.vnode("div",undefined,undefined,m.vnode.normalizeChildren([[1],2]),undefined,undefined);`
            );
        });
        
        it("should support multiple arrays of children", function() {
            assert.equal(
                code(`m("div", [ 1, 2, 3 ], [ 4, 5, 6, 7 ])`),
                `m.vnode("div",undefined,undefined,m.vnode.normalizeChildren([[1,2,3],[4,5,6,7]]),undefined,undefined);`
            );
            
            assert.equal(
                code(`m("div", [ 1 ], [ 2 ], [ 3 ])`),
                `m.vnode("div",undefined,undefined,m.vnode.normalizeChildren([[1],[2],[3]]),undefined,undefined);`
            );
        });
    });
});
