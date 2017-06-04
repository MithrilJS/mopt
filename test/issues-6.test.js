"use strict";

var code = require("./lib/code");

describe("Issues", () => {
    describe("#6 quoted properties", () => {
        it("should be supported", () =>
            expect(
                code(`m("div", { "fooga" : 0 })`)
            )
            .toMatchSnapshot()
        );
    });
});
