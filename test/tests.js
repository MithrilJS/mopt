"use strict";

var test  = require("tape"),
    m     = require("mithril"),

    p = require("./_parse");
    
function stream(file, contents, done) {
    var Readable  = require("stream").Readable,
        concat    = require("concat-stream"),
        objectify = require("../"),
        readable  = new Readable(),
        through;
    
    through = objectify(file);
    
    readable.pipe(through);
    
    readable.push(contents);
    readable.push(null);
    
    through.pipe(concat(done));
}

test("Dynamic classes", function(t) {
    /* eslint no-constant-condition:0 */

    t.looseEqual(
        p(`m("input.fooga", { class : true ? "true" : "false" })`),
        m("input.fooga", { class : true ? "true" : "false" })
    );
    
    t.end();
});

test("Empty selector", function(t) {
    t.looseEqual(
        p(`m("")`),
        m("")
    );
   
    t.end();
});

test("Selector w/ id", function(t) {
    t.looseEqual(
        p(`m("#fooga")`),
        m("#fooga")
    );
   
    t.end();
});

test("Selector w/ attribute w/ no value", function(t) {
    t.looseEqual(
        p(`m("div[fooga]")`),
        m("div[fooga]")
    );

    t.end();
});

test("Non-string attr values", function(t) {
    t.looseEqual(
        p(`m("div", { fooga : 0 })`),
        m("div", { fooga : 0 })
    );
    
    t.looseEqual(
        p(`m("div", { fooga : false })`),
        m("div", { fooga : false })
    );
    
    t.looseEqual(
        p(`m("div", { fooga : null })`),
        m("div", { fooga : null })
    );
    
    t.looseEqual(
        p(`m("div", { fooga : undefined })`),
        m("div", { fooga : undefined })
    );
    
    t.end();
});

test("Filtering doesn't transform unsafe invocations", function(t) {
    // Ensure that the selector must be literal
    t.equal(
        p.objectify(`m(".fooga" + dynamic)`),
        `m(".fooga" + dynamic)`
    );
    
    t.equal(
        p.objectify(`m("input" + ".pure-u")`),
        `m("input" + ".pure-u")`
    );
    
    // Identifiers can't be resolved at compiel time, so ignore
    t.equal(
        p.objectify(`m(".fooga", identifier)`),
        `m(".fooga", identifier)`
    );
    
    t.end();
});

test("transform", function(t) {
    t.plan(2);
    
    stream("./test.js", `m("div")`, function(code) {
        t.equal(
            code.toString("utf8"),
            `({ tag: "div", attrs: {  }, children: [  ] })`
        );
    });
    
    stream("./test.css", ".fooga { color: red; }", function(code) {
        t.equal(
            code.toString("utf8"),
            ".fooga { color: red; }"
        );
    });
});
