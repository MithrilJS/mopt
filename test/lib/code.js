"use strict";

var objectify = require("../../");

module.exports = function(source, options) {
    if(!options) {
        options = {
            lineTerminator : ""
        };
    }
    
    return objectify(source, options).code;
};
