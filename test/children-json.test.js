"use strict";

var code = require("./lib/code");

describe("Children", () => {
    describe("JSON.prototype children", () => {
        it("should know that JSON.stringify is safe", () =>
            expect(
                code(`m("div", JSON.stringify({}))`)
            )
            .toMatchSnapshot()
        );
        
        it("shouldn't transform JSON.parse since it may not be safe", () =>
            expect(
                code(`m("div", JSON.parse({}))`)
            )
            .toMatchSnapshot()
        );
    });
});
