"use strict";

var assert = require("assert"),

    code = require("./lib/code");

describe("Children", function() {
    describe("Ternary expressions", function() {
        it("should convert when all entries are literals (strings)", function() {
            assert.equal(
                code(`m("0", foo ? "1" : "2")`),
                `m.vnode("0",undefined,undefined,undefined,foo?"1":"2",undefined);`
            );
        });

        it("should convert when all entries are literals (string : number)", function() {
            assert.equal(
                code(`m("0", foo ? "1" : 2)`),
                `m.vnode("0",undefined,undefined,undefined,foo?"1":2,undefined);`
            );
        });

        it("should convert nested ternaries when all entries are literals (strings)", function() {
            assert.equal(
                code(`m("0", foo ? "1" : bar ? "2" : "3")`),
                `m.vnode("0",undefined,undefined,undefined,foo?"1":bar?"2":"3",undefined);`
            );
        });
        
        it("should not convert when entries are not literals", function() {
            // Can't convert this, dunno what `bar` is
            assert.equal(
                code(`m("0", foo ? bar : "baz")`),
                `m("0",foo?bar:"baz");`
            );
            
            // Not a text child, so can't safely optimize
            assert.equal(
                code(`m("0", foo ? { class : options.class } : null)`),
                `m("0",foo?{class:options.class}:null);`
            );
        });
    });
});
