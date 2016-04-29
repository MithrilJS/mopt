"use strict";

var fs   = require("fs"),
    test = require("tape"),
    m    = require("mithril"),

    p = require("./_parse"),
    s = require("./_stream");
    
test("Dynamic classes", function(t) {
    /* eslint no-constant-condition:0 */

    t.deepEqual(
        p('m("input.fooga", { class : true ? "true" : "false" })'),
        m("input.fooga", { class : true ? "true" : "false" })
    );
    
    t.end();
});

test("Empty selector", function(t) {
    t.deepEqual(
        p('m("")'),
        m("")
    );
    
    t.end();
});

test("Selector w/ id", function(t) {
    t.deepEqual(
        p('m("#fooga")'),
        m("#fooga")
    );
    
    t.end();
});

test("Selector w/ attribute w/ no value", function(t) {
    t.deepEqual(
        p('m("div[fooga]")'),
        m("div[fooga]")
    );

    t.end();
});

test("Non-string attr values", function(t) {
    t.deepEqual(
        p('m("div", { fooga : 0 })'),
        m("div", { fooga : 0 })
    );
    
    t.deepEqual(
        p('m("div", { fooga : false })'),
        m("div", { fooga : false })
    );
    
    t.deepEqual(
        p('m("div", { fooga : null })'),
        m("div", { fooga : null })
    );
    
    t.deepEqual(
        p('m("div", { fooga : undefined })'),
        m("div", { fooga : undefined })
    );
    
    t.end();
});

test("Quoted properties (issue #6)", function(t) {
    /* eslint quote-props:0 */
    t.deepEqual(
        p('m("div", { "fooga" : 0 })'),
        m("div", { "fooga" : 0 })
    );

    t.end();
});

test("Strings", function(t) {
    t.deepEqual(
        p('m("div", "fooga")'),
        m("div", "fooga")
    );
    
    t.equal(
        p.objectify('m("div", "fooga" + "wooga")'),
        '({ tag: "div", attrs: {  }, children: [ "fooga" + "wooga" ] })'
    );
    
    t.equal(
        p.objectify('m("div", "fooga".replace("f", "g"))'),
        '({ tag: "div", attrs: {  }, children: [ "fooga".replace("f", "g") ] })'
    );
    
    t.end();
});

test("Array.prototype methods", function(t) {
    /* eslint brace-style:0, no-unused-expressions:0 */
    t.deepEqual(
        p('m("div", [ 1, 2 ].map(function(val) { return val; }))'),
        m("div", [ 1, 2 ].map(function(val) { return val; }))
    );

    t.deepEqual(
        p('m("div", [ 1, 2 ].filter(function(val) { return val === 1; }))'),
        m("div", [ 1, 2 ].filter(function(val) { return val === 1; }))
    );

    t.deepEqual(
        p('m("div", [ 1, 2 ].sort())'),
        m("div", [ 1, 2 ].sort())
    );
    
    // Mithril & falafel don't agree on the ouput of running this, but
    // they're both valid
    t.equal(
        p.objectify('m("div", [ 1, 2 ].join(""))'),
        '({ tag: "div", attrs: {  }, children: [ 1, 2 ].join("") })'
    );
    
    // Untransformable methods since they don't return an array :(
    t.equal(
        p.objectify('m("div", [ 1, 2 ].forEach(function(val) { return val === 1 }))'),
        'm("div", [ 1, 2 ].forEach(function(val) { return val === 1 }))'
    );
    
    t.equal(
        p.objectify('m("div", [ 1, 2 ].some(function(val) { return val === 1 }))'),
        'm("div", [ 1, 2 ].some(function(val) { return val === 1 }))'
    );
    
    t.end();
});

test("Conditional expressions", function(t) {
    // Can convert literals!
    t.equal(
        p.objectify('m("div", foo ? "bar" : "baz")'),
        '({ tag: "div", attrs: {  }, children: [ foo ? "bar" : "baz" ] })'
    );
    
    // Can't convert this, dunno what `bar` is
    t.equal(
        p.objectify('m("div", foo ? bar : "baz")'),
        'm("div", foo ? bar : "baz")'
    );
    
    // Can't convert this, unable to merge args w/ conditional results
    t.equal(
        p.objectify('m("div", foo ? { class : options.class } : null)'),
        'm("div", foo ? { class : options.class } : null)'
    );
    
    t.end();
});

test("m.trust children", function(t) {
    t.equal(
        p.objectify('m("div", m.trust("<div>"))'),
        '({ tag: "div", attrs: {  }, children: [ m.trust("<div>") ] })'
    );
    
    t.end();
});

test("Nested m()", function(t) {
    t.deepEqual(
        p('m("div", m("div"))'),
        m("div", m("div"))
    );
    
    t.end();
});

test("JSON.stringify", function(t) {
    t.equal(
        p.objectify('m("div", JSON.stringify({}))'),
        '({ tag: "div", attrs: {  }, children: [ JSON.stringify({}) ] })'
    );
    
    t.equal(
        p.objectify('m("div", JSON.parse({}))'),
        'm("div", JSON.parse({}))'
    );
    
    t.end();
});

test("Filtering doesn't transform unsafe invocations", function(t) {
    // Ensure that the selector must be literal
    t.equal(
        p.objectify('m(".fooga" + dynamic)'),
        'm(".fooga" + dynamic)'
    );
    
    t.equal(
        p.objectify('m("input" + ".pure-u")'),
        'm("input" + ".pure-u")'
    );
    
    // Identifiers can't be resolved at compile time, so ignore
    t.equal(
        p.objectify('m(".fooga", identifier)'),
        'm(".fooga", identifier)'
    );
    
    t.end();
});

test("Babelified code", function(t) {
    t.equal(
        p.objectify(fs.readFileSync("./test/specimens/in-babel-es5.js")),
        fs.readFileSync("./test/specimens/out-babel-es5.js", "utf8")
    );

    t.end();
});

test("transform", function(t) {
    t.plan(2);
    
    s("./test.js", 'm("div")', function(code) {
        t.equal(
            code.toString("utf8"),
            '({ tag: "div", attrs: {  }, children: [] })'
        );
    });
    
    s("./test.css", ".fooga { color: red; }", function(code) {
        t.equal(
            code.toString("utf8"),
            ".fooga { color: red; }"
        );
    });
});

test("Rollup plugin", function(t) {
    var r = require("../rollup"),
        obj;

    t.plan(5);

    t.equal(typeof r, "function");

    obj = r();

    t.equal(typeof obj, "object");
    t.ok("transformBundle" in obj);

    t.equal(typeof obj.transformBundle, "function");
    t.deepEqual(
        obj.transformBundle('m("#fooga")'),
        { code : '({ tag: "div", attrs: { "id": "fooga" }, children: [] })' }
    );
});
