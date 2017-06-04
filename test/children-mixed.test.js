"use strict";

var code = require("./lib/code");

describe("Children", () => {
    describe("Mixed Children", () => {
        it("should support mixed array and literal children", () =>
            expect(
                code(`m("0", [ 1 ], 2)`)
            )
            .toMatchSnapshot()
        );
        
        it("should support multiple arrays of children", () =>
            expect(
                code(`m("0", [ 1 ], [ 2 ], [ 3 ])`)
            )
            .toMatchSnapshot()
        );
    });
});
