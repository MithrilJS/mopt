"use strict";

var test  = require("tape"),

    parse = require("./_parse");

test("Dynamic classes", function(t) {
    t.equal(
        parse(`m("input.fooga", { class: true ? "true" : "false" })`),
        `({ tag: "input", attrs: { "class": "fooga " + (true ? "true" : "false") }, children: [  ] })`
    );
    
    t.end();
});

test("Selector w/ id", function(t) {
    t.equal(
        parse(`m("#fooga")`),
        `({ tag: "div", attrs: { "id": "fooga" }, children: [  ] })`
    );
   
   
    t.end();
});

test("Non-string attr values", function(t) {
    t.equal(
        parse(`m("div", { "fooga" : 0 })`),
        `({ tag: "div", attrs: { "fooga": 0 }, children: [  ] })`
    );
    
    t.equal(
        parse(`m("div", { "fooga" : false })`),
        `({ tag: "div", attrs: { "fooga": false }, children: [  ] })`
    );
    
    t.equal(
        parse(`m("div", { "fooga" : null })`),
        `({ tag: "div", attrs: { "fooga": null }, children: [  ] })`
    );
    
    t.equal(
        parse(`m("div", { "fooga" : undefined })`),
        `({ tag: "div", attrs: { "fooga": undefined }, children: [  ] })`
    );
    
    t.end();
});
