"use strict";

var assert = require("assert"),
    
    code = require("./lib/code");

describe("Children", function() {
    describe("String.prototype method children", function() {
        it("should support String.prototype methods using dot notation", function() {
            assert.equal(
                code(`m("div", "fooga".replace("f", "g"))`),
                `m.vnode("div",undefined,undefined,undefined,"fooga".replace("f","g"),undefined);`
            );
        });
        
        it("should support String.prototype methods using array notation", function() {
            assert.equal(
                code(`m("div", "fooga"["replace"]("f", "g"))`),
                `m.vnode("div",undefined,undefined,undefined,"fooga"["replace"]("f","g"),undefined);`
            );
        });
    });
});
