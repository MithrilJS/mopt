"use strict";

var assert = require("assert"),

    code = require("./lib/code");

describe("Selectors", function() {
    describe("Literal selectors", function() {
        it("should support the empty selector", function() {
            assert.equal(
                code(`m("")`),
                `m.vnode("div",undefined,undefined,[],undefined,undefined);`
            );
        });

        it("should support tag selectors", function() {
            assert.equal(
                code(`m("div")`),
                `m.vnode("div",undefined,undefined,[],undefined,undefined);`
            );
        });
        
        it("should support class selectors", function() {
            assert.equal(
                code(`m(".foo")`),
                `m.vnode("div",undefined,{className:"foo"},[],undefined,undefined);`
            );
        });

        it("should support id selectors", function() {
            assert.equal(
                code(`m("#foo")`),
                `m.vnode("div",undefined,{id:"foo"},[],undefined,undefined);`
            );
        });
        
        it("should support empty attribute selectors", function() {
            assert.equal(
                code(`m("div[fooga]")`),
                `m.vnode("div",undefined,{fooga:true},[],undefined,undefined);`
            );
        });

        it("should support attribute selectors", function() {
            assert.equal(
                code(`m("[title=bar]")`),
                `m.vnode("div",undefined,{title:"bar"},[],undefined,undefined);`
            );
        });

        it("should support single-quoted attribute selectors", function() {
            assert.equal(
                code(`m("[title='bar']")`),
                `m.vnode("div",undefined,{title:"bar"},[],undefined,undefined);`
            );
        });

        it("should support double-quoted attribute selectors", function() {
            assert.equal(
                code(`m('[title="bar"]')`),
                `m.vnode("div",undefined,{title:"bar"},[],undefined,undefined);`
            );
        });

        it("should ignore non-string selectors", function() {
            assert.equal(
                code(`m(fooga)`),
                `m(fooga);`
            );
        });
    });
});
