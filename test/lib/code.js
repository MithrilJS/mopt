"use strict";

var babel  = require("babel-core"),
    
    plugin = require("../../");

module.exports = function(source, options) {
    var result = babel.transform(source, Object.assign({
            compact : true,
            plugins : [
                plugin
            ],
            generatorOpts : {
                quotes : "double"
            }
        }, options || {}));
    
    return result.code;
};
