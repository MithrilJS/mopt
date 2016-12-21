"use strict";

var assert = require("assert"),

    code   = require("./lib/code");

describe("mithril-objectify", function() {
    describe("Attributes", function() {
        describe("hyphenated attributes (issue #35)", function() {
            it("should support hyphenated attributes in the selector", function() {
                assert.deepEqual(
                    code('m(".fooga[wooga-booga=1]")'),
                    m(".fooga[wooga-booga=1]")
                );
            });
            
            it("should support hyphenated attributes as an attribute", function() {
                assert.deepEqual(
                    code('m(".fooga", { "wooga-booga" : 1 })'),
                    m(".fooga", { "wooga-booga" : 1 })
                );
            });
        });
    });
});
