"use strict";

var code = require("./lib/code");

describe("Issues", () => {
    describe("#35 hyphenated attributes", () => {
        it("should be supported in the selector", () =>
            expect(
                code(`m(".fooga[wooga-booga=1]")`)
            )
            .toMatchSnapshot()
        );
        
        it("should be supported as an attribute", () =>
            expect(
                code(`m(".fooga", { "wooga-booga" : 1 })`)
            )
            .toMatchSnapshot()
        );
    });
});
