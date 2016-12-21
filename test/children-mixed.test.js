"use strict";

var assert = require("assert"),

    code = require("./lib/code");

describe("mithril-objectify", function() {
    describe("Children", function() {
        describe("Mixed Children", function() {
            it("should support mixed array and literal children", function() {
                assert.deepEqual(
                    code('m("div", [ 1 ], 2)'),
                    m("div", [ 1 ], 2)
                );
            });
            
            it("should support multiple arrays of children", function() {
                assert.deepEqual(
                    code('m("div", [ 1, 2, 3 ], [ 4, 5, 6, 7 ])'),
                    m("div", [ 1, 2, 3 ], [ 4, 5, 6, 7 ])
                );
                
                assert.deepEqual(
                    code('m("div", [ 1 ], [ 2 ], [ 3 ])'),
                    m("div", [ 1 ], [ 2 ], [ 3 ])
                );
            });
        });
    });
});
