"use strict";

var assert = require("assert"),

    code = require("./lib/code");

describe("Attributes", function() {
    describe("class vs className", function() {
        it("should combine attr class & attr className", function() {
            assert.equal(
                code(`m("div", { className : "foo", class : "bar" })`),
                `m.vnode("div",undefined,{className:"foo bar"},[],undefined,undefined);`
            );
        });
        
        it("should combine tag class & attr class", function() {
            assert.equal(
                code(`m(".foo", { class : "bar" })`),
                `m.vnode("div",undefined,{className:"foo bar"},[],undefined,undefined);`
            );
        });

        it("should combine tag class & attr className", function() {
            assert.equal(
                code(`m(".foo", { className : "bar" })`),
                `m.vnode("div",undefined,{className:"foo bar"},[],undefined,undefined);`
            );
        });
        
        it("should combine tag class & attr className", function() {
            assert.equal(
                code(`m(".foo[checked]", { className : "bar" })`),
                `m.vnode("div",undefined,{className:"foo bar",checked:true},[],undefined,undefined);`
            );
        });
        
        it("selector class, empty className attr", function() {
            assert.equal(
                code(`m(".foo", { className : "" })`),
                `m.vnode("div",undefined,{className:"foo"},[],undefined,undefined);`
            );
        });

        it("no selector class, empty className attr", function() {
            assert.equal(
                code(`m("div", { className : "" })`),
                `m.vnode("div",undefined,undefined,[],undefined,undefined);`
            );
        });

        it("no selector class, empty class attr", function() {
            assert.equal(
                code(`m("div", { class : "" })`),
                `m.vnode("div",undefined,undefined,[],undefined,undefined);`
            );
        });

        it("no selector class, complex className attr (#57)", function() {
            assert.equal(
                code(`m("div", { className: foo ? "bar" : "baz" }, "inner")`),
                `m.vnode("div",undefined,{className:foo?"bar":"baz"},undefined,"inner",undefined);`
            );
        });

        it("selector class, complex className attr", function() {
            assert.equal(
                code(`m("div.a", { className: foo ? "bar" : "baz" }, "inner")`),
                `m.vnode("div",undefined,{className:"a "+(foo?"bar":"baz")},undefined,"inner",undefined);`
            );
        });
    });
});
