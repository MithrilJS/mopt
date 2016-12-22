"use strict";

var assert = require("assert"),

    code = require("./lib/code");

describe.skip("mithril-objectify", function() {
    describe("Children", function() {
        describe("Mixed Children", function() {
            it("should support mixed array and literal children", function() {
                assert.equal(
                    code('m("div", [ 1 ], 2)'),
                    `m.vnode("div", [ 1 ], 2)`
                );
            });
            
            it("should support multiple arrays of children", function() {
                assert.equal(
                    code('m("div", [ 1, 2, 3 ], [ 4, 5, 6, 7 ])'),
                    `m.vnode("div", [ 1, 2, 3 ], [ 4, 5, 6, 7 ])`
                );
                
                assert.equal(
                    code('m("div", [ 1 ], [ 2 ], [ 3 ])'),
                    `m.vnode("div", [ 1 ], [ 2 ], [ 3 ])`
                );
            });
        });
    });
});
