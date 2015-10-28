"use strict";

var vm = require("vm"),
    
    objectify = require("../").objectify;
    
function process(code) {
    return objectify(code).toString("utf8");
}

module.exports = function(code) {
    // wrap w/ vm so it returns an object
    return vm.runInThisContext(process(code));
};

// Expose for ease of referencing
module.exports.objectify = process;
