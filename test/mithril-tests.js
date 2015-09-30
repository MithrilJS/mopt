"use strict";

// These tests are replicating the core mithril tests around the behavior of m(...),
// which I grabbed from https://github.com/lhorie/mithril.js/blob/next/tests/mithril-tests.js#L6-L44

var test = require("tape"),
    m    = require("mithril"),
    
    p = require("./_parse");

test("Selectors", function(t) {
    t.looseEqual(
        p(`m("div")`),
        m("div")
    );

    t.looseEqual(
        p(`m(".foo")`),
        m(".foo")
    );

    t.looseEqual(
        p(`m("[title=bar]")`),
        m("[title=bar]")
    );

    t.looseEqual(
        p(`m("[title='bar']")`),
        m("[title='bar']")
    );

    t.looseEqual(
        p(`m('[title="bar"]')`),
        m('[title="bar"]')
    );
    
    t.end();
});

test("Children", function(t) {
    t.looseEqual(
        p(`m("div", "test")`),
        m("div", "test")
    );
    
    t.looseEqual(
        p(`m("div", "test", "test2")`),
        m("div", "test", "test2")
    );
    
    t.looseEqual(
        p(`m("div", ["test"])`),
        m("div", ["test"])
    );

    t.looseEqual(
        p(`m("div", {title: "bar"}, "test")`),
        m("div", {title: "bar"}, "test")
    );
    
    t.looseEqual(
        p(`m("div", {title: "bar"}, ["test"])`),
        m("div", {title: "bar"}, ["test"])
    );
    
    t.looseEqual(
        p(`m("div", {title: "bar"}, m("div"))`),
        m("div", {title: "bar"}, m("div"))
    );
    
    t.looseEqual(
        p(`m("div", {title: "bar"}, [m("div")])`),
        m("div", {title: "bar"}, [m("div")])
    );
    
    t.looseEqual(
        p(`m("div", {title: "bar"}, "test0", "test1", "test2", "test3")`),
        m("div", {title: "bar"}, "test0", "test1", "test2", "test3")
    );
    
    t.looseEqual(
        p(`m("div", {title: "bar"}, m("div"), m("i"), m("span"))`),
        m("div", {title: "bar"}, m("div"), m("i"), m("span"))
    );
    
    t.looseEqual(
        p(`m("div", ["a", "b"])`),
        m("div", ["a", "b"])
    );
    
    t.looseEqual(
        p(`m("div", [m("div")])`),
        m("div", [m("div")])
    );
    
    t.looseEqual(
        p(`m("div", m("div"))`),
        m("div", m("div"))
    );
    
    t.looseEqual(
        p(`m("div", [undefined])`),
        m("div", [undefined])
    );

    t.looseEqual(
        p(`m("div", [{foo: "bar"}])`),
        m("div", [{foo: "bar"}])
    );

    t.looseEqual(
        p(`m("svg", [m("g")])`),
        m("svg", [m("g")])
    );
    
    t.looseEqual(
        p(`m("svg", [m("a[href='http://google.com']")])`),
        m("svg", [m("a[href='http://google.com']")])
    );

    t.looseEqual(
        p(`m("div", [1, 2, 3], 4)`),
        m("div", [1, 2, 3], 4)
    );
    
    t.looseEqual(
        p(`m("div", [1, 2, 3])`),
        m("div", [1, 2, 3])
    );
    
    t.looseEqual(
        p(`m("div", [1, 2, 3], [4, 5, 6, 7])`),
        m("div", [1, 2, 3], [4, 5, 6, 7])
    );
    
    t.looseEqual(
        p(`m("div", [1], [2], [3])`),
        m("div", [1], [2], [3])
    );

    t.end();
});

test("class vs className", function(t) {
    t.looseEqual(
        p(`m(".foo", {"class": "bar"})`),
        m(".foo", {"class": "bar"})
    );
    
    t.looseEqual(
        p(`m(".foo", {className: "bar"})`),
        m(".foo", {className: "bar"})
    );
    
    t.looseEqual(
        p(`m(".foo", {className: ""})`),
        m(".foo", {className: ""})
    );
    
    t.looseEqual(
        p(`m("div", {className: ""})`),
        m("div", {className: ""})
    );
    
    t.looseEqual(
        p(`m("div", {"class": ""})`),
        m("div", {"class": ""})
    );
    
    t.end();
});
