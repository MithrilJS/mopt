"use strict";

var assert = require("assert"),

    code   = require("./lib/code");

describe.skip("mithril-objectify", function() {
    describe("JSON function children", function() {
        it("should know that JSON.stringify is safe", function() {
            assert.equal(
                code(`m("div", JSON.stringify({}))`),
                `({tag:"div",attrs:undefined,children:[JSON.stringify({})],dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined});`
            );
        });
        
        it("shouldn't transform JSON.parse since it may not be safe", function() {
            assert.equal(
                code(`m("div", JSON.parse({}))`),
                `m("div",JSON.parse({}));`
            );
        });
    });
});
