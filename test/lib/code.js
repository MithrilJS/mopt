"use strict";

var babel = require("babel-core"),
    
    plugin = require("../../");

module.exports = function(source) {
    var result = babel.transform(source, {
            compact : true,
            plugins : [
                plugin
            ]
        });
    
    return result.code;
};
