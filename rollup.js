"use strict";

var path = require("path"),

    utils  = require("rollup-pluginutils"),
    assign = require("lodash.assign"),

    transform = require("./src");

module.exports = function rollup(options) {
    var opts   = options || {},
        filter = utils.createFilter(opts.include, opts.exclude);
    
    return {
        transform : function(code, id) {
            var result;
            
            if(!filter(id)) {
                return undefined;
            }
            
            result = transform(code, assign(opts, {
                sourceFileName : id,
                sourceMapName  : id.replace(path.extname(id), ".map.json")
            }));
            
            return {
                code : result.code,
                map  : result.map
            };
        }
    };
};
