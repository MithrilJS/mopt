"use strict";

var assert = require("assert"),

    code = require("./lib/code");

describe("Children", function() {
    describe("Mixed Children", function() {
        it("should support mixed array and literal children", function() {
            assert.equal(
                code(`m("0", [ 1 ], 2)`),
                `m.vnode("0",undefined,undefined,[m.vnode("[",undefined,undefined,[m.vnode("#",undefined,undefined,1,undefined,undefined)],undefined,undefined),m.vnode("#",undefined,undefined,2,undefined,undefined)],undefined,undefined);`
            );
        });
        
        it("should support multiple arrays of children", function() {
            assert.equal(
                code(`m("0", [ 1 ], [ 2 ], [ 3 ])`),
                `m.vnode("0",undefined,undefined,[m.vnode("[",undefined,undefined,[m.vnode("#",undefined,undefined,1,undefined,undefined)],undefined,undefined),m.vnode("[",undefined,undefined,[m.vnode("#",undefined,undefined,2,undefined,undefined)],undefined,undefined),m.vnode("[",undefined,undefined,[m.vnode("#",undefined,undefined,3,undefined,undefined)],undefined,undefined)],undefined,undefined);`
            );
        });
    });
});
