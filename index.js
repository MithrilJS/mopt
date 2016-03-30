"use strict";

var falafel = require("falafel"),

    objectify = require("./src/objectify");

module.exports = function transform(source) {
    return falafel({
        source      : source,
        ecmaVersion : 6
    }, objectify);
};
