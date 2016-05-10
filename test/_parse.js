"use strict";

var vm = require("vm"),
    
    objectify = require("../");
    
module.exports = function(source) {
    var result = objectify(source);
    
    console.log(source);
    console.log(result.code);
    
    // wrap w/ vm so it returns an object
    return vm.runInThisContext(result.code);
};

// Expose for ease of referencing
module.exports.objectify = objectify;
