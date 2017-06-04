"use strict";

var code = require("./lib/code");

describe("Selectors", () => {
    describe("Literal selectors", () => {
        it("should support the empty selector", () =>
            expect(
                code(`m("")`)
            )
            .toMatchSnapshot()
        );

        it("should support tag selectors", () =>
            expect(
                code(`m("div")`)
            )
            .toMatchSnapshot()
        );
        
        it("should support class selectors", () =>
            expect(
                code(`m(".foo")`)
            )
            .toMatchSnapshot()
        );

        it("should support id selectors", () =>
            expect(
                code(`m("#foo")`)
            )
            .toMatchSnapshot()
        );
        
        it("should support empty attribute selectors", () =>
            expect(
                code(`m("div[fooga]")`)
            )
            .toMatchSnapshot()
        );

        it("should support attribute selectors", () =>
            expect(
                code(`m("[title=bar]")`)
            )
            .toMatchSnapshot()
        );

        it("should support single-quoted attribute selectors", () =>
            expect(
                code(`m("[title='bar']")`)
            )
            .toMatchSnapshot()
        );

        it("should support double-quoted attribute selectors", () =>
            expect(
                code(`m('[title="bar"]')`)
            )
            .toMatchSnapshot()
        );

        it("should ignore non-string selectors", () =>
            expect(
                code(`m(fooga)`)
            )
            .toMatchSnapshot()
        );
    });
});
