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
