"use strict";

var code = require("./lib/code");

describe("SVG", () => {
    it("should support svg selectors", () =>
        expect(
            code(`m("svg")`)
        )
        .toMatchSnapshot()
    );
    
    it("should support nested svg selectors", () =>
        expect(
            code(`m("svg", m("g"))`)
        )
        .toMatchSnapshot()
    );
});
