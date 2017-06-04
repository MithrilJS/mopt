"use strict";

var code = require("./lib/code");

describe("Attributes", () => {
    describe("key", () => {
        it("should extract the key attribute (number)", () =>
            expect(
                code(`m("div", { key : 1 })`)
            )
            .toMatchSnapshot()
        );

        it("should extract the key attribute (string)", () =>
            expect(
                code(`m("div", { key : "1" })`)
            )
            .toMatchSnapshot()
        );

        it("should extract the key attribute (boolean)", () =>
            expect(
                code(`m("div", { key : true })`)
            )
            .toMatchSnapshot()
        );

        it("should extract the key attribute (identifier)", () =>
            expect(
                code(`m("div", { key : fooga })`)
            )
            .toMatchSnapshot()
        );
    });
});
