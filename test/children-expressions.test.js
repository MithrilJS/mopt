"use strict";

var assert = require("assert"),
    
    code = require("./lib/code");

describe("Children", function() {
    describe("Expression children", function() {
        it("should support expressions with literal values (strings)", function() {
            assert.equal(
                code(`m("0", "1" + "2")`),
                `m.vnode("0",undefined,undefined,undefined,"1"+"2",undefined);`
            );
        });

        it("should support expressions with literal values (numbers)", function() {
            assert.equal(
                code(`m("0", 1 + 2)`),
                `m.vnode("0",undefined,undefined,undefined,1+2,undefined);`
            );
        });

        it("should support expressions with literal values (strings + numbers)", function() {
            assert.equal(
                code(`m("0", 1 + "2")`),
                `m.vnode("0",undefined,undefined,undefined,1+"2",undefined);`
            );
        });

        it("should convert expressions containing more than 2 values", function() {
            assert.equal(
                code(`m("0", "1" + "2" + "3")`),
                `m.vnode("0",undefined,undefined,undefined,"1"+"2"+"3",undefined);`
            );
        });

        it("should convert expressions with operators other than +", function() {
            assert.equal(
                code(`m("0", 1 - 2)`),
                `m.vnode("0",undefined,undefined,undefined,1-2,undefined);`
            );
        });
        
        it("should not convert non-literal values", function() {
            assert.equal(
                code(`m("0", a + b)`),
                `m("0",a+b);`
            );
        });
    });
});
