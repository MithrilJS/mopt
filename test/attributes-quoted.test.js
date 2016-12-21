"use strict";

var assert = require("assert"),

    code   = require("./lib/code");

describe("mithril-objectify", function() {
    describe("Attributes", function() {
        it("should support quoted properties (issue #6)", function() {
            /* eslint quote-props:off */
            assert.deepEqual(
                code('m("div", { "fooga" : 0 })'),
                m("div", { "fooga" : 0 })
            );
        });
    });
});
