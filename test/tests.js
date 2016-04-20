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
