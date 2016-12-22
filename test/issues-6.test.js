"use strict";

var assert = require("assert"),
    
    code = require("./lib/code");

describe("mithril-objectify", function() {
    describe("Issues", function() {
        it("#6 should support quoted properties", function() {
            /* eslint quote-props:off */
            assert.equal(
                code(`m("div", { "fooga" : 0 })`),
                `m.vnode("div",undefined,{"fooga":0},[],undefined,undefined);`
            );
        });
    });
});
