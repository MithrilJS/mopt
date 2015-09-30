"use strict";

var vm = require("vm"),
    
    objectify = require("../").objectify;

module.exports = function(code) {
    // wrap w/ vm so it returns an object
    return vm.runInThisContext(objectify(code).toString("utf8"));
};
