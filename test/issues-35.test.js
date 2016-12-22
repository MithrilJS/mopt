"use strict";

var assert = require("assert"),
    
    code = require("./lib/code");

describe("mithril-objectify", function() {
    describe("Issues", function() {
        describe("#35 hyphenated attributes", function() {
            it("should be supported in the selector", function() {
                assert.equal(
                    code(`m(".fooga[wooga-booga=1]")`),
                    `m.vnode("div",undefined,{className:"fooga","wooga-booga":"1"},[],undefined,undefined);`
                );
            });
            
            it("should be supported as an attribute", function() {
                assert.equal(
                    code(`m(".fooga", { "wooga-booga" : 1 })`),
                    `m.vnode("div",undefined,{className:"fooga","wooga-booga":1},[],undefined,undefined);`
                );
            });
        });
    });
});
