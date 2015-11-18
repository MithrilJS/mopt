"use strict";

var path = require("path"),

    through = require("through2"),
    sink    = require("sink-transform"),
    falafel = require("falafel"),

    objectify = require("./src/objectify");

function transform(source) {
    return falafel({
        source      : source,
        ecmaVersion : 6
    }, objectify);
}

module.exports = function(file) {
    if(path.extname(file) !== ".js") {
        return through();
    }

    return sink.str(function(source, done) {
        this.push(transform(source).toString());

        done();
    });
};

module.exports.objectify = transform;
