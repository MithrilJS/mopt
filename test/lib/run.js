"use strict";

var vm = require("vm"),
    
    objectify = require("../../");
    
module.exports = function(source) {
    var result = objectify(source);
    
    // wrap w/ vm so it returns an object
    return vm.runInThisContext(result.code);
};
