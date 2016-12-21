"use strict";

var code = require("./lib/code");

describe.skip("mithril-objectify", function() {
    describe("Attributes", function() {
        it("should support quoted properties (issue #6)", function() {
            /* eslint quote-props:off */
            assert.deepEqual(
                code('m("div", { "fooga" : 0 })'),
                `m.vnode("div", { "fooga" : 0 })`
            );
        });
    });
});
