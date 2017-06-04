"use strict";

var code = require("./lib/code");

describe("Source Maps", () => {
    it("should output an accurate source map", () => {
        expect(
            code(`m(".fooga")`, { sourceMaps : "inline" })
        )
        .toMatchSnapshot();
    });
});
