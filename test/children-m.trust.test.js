"use strict";

var code = require("./lib/code");

describe("Children", () => {
    describe("Nested m.trust()", () => {
        it("should support nested m.trust() invocations", () =>
            expect(
                code(`m("1", m.trust("1"))`)
            )
            .toMatchSnapshot()
        );
        
        it("should support a single-item array of nested m.trust() invocations", () =>
            expect(
                code(`m("1", [ m.trust("2") ])`)
            )
            .toMatchSnapshot()
        );

        it("should support a multi-item array of nested m.trust() invocations", () =>
            expect(
                code(`m("1", [ m.trust("2"), m.trust("3") ])`)
            )
            .toMatchSnapshot()
        );

        it("should support arrays of nested m.trust() invocations & plain nodes", () =>
            expect(
                code(`m("1", [ m("2"), "3" ])`)
            )
            .toMatchSnapshot()
        );
        
        it("should support multiple nested m.trust() invocations", () =>
            expect(
                code(`m("1", m.trust("2"), m.trust("3"), m.trust("4"))`)
            )
            .toMatchSnapshot()
        );
        
        it("should support attrs + nested m.trust() invocations", () =>
            expect(
                code(`m("1", { title : "bar" }, m.trust("2"))`)
            )
            .toMatchSnapshot()
        );
        
        it("should supported attrs + arrays of nested m.trust() invocations", () =>
            expect(
                code(`m("1", { title : "bar" }, [ m.trust("2") ])`)
            )
            .toMatchSnapshot()
        );
        
        it("should support attrs + multiple nested m.trust() invocations", () =>
            expect(
                code(`m("1", { title : "bar" }, m.trust("2"), m.trust("3"), m.trust("4"))`)
            )
            .toMatchSnapshot()
        );
    });
});
