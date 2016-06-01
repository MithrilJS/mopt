"use strict";

var assert = require("assert"),

    m     = require("mithril/render/hyperscript"),
    trust = require("mithril/render/trust"),
    
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
        
        describe("Array Children", function() {
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
        
        
        describe("Nested m()", function() {
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
                    run('m("div", [ m("p") ])'),
                    m("div", [ m("p") ])
                );
                
                assert.deepEqual(
                    run('m("div", [ m("a[href=\'http://google.com\']") ])'),
                    m("div", [ m("a[href='http://google.com']") ])
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
        
        describe("Mixed Children", function() {
            it("should support mixed array and literal children", function() {
                assert.deepEqual(
                    run('m("div", [ 1 ], 2)'),
                    m("div", [ 1 ], 2)
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

    describe("Attributes: class vs className", function() {
        it("should combine tag class & attr class", function() {
            assert.deepEqual(
                run('m(".foo", { class : "bar" })'),
                m(".foo", { class : "bar" })
            );
        });

        it("should combine tag class & attr className", function() {
            assert.deepEqual(
                run('m(".foo", { className : "bar" })'),
                m(".foo", { className : "bar" })
            );
        });
        
        it("should combine tag class & attr className", function() {
            assert.deepEqual(
                run('m(".foo[checked]", { className : "bar" })'),
                m(".foo[checked]", { className : "bar" })
            );
        });
        
        it("selector class, empty className attr", function() {
            assert.deepEqual(
                run('m(".foo", { className : "" })'),
                m(".foo", { className : "" })
            );
        });

        it("no selector class, empty className attr", function() {
            assert.deepEqual(
                run('m("div", { className : "" })'),
                m("div", { className : "" })
            );
        });

        it("no selector class, empty class attr", function() {
            assert.deepEqual(
                run('m("div", { class : "" })'),
                m("div", { class : "" })
            );
        });
    });
    
    describe("SVG", function() {
        it("should support svg selectors", function() {
            assert.deepEqual(
                run('m("svg")'),
                m("svg")
            );
        });
        
        it("should support nested svg selectors", function() {
            assert.deepEqual(
                run('m("svg", m("g"))'),
                m("svg", m("g"))
            );
        });
    });
    
    describe("m.trust", function() {
        // These tests aren't using m.trust, but trust is the same thing
        it("should optimize a bare m.trust()", function() {
            assert.deepEqual(
                run('m.trust("<div>")'),
                trust("<div>")
            );
        });
        
        it("should optimize m.trust() children", function() {
            assert.deepEqual(
                run('m("div", m.trust("<div>"))'),
                m("div", trust("<div>"))
            );
        });
    });
});
