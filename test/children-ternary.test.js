"use strict";

var code = require("./lib/code");

describe("Children", () => {
    describe("Ternary expressions", () => {
        it("should convert when all entries are literals (strings)", () =>
            expect(
                code(`m("0", foo ? "1" : "2")`)
            )
            .toMatchSnapshot()
        );

        it("should convert when all entries are literals (string : number)", () =>
            expect(
                code(`m("0", foo ? "1" : 2)`)
            )
            .toMatchSnapshot()
        );

        it("should convert nested ternaries when all entries are literals (strings)", () =>
            expect(
                code(`m("0", foo ? "1" : bar ? "2" : "3")`)
            )
            .toMatchSnapshot()
        );
        
        it("should not convert when entries are not literals", () => {
            // Can't convert this, dunno what `bar` is
            expect(
                code(`m("0", foo ? bar : "baz")`)
            )
            .toMatchSnapshot();
            
            // Not a text child, so can't safely optimize
            expect(
                code(`m("0", foo ? { class : options.class } : null)`)
            )
            .toMatchSnapshot();
        });
    });
});
