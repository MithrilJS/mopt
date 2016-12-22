"use strict";

var match = require("lodash.ismatchwith");

// Simple wrapper around ismatchwith to allow for function keys in the filter object
module.exports = (target, filter) =>
    match(target, filter, (val, test) => {
        // Support functions for comparisons
        if(typeof test === "function") {
            return test(val);
        }
    });
