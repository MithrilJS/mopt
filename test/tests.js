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
