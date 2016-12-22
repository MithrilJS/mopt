"use strict";

var assert = require("assert"),
    
    code = require("./lib/code");

describe("Children", function() {
    describe.skip("String.prototype method children", function() {
        it("should support String.prototype methods", function() {
            assert.equal(
                code(`m("div", "fooga".replace("f", "g"))`),
                `({tag:"div",attrs:undefined,children:["fooga".replace("f","g")],dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined});`
            );
            
            assert.equal(
                code(`m("div", "fooga"["replace"]("f", "g"))`),
                `({tag:"div",attrs:undefined,children:["fooga"["replace"]("f","g")],dom:undefined,domSize:undefined,events:undefined,key:undefined,state:{},text:undefined});`
            );
        });
    });
});
