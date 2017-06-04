"use strict";

var code = require("./lib/code");

describe("Children", () => {
    describe("Expression children", () => {
        it("should support expressions with literal values (strings)", () =>
            expect(
                code(`m("0", "1" + "2")`)
            )
            .toMatchSnapshot()
        );

        it("should support expressions with literal values (numbers)", () =>
            expect(
                code(`m("0", 1 + 2)`)
            )
            .toMatchSnapshot()
        );

        it("should support expressions with literal values (strings + numbers)", () =>
            expect(
                code(`m("0", 1 + "2")`)
            )
            .toMatchSnapshot()
        );

        it("should convert expressions containing more than 2 values", () =>
            expect(
                code(`m("0", "1" + "2" + "3")`)
            )
            .toMatchSnapshot()
        );

        it("should convert expressions with operators other than +", () =>
            expect(
                code(`m("0", 1 - 2)`)
            )
            .toMatchSnapshot()
        );
        
        it("should not convert non-literal values", () =>
            expect(
                code(`m("0", a + b)`)
            )
            .toMatchSnapshot()
        );
    });
});
