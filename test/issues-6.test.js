"use strict";

var assert = require("assert"),
    
    code = require("./lib/code");

describe("Issues", function() {
    describe("#6 quoted properties", function() {
        it("should be supported", function() {
            /* eslint quote-props:off */
            assert.equal(
                code(`m("div", { "fooga" : 0 })`),
                `m.vnode("div",undefined,{"fooga":0},[],undefined,undefined);`
            );
        });
    });
});
