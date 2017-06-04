"use strict";

var code = require("./lib/code");

describe("Children", () => {
    describe("Nested m()", () => {
        it("should support nested m() invocations", () =>
            expect(
                code(`m("0", m("1"))`)
            )
            .toMatchSnapshot()
        );
        
        it("should support an array with an m() invocation", () =>
            expect(
                code(`m("0", [ m("1") ])`)
            )
            .toMatchSnapshot()
        );
        
        it("should support an array with m() invocations", () =>
            expect(
                code(`m("0", [ m("1"), m("2") ])`)
            )
            .toMatchSnapshot()
        );

        it("should support arrays of nested m() invocations & plain nodes", () =>
            expect(
                code(`m("one", [ m("two"), "three" ])`)
            )
            .toMatchSnapshot()
        );
        
        it("should support multiple nested m() invocations", () =>
            expect(
                code(`m("0", m("1"), m("2"), m("3"))`)
            )
            .toMatchSnapshot()
        );
        
        it("should support attrs + nested m() invocations", () =>
            expect(
                code(`m("0", { title : "bar" }, m("1"))`)
            )
            .toMatchSnapshot()
        );
        
        it("should supported attrs + arrays of nested m() invocations", () =>
            expect(
                code(`m("0", { title : "bar" }, [ m("1") ])`)
            )
            .toMatchSnapshot()
        );
        
        it("should support attrs + multiple nested m() invocations", () =>
            expect(
                code(`m("0", { title : "bar" }, m("1"), m("2"), m("3"))`)
            )
            .toMatchSnapshot()
        );
    });
});
