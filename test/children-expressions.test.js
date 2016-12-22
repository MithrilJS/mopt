"use strict";

var assert = require("assert"),
    
    code = require("./lib/code");

describe("Children", function() {
    describe.skip("Expression children", function() {
        it("should support expressions with literal values (strings)", function() {
            assert.equal(
                code(`m("div", "fooga" + "wooga")`),
                `({tag:"div",attrs:undefined,children:["fooga"+"wooga"],dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined});`
            );
        });

        it("should support expressions with literal values (numbers)", function() {
            assert.equal(
                code(`m("div", 1 + 2)`),
                `({tag:"div",attrs:undefined,children:["fooga"+"wooga"],dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined});`
            );
        });

        it("should support expressions with literal values (strings + numbers)", function() {
            assert.equal(
                code(`m("div", 1 + "wooga")`),
                `({tag:"div",attrs:undefined,children:["fooga"+"wooga"],dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined});`
            );
        });

        it("should not convert expressions with operators other than +", function() {
            assert.equal(
                code(`m("input" - 2)`),
                `m("input"-2);`
            );
            
            assert.equal(
                code("m(3 * 2)"),
                "m(3*2);"
            );
        });
        
        // TODO: why not?
        it("should not convert expressions containing more than 2 values", function() {
            assert.equal(
                code(`m("input" + ".pure-u" + ".pure-u-1-2")`),
                `m("input"+".pure-u"+".pure-u-1-2");`
            );
        });
        
        it("should not convert non-literal values", function() {
            assert.equal(
                code(`m("input" + identifier)`),
                `m("input"+identifier);`
            );
        });
    });
});
