"use strict";

var code = require("./lib/code");

describe("Source Maps", function() {
    it("should output an accurate source map", function() {
        expect(
            code(`m(".fooga")`, { sourceMaps : "inline" })
        )
        .toMatchSnapshot();
    });
});
