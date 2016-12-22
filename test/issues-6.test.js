"use strict";

var assert = require("assert"),
    
    code = require("./lib/code");

describe("mithril-objectify", function() {
    describe("Quoted Attributes", function() {
        it("should support quoted properties (issue #6)", function() {
            /* eslint quote-props:off */
            assert.equal(
                code(`m("div", { "fooga" : 0 })`),
                `m.vnode("div",undefined,{"fooga":0},[],undefined,undefined);`
            );
        });
    });
});
