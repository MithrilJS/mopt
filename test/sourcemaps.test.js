"use strict";

var assert = require("assert"),

    strip = require("common-tags").stripIndent,

    code   = require("./lib/code");

describe("Source Maps", function() {
    it("should output an accurate source map", function() {
        assert.equal(
            code(`m(".fooga")`, { sourceMaps : "inline" }),
            strip`
                m.vnode("div",undefined,{className:"fooga"},[],undefined,undefined);
                //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVua25vd24iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoidW5rbm93biIsInNvdXJjZXNDb250ZW50IjpbIm0oXCIuZm9vZ2FcIikiXX0=
            `
        );
    });
});
