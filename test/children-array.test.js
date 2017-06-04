"use strict";

var code = require("./lib/code");

describe("Children", () => {
    describe("Array Children", () => {
        it("should support array children w/ 1 entry", () => {
            expect(
                code(`m("0", [ 1 ])`)
            )
            .toMatchSnapshot();

            expect(
                code(`m("0", [ "1" ])`)
            )
            .toMatchSnapshot();

            expect(
                code(`m("0", [ \`1\` ])`)
            )
            .toMatchSnapshot();
        });

        it("should support attrs + array children w/ 1 entry", () =>
            expect(
                code(`m("0", { title : "bar" }, [ 1 ])`)
            )
            .toMatchSnapshot()
        );
        
        it("should support array children w/ > 1 entry", () =>
            expect(
                code(`m("0", [ 1, 2 ])`)
            )
            .toMatchSnapshot()
        );

        it("should support attrs + array children w/ > 1 entry", () =>
            expect(
                code(`m("0", { title : "bar" }, [ 1, 2, 3 ])`)
            )
            .toMatchSnapshot()
        );

        it("should normalize non-text array children", () =>
            expect(
                code(`m("0", [ 1, bar ])`)
            )
            .toMatchSnapshot()
        );

        it("should wrap Array.prototype children that return an array in m.vnode.normalizeChildren", () => {
            expect(
                code(`m("0", [ 1, 2 ].map(function(val) { return val; }))`)
            )
            .toMatchSnapshot();

            expect(
                code(`m("0", [ 1, 2 ].filter(function(val) { return val === 1; }))`)
            )
            .toMatchSnapshot();
        });
        
        it("shouldn't convert when there are Array.prototype children that do not return an array", () => {
            expect(
                code(`m("0", [ 1, 2 ].forEach(function(val) { return val === 1 }))`)
            )
            .toMatchSnapshot();
            
            expect(
                code(`m("0", [ 1, 2 ].some(function(val) { return val === 1 }))`)
            )
            .toMatchSnapshot();
        });

        it("shouldn't convert when there are Array.prototype children with a non-array object", () =>
            expect(
                code(`m("0", a.map(function(val) { return val; }))`)
            )
            .toMatchSnapshot()
        );

        it("should support wrapping Array.prototype children when there are multiple children", () =>
            expect(
                code(`m("0", [ 1 ], [ 2 ].map(function(val) { return val; }))`)
            )
            .toMatchSnapshot()
        );
        
        it("should handle Array.prototype methods that return a string", () => {
            expect(
                code(`m("0", [ 1, 2 ].join(""))`)
            )
            .toMatchSnapshot();
            
            // Yes this looks insane, but it's still valid
            expect(
                code(`m("0", [ 1, 2 ]["join"](""))`)
            )
            .toMatchSnapshot();
        });
    });
});
