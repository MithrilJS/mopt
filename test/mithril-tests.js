"use strict";

// These tests are replicating the core mithril tests around the behavior of m(...),
// which I grabbed from https://github.com/lhorie/mithril.js/blob/next/tests/mithril-tests.js#L6-L44

var assert = require("assert"),

    m = require("mithril"),
    
    run = require("./lib/run");

describe("mithril-objectify", function() {
    describe("Selectors", function() {
        it("should support tag selectors", function() {
            assert.deepEqual(
                run('m("div")'),
                m("div")
            );
        });

        it("should support class selectors", function() {
            assert.deepEqual(
                run('m(".foo")'),
                m(".foo")
            );
        });

        it("should support attribute selectors", function() {
            assert.deepEqual(
                run('m("[title=bar]")'),
                m("[title=bar]")
            );
        });

        it("should support single-quoted attribute selectors", function() {
            assert.deepEqual(
                run('m("[title=\'bar\']")'),
                m("[title='bar']")
            );
        });

        it("should support double-quoted attribute selectors", function() {
            assert.deepEqual(
                run('m(\'[title="bar"]\')'),
                m('[title="bar"]')
            );
        });
    });

    describe("Children", function() {
        describe("literal children", function() {
            it("should support single literal children (string)", function() {
                assert.deepEqual(
                    run('m("div", "test")'),
                    m("div", "test")
                );
            });
            
            it("should support single literal children (undefined)", function() {
                assert.deepEqual(
                    run('m("div", [ undefined ])'),
                    m("div", [ undefined ])
                );
            });
            
            it("should support single literal children (object)", function() {
                assert.deepEqual(
                    run('m("div", [ { foo : "bar" } ])'),
                    m("div", [ { foo : "bar" } ])
                );
            });
            
            it("should multiple literal children", function() {
                assert.deepEqual(
                    run('m("div", "test", "test2")'),
                    m("div", "test", "test2")
                );
            });
            
            it("should support attrs + single children", function() {
                assert.deepEqual(
                    run('m("div", { title : "bar" }, "test")'),
                    m("div", { title : "bar" }, "test")
                );
            });
            
            it("should support attrs + multiple children", function() {
                assert.deepEqual(
                    run('m("div", { title : "bar" }, "test0", "test1", "test2", "test3")'),
                    m("div", { title : "bar" }, "test0", "test1", "test2", "test3")
                );
            });
        });
        
        describe("array children", function() {
            it("should support array children", function() {
                assert.deepEqual(
                    run('m("div", [ "test" ])'),
                    m("div", [ "test" ])
                );
                
                assert.deepEqual(
                    run('m("div", [ 1, 2, 3 ])'),
                    m("div", [ 1, 2, 3 ])
                );
            });
            
            it("should support attrs + array children", function() {
                assert.deepEqual(
                    run('m("div", { title : "bar" }, [ "test" ])'),
                    m("div", { title : "bar" }, [ "test" ])
                );
            });
        });
        
        
        describe("nested m()", function() {
            it("should support nested m() invocations", function() {
                assert.deepEqual(
                    run('m("div", m("div"))'),
                    m("div", m("div"))
                );
            });
            
            it("should support arrays of nested m() invocations", function() {
                assert.deepEqual(
                    run('m("div", [ m("div") ])'),
                    m("div", [ m("div") ])
                );
                
                assert.deepEqual(
                    run('m("svg", [ m("g") ])'),
                    m("svg", [ m("g") ])
                );
                
                assert.deepEqual(
                    run('m("svg", [ m("a[href=\'http://google.com\']") ])'),
                    m("svg", [ m("a[href='http://google.com']") ])
                );
            });
            
            it("should support multiple nested m() invocations", function() {
                assert.deepEqual(
                    run('m("div", m("div"), m("i"), m("span"))'),
                    m("div", m("div"), m("i"), m("span"))
                );
            });
            
            it("should support attrs + nested m() invocations", function() {
                assert.deepEqual(
                    run('m("div", { title : "bar" }, m("div"))'),
                    m("div", { title : "bar" }, m("div"))
                );
            });
            
            it("should supported attrs + arrays of nested m() invocations", function() {
                assert.deepEqual(
                    run('m("div", { title : "bar" }, [ m("div") ])'),
                    m("div", { title : "bar" }, [ m("div") ])
                );
            });
            
            it("should support attrs + multiple nested m() invocations", function() {
                assert.deepEqual(
                    run('m("div", { title : "bar" }, m("div"), m("i"), m("span"))'),
                    m("div", { title : "bar" }, m("div"), m("i"), m("span"))
                );
            });
        });
        
        describe("mixed children", function() {
            it("should support mixed array and literal children", function() {
                assert.deepEqual(
                    run('m("div", [ 1, 2, 3 ], 4)'),
                    m("div", [ 1, 2, 3 ], 4)
                );
            });
            
            it("should support multiple arrays of children", function() {
                assert.deepEqual(
                    run('m("div", [ 1, 2, 3 ], [ 4, 5, 6, 7 ])'),
                    m("div", [ 1, 2, 3 ], [ 4, 5, 6, 7 ])
                );
                
                assert.deepEqual(
                    run('m("div", [ 1 ], [ 2 ], [ 3 ])'),
                    m("div", [ 1 ], [ 2 ], [ 3 ])
                );
            });
        });
    });

    describe("class vs className", function() {
        it("should combine tag class & attr class/className", function() {
            assert.deepEqual(
                run('m(".foo", { class : "bar" })'),
                m(".foo", { class : "bar" })
            );
        
            assert.deepEqual(
                run('m(".foo", { className : "bar" })'),
                m(".foo", { className : "bar" })
            );
        });
        
        it("empty attr class/className", function() {
            assert.deepEqual(
                run('m(".foo", { className : "" })'),
                m(".foo", { className : "" })
            );
            
            assert.deepEqual(
                run('m("div", { className : "" })'),
                m("div", { className : "" })
            );
            
            assert.deepEqual(
                run('m("div", { class : "" })'),
                m("div", { class : "" })
            );
        });
    });
});
