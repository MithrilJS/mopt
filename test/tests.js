/* eslint-env node, es6 */
"use strict";

var test    = require("tape"),
    falafel = require("falafel"),

    objectify = require("../lib/objectify");

function parse(code) {
    return falafel(code, objectify).toString();
}

test("Selectors", function(t) {
    t.equal(
        parse(`m("div")`),
        `({ tag: "div", attrs: {  }, children: [  ] })`
    );

    t.equal(
        parse(`m(".foo")`),
        `({ tag: "div", attrs: { "className": "foo" }, children: [  ] })`
    );

    t.equal(
        parse(`m("[title=bar]")`),
        `({ tag: "div", attrs: { "title": "bar" }, children: [  ] })`
    );

    t.equal(
        parse(`m("[title='bar']")`),
        `({ tag: "div", attrs: { "title": "bar" }, children: [  ] })`
    );

    t.equal(
        parse(`m('[title="bar"]')`),
        `({ tag: "div", attrs: { "title": "bar" }, children: [  ] })`
    );
    
    t.end();
});

test("Children", function(t) {
    t.equal(
        parse(`m("div", "test")`),
        `({ tag: "div", attrs: {  }, children: [ "test" ] })`
    );
    
    t.equal(
        parse(`m("div", "test", "test2")`),
        `({ tag: "div", attrs: {  }, children: [ "test", "test2" ] })`
    );
    
    t.equal(
        parse(`m("div", ["test"])`),
        `({ tag: "div", attrs: {  }, children: [ "test" ] })`
    );

    t.equal(
        parse(`m("div", {title: "bar"}, "test")`),
        `({ tag: "div", attrs: { "title": "bar" }, children: [ "test" ] })`
    );
    
    t.equal(
        parse(`m("div", {title: "bar"}, ["test"])`),
        `({ tag: "div", attrs: { "title": "bar" }, children: [ "test" ] })`
    );
    
    t.equal(
        parse(`m("div", {title: "bar"}, m("div"))`),
        `({ tag: "div", attrs: { "title": "bar" }, children: [ ({ tag: "div", attrs: {  }, children: [  ] }) ] })`
    );
    
    t.equal(
        parse(`m("div", {title: "bar"}, [m("div")])`),
        `({ tag: "div", attrs: { "title": "bar" }, children: [ ({ tag: "div", attrs: {  }, children: [  ] }) ] })`
    );
    
    t.equal(
        parse(`m("div", {title: "bar"}, "test0", "test1", "test2", "test3")`),
        `({ tag: "div", attrs: { "title": "bar" }, children: [ "test0", "test1", "test2", "test3" ] })`
    );
    
    t.equal(
        parse(`m("div", {title: "bar"}, m("div"), m("i"), m("span"))`),
        `({ tag: "div", attrs: { "title": "bar" }, children: [ ({ tag: "div", attrs: {  }, children: [  ] }), ({ tag: "i", attrs: {  }, children: [  ] }), ({ tag: "span", attrs: {  }, children: [  ] }) ] })`
    );
    
    t.equal(
        parse(`m("div", ["a", "b"])`),
        `({ tag: "div", attrs: {  }, children: [ "a", "b" ] })`
    );
    
    t.equal(
        parse(`m("div", [m("div")])`),
        `({ tag: "div", attrs: {  }, children: [ ({ tag: "div", attrs: {  }, children: [  ] }) ] })`
    );
    
    t.equal(
        parse(`m("div", m("div"))`),
        `({ tag: "div", attrs: {  }, children: [ ({ tag: "div", attrs: {  }, children: [  ] }) ] })`
    );
    
    t.equal(
        parse(`m("div", [undefined])`),
        `({ tag: "div", attrs: {  }, children: [ undefined ] })`
    );

    t.equal(
        parse(`m("div", [{foo: "bar"}])`),
        `({ tag: "div", attrs: {  }, children: [ {foo: "bar"} ] })`
    );

    t.equal(
        parse(`m("svg", [m("g")])`),
        `({ tag: "svg", attrs: {  }, children: [ ({ tag: "g", attrs: {  }, children: [  ] }) ] })`
    );
    
    t.equal(
        parse(`m("svg", [m("a[href='http://google.com']")])`),
        `({ tag: "svg", attrs: {  }, children: [ ({ tag: "a", attrs: { "href": "http://google.com" }, children: [  ] }) ] })`
    );

    t.equal(
        parse(`m("div", [1, 2, 3], 4)`),
        `({ tag: "div", attrs: {  }, children: [ [1, 2, 3], 4 ] })`
    );
    
    t.equal(
        parse(`m("div", [1, 2, 3])`),
        `({ tag: "div", attrs: {  }, children: [ 1, 2, 3 ] })`
    );
    
    t.equal(
        parse(`m("div", [1, 2, 3], [4, 5, 6, 7])`),
        `({ tag: "div", attrs: {  }, children: [ [1, 2, 3], [4, 5, 6, 7] ] })`
    );
    
    t.equal(
        parse(`m("div", [1], [2], [3])`),
        `({ tag: "div", attrs: {  }, children: [ [1], [2], [3] ] })`
    );

    t.end();
});

test("class vs className", function(t) {
    t.equal(
        parse(`m(".foo", {"class": "bar"})`),
        `({ tag: "div", attrs: { "class": "foo bar" }, children: [  ] })`
    );
    
    t.equal(
        parse(`m(".foo", {className: "bar"})`),
        `({ tag: "div", attrs: { "className": "foo bar" }, children: [  ] })`
    );
    
    t.equal(
        parse(`m(".foo", {className: ""})`),
        `({ tag: "div", attrs: { "className": "foo" }, children: [  ] })`
    );
    
    t.equal(
        parse(`m("div", {className: ""})`),
        `({ tag: "div", attrs: { "className": "" }, children: [  ] })`
    );
    
    t.equal(
        parse(`m("div", {"class": ""})`),
        `({ tag: "div", attrs: { "class": "" }, children: [  ] })`
    );
    
    t.end();
});
