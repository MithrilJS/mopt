"use strict";

var code = require("./lib/code");

describe("Children", () => {
    describe("literal children", () => {
        it("should support single literal children (string)", () =>
            expect(
                code(`m("1", "2")`)
            )
            .toMatchSnapshot()
        );

        it("should support single literal children (number)", () =>
            expect(
                code(`m("1", 2)`)
            )
            .toMatchSnapshot()
        );

        it("should support single literal children (boolean)", () =>
            expect(
                code(`m("1", true)`)
            )
            .toMatchSnapshot()
        );

        it("should support single literal children (template)", () =>
            expect(
                code(`m("1", \`2\`)`)
            )
            .toMatchSnapshot()
        );
        
        it("should support attrs + single literal children children", () =>
            expect(
                code(`m("1", { title : "bar" }, "2")`)
            )
            .toMatchSnapshot()
        );

        it("should support multiple literal children", () =>
            expect(
                code(`m("1", "2", "3")`)
            )
            .toMatchSnapshot()
        );
        
        it("should support attrs + multiple children", () =>
            expect(
                code(`m("1", { title : "bar" }, "2", "3")`)
            )
            .toMatchSnapshot()
        );

        it("should not transform invocations containing identifiers", () =>
            // Identifiers can't be resolved at compile time, so ignore
            expect(
                code(`m(".fooga", identifier)`)
            )
            .toMatchSnapshot()
        );
    });
});
