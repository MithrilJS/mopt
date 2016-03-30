"use strict";

var transform = require("./");

module.exports = function rollup() {
    return {
        transformBundle : function(code) {
            return {
                code : transform(code).toString("utf8")
            };
        }
    };
};
