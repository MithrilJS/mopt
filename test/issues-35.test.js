"use strict";

var assert = require("assert"),
    
    code = require("./lib/code");

describe("mithril-objectify", function() {
    describe("Attributes", function() {
        describe("hyphenated attributes (issue #35)", function() {
            it("should support hyphenated attributes in the selector", function() {
                assert.equal(
                    code('m(".fooga[wooga-booga=1]")'),
                    `m.vnode("div",undefined,{"wooga-booga":"1",className:"fooga"},[],undefined,undefined);`
                );
            });
            
            it("should support hyphenated attributes as an attribute", function() {
                assert.equal(
                    code('m(".fooga", { "wooga-booga" : 1 })'),
                    `m.vnode("div",undefined,{className:"fooga","wooga-booga":1},[],undefined,undefined);`
                );
            });
        });
    });
});
