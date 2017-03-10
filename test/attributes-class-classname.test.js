"use strict";

var assert = require("assert"),

    code = require("./lib/code");

describe("Attributes", function() {
    describe("class vs className", function() {
        it("attr class, attr className", function() {
            assert.equal(
                code(`m("div", { className : "foo", class : "bar" })`),
                `m.vnode("div",undefined,{className:"foo bar"},[],undefined,undefined);`
            );
        });
        
        it("selector class, attr class", function() {
            assert.equal(
                code(`m(".foo", { class : "bar" })`),
                `m.vnode("div",undefined,{className:"foo bar"},[],undefined,undefined);`
            );
        });

        it("selector class, attr className", function() {
            assert.equal(
                code(`m(".foo", { className : "bar" })`),
                `m.vnode("div",undefined,{className:"foo bar"},[],undefined,undefined);`
            );
        });
        
        it("selector class, selector attr, attr className", function() {
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

        it("no selector class, more complex className attr (#57)", function() {
            assert.equal(
                code(`m("div", { className: foo ? "bar" : boo ? "woo" : "baz" }, "inner")`),
                `m.vnode("div",undefined,{className:foo?"bar":boo?"woo":"baz"},undefined,"inner",undefined);`
            );
        });

        it("selector class, complex className attr", function() {
            assert.equal(
                code(`m(".a", { className: foo ? "bar" : "baz" }, "inner")`),
                `m.vnode("div",undefined,{className:"a "+(foo?"bar":"baz")},undefined,"inner",undefined);`
            );
        });

        it("selector multiple classes, complex className attr", function() {
            assert.equal(
                code(`m(".a.b.c", { className: foo ? "bar" : "baz" }, "inner")`),
                `m.vnode("div",undefined,{className:"a b c "+(foo?"bar":"baz")},undefined,"inner",undefined);`
            );
        });

        it("selector multiple classes, className attr, class attr", function() {
            assert.equal(
                code(`m(".a.b", { className: "c1", class: "c2" }, "inner")`),
                `m.vnode("div",undefined,{className:"a b c1 c2"},undefined,"inner",undefined);`
            );
        });

        it("selector multiple classes, complex className attr, class attr", function() {
            assert.equal(
                code(`m(".a.b", { className: 1 ? "c1" : "d1", class: "c2" }, "inner")`),
                `m.vnode("div",undefined,{className:"a b "+(1?"c1":"d1")+" c2"},undefined,"inner",undefined);`
            );
        });
    });
});
