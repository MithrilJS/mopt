"use strict";

var assert = require("assert"),
    
    code = require("./lib/code");

describe("Children", function() {
    describe("literal children", function() {
        it("should support single literal children (string)", function() {
            assert.equal(
                code(`m("1", "2")`),
                `m.vnode("1",undefined,undefined,undefined,"2",undefined);`
            );
        });

        it("should support single literal children (number)", function() {
            assert.equal(
                code(`m("1", 2)`),
                `m.vnode("1",undefined,undefined,undefined,2,undefined);`
            );
        });

        it("should support single literal children (boolean)", function() {
            assert.equal(
                code(`m("1", true)`),
                `m.vnode("1",undefined,undefined,undefined,true,undefined);`
            );
        });

        it("should support single literal children (template)", function() {
            assert.equal(
                code(`m("1", \`2\`)`),
                `m.vnode("1",undefined,undefined,undefined,\`2\`,undefined);`
            );
        });
        
        it("should support attrs + single literal children children", function() {
            assert.equal(
                code(`m("1", { title : "bar" }, "2")`),
                `m.vnode("1",undefined,{title:"bar"},undefined,"2",undefined);`
            );
        });

        it("should support multiple literal children", function() {
            assert.equal(
                code(`m("1", "2", "3")`),
                `m.vnode("1",undefined,undefined,[m.vnode("#",undefined,undefined,"2",undefined,undefined),m.vnode("#",undefined,undefined,"3",undefined,undefined)],undefined,undefined);`
            );
        });
        
        it("should support attrs + multiple children", function() {
            assert.equal(
                code(`m("1", { title : "bar" }, "2", "3")`),
                `m.vnode("1",undefined,{title:"bar"},[m.vnode("#",undefined,undefined,"2",undefined,undefined),m.vnode("#",undefined,undefined,"3",undefined,undefined)],undefined,undefined);`
            );
        });

        it("should not transform invocations containing identifiers", function() {
            // Identifiers can't be resolved at compile time, so ignore
            assert.equal(
                code(`m(".fooga", identifier)`),
                `m(".fooga",identifier);`
            );
        });
    });
});
