"use strict";

var code = require("./lib/code");

describe("Children", () => {
    describe("String.prototype method children", () => {
        it("should support String.prototype methods using dot notation", () =>
            expect(
                code(`m("div", "fooga".replace("f", "g"))`)
            )
            .toMatchSnapshot()
        );
        
        it("should support String.prototype methods using array notation", () =>
            expect(
                code(`m("div", "fooga"["replace"]("f", "g"))`)
            )
            .toMatchSnapshot()
        );
    });
});
