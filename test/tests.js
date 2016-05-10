"use strict";

var fs     = require("fs"),
    assert = require("assert"),

    m    = require("mithril"),

    p = require("./_parse"),
    s = require("./_stream");
    
it("Dynamic classes", function() {
    /* eslint no-constant-condition:0 */

    assert.deepEqual(
        p('m("input.fooga", { class : true ? "true" : "false" })'),
        m("input.fooga", { class : true ? "true" : "false" })
    );
});

it("Empty selector", function() {
    assert.deepEqual(
        p('m("")'),
        m("")
    );
});

it("Selector w/ id", function() {
    assert.deepEqual(
        p('m("#fooga")'),
        m("#fooga")
    );
});

it("Selector w/ attribute w/ no value", function() {
    assert.deepEqual(
        p('m("div[fooga]")'),
        m("div[fooga]")
    );
});

it("Non-string attr values", function() {
    assert.deepEqual(
        p('m("div", { fooga : 0 })'),
        m("div", { fooga : 0 })
    );
    
    assert.deepEqual(
        p('m("div", { fooga : false })'),
        m("div", { fooga : false })
    );
    
    assert.deepEqual(
        p('m("div", { fooga : null })'),
        m("div", { fooga : null })
    );
    
    assert.deepEqual(
        p('m("div", { fooga : undefined })'),
        m("div", { fooga : undefined })
    );
});

it("Quoted properties (issue #6)", function() {
    /* eslint quote-props:0 */
    assert.deepEqual(
        p('m("div", { "fooga" : 0 })'),
        m("div", { "fooga" : 0 })
    );
});

it("Strings", function() {
    assert.deepEqual(
        p('m("div", "fooga")'),
        m("div", "fooga")
    );
    
    assert.equal(
        p.objectify('m("div", "fooga" + "wooga")'),
        '({ tag: "div", attrs: {  }, children: [ "fooga" + "wooga" ] })'
    );
    
    assert.equal(
        p.objectify('m("div", "fooga".replace("f", "g"))'),
        '({ tag: "div", attrs: {  }, children: [ "fooga".replace("f", "g") ] })'
    );
});

it("Array.prototype methods", function() {
    /* eslint brace-style:0, no-unused-expressions:0 */
    assert.deepEqual(
        p('m("div", [ 1, 2 ].map(function(val) { return val; }))'),
        m("div", [ 1, 2 ].map(function(val) { return val; }))
    );

    assert.deepEqual(
        p('m("div", [ 1, 2 ].filter(function(val) { return val === 1; }))'),
        m("div", [ 1, 2 ].filter(function(val) { return val === 1; }))
    );

    assert.deepEqual(
        p('m("div", [ 1, 2 ].sort())'),
        m("div", [ 1, 2 ].sort())
    );
    
    // Mithril & falafel don't agree on the ouput of running this, but
    // they're both valid
    assert.equal(
        p.objectify('m("div", [ 1, 2 ].join(""))'),
        '({ tag: "div", attrs: {  }, children: [ 1, 2 ].join("") })'
    );
    
    // Untransformable methods since they don't return an array :(
    assert.equal(
        p.objectify('m("div", [ 1, 2 ].forEach(function(val) { return val === 1 }))'),
        'm("div", [ 1, 2 ].forEach(function(val) { return val === 1 }))'
    );
    
    assert.equal(
        p.objectify('m("div", [ 1, 2 ].some(function(val) { return val === 1 }))'),
        'm("div", [ 1, 2 ].some(function(val) { return val === 1 }))'
    );
});

it("Conditional expressions", function() {
    // Can convert literals!
    assert.equal(
        p.objectify('m("div", foo ? "bar" : "baz")'),
        '({ tag: "div", attrs: {  }, children: [ foo ? "bar" : "baz" ] })'
    );
    
    // Can't convert this, dunno what `bar` is
    assert.equal(
        p.objectify('m("div", foo ? bar : "baz")'),
        'm("div", foo ? bar : "baz")'
    );
    
    // Can't convert this, unable to merge args w/ conditional results
    assert.equal(
        p.objectify('m("div", foo ? { class : options.class } : null)'),
        'm("div", foo ? { class : options.class } : null)'
    );
});

it("m.trust children", function() {
    assert.equal(
        p.objectify('m("div", m.trust("<div>"))'),
        '({ tag: "div", attrs: {  }, children: [ m.trust("<div>") ] })'
    );
});

it("m.component children", function() {
    assert.equal(
        p.objectify('m("div", m.component(fooga))'),
        '({ tag: "div", attrs: {  }, children: [ m.component(fooga) ] })'
    );
});

it("Nested m()", function() {
    assert.deepEqual(
        p('m("div", m("div"))'),
        m("div", m("div"))
    );
    
    assert.deepEqual(
        p('m("div", m("div", m("div")), m("div"))'),
        m("div", m("div", m("div")), m("div"))
    );
});

it("JSON.stringify", function() {
    assert.equal(
        p.objectify('m("div", JSON.stringify({}))'),
        '({ tag: "div", attrs: {  }, children: [ JSON.stringify({}) ] })'
    );
    
    assert.equal(
        p.objectify('m("div", JSON.parse({}))'),
        'm("div", JSON.parse({}))'
    );
});

it("Filtering doesn't transform unsafe invocations", function() {
    // Ensure that the selector must be literal
    assert.equal(
        p.objectify('m(".fooga" + dynamic)'),
        'm(".fooga" + dynamic)'
    );
    
    assert.equal(
        p.objectify('m("input" + ".pure-u")'),
        'm("input" + ".pure-u")'
    );
    
    // Identifiers can't be resolved at compile time, so ignore
    assert.equal(
        p.objectify('m(".fooga", identifier)'),
        'm(".fooga", identifier)'
    );
});

it("Babelified code", function() {
    assert.equal(
        p.objectify(fs.readFileSync("./test/specimens/in-babel-es5.js")),
        fs.readFileSync("./test/specimens/out-babel-es5.js", "utf8")
    );
});

it.skip("transform", function() {
    s("./test.js", 'm("div")', function(code) {
        assert.equal(
            code.toString("utf8"),
            '({ tag: "div", attrs: {  }, children: [] })'
        );
    });
    
    s("./test.css", ".fooga { color: red; }", function(code) {
        assert.equal(
            code.toString("utf8"),
            ".fooga { color: red; }"
        );
    });
});

it.skip("Rollup plugin", function() {
    var r = require("../rollup"),
        obj;

    assert.equal(typeof r, "function");

    obj = r();

    assert.equal(typeof obj, "object");
    assert("transformBundle" in obj);

    assert.equal(typeof obj.transformBundle, "function");
    assert.deepEqual(
        obj.transformBundle('m("#fooga")'),
        { code : '({ tag: "div", attrs: { "id": "fooga" }, children: [] })' }
    );
});
