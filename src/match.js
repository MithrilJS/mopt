"use strict";

var match = require("lodash.ismatchwith");

// Small wrapper around lodash to support function/regexp testing
module.exports = (target, filter) =>
    match(target, filter, (val, test) => {
        // Support function comparisons
        if(typeof test === "function") {
            return test(val);
        }

        // Support RegExp comparisons
        if(test instanceof RegExp) {
            return test.test(val);
        }

        // Use default comparison
        return undefined;
    });
