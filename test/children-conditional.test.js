"use strict";

var assert = require("assert"),

    code = require("./lib/code");

describe.skip("mithril-objectify", function() {
    describe("Children", function() {
        describe("Conditional expressions", function() {
            it("should convert when all entries are literals", function() {
                assert.equal(
                    code('m("div", foo ? "bar" : "baz")'),
                    '({tag:"div",attrs:undefined,children:[foo?"bar":"baz"],dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined});'
                );
            });
            
            it("should not convert when entries are not literals", function() {
                // Can't convert this, dunno what `bar` is
                assert.equal(
                    code('m("div", foo ? bar : "baz")'),
                    'm("div",foo?bar:"baz");'
                );
                
                assert.equal(
                    code('m("div", foo ? { class : options.class } : null)'),
                    'm("div",foo?{class:options.class}:null);'
                );
            });
        });
    });
});
