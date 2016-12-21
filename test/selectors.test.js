"use strict";

var assert = require("assert"),

    code = require("./lib/code");

describe.skip("mithril-objectify", function() {
    describe("Selectors", function() {
        it("should support tag selectors", function() {
            assert.deepEqual(
                code('m("div")'),
                `m.vnode("div")`
            );
        });
        
        it("should support class selectors", function() {
            assert.deepEqual(
                code('m(".foo")'),
                `m.vnode(".foo")`
            );
        });

        it("should support attribute selectors", function() {
            assert.deepEqual(
                code('m("[title=bar]")'),
                `m.vnode("[title=bar]")`
            );
        });

        it("should support single-quoted attribute selectors", function() {
            assert.deepEqual(
                code('m("[title=\'bar\']")'),
                `m.vnode("[title='bar']")`
            );
        });

        it("should support double-quoted attribute selectors", function() {
            assert.deepEqual(
                code('m(\'[title="bar"]\')'),
                `m.vnode('[title="bar"]')`
            );
        });
    });
});
