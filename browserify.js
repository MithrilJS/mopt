"use strict";

var path = require("path"),

    through = require("through2"),
    sink    = require("sink-transform"),

    transform = require("./");

module.exports = function browserify(file) {
    if(path.extname(file) !== ".js") {
        return through();
    }

    return sink.str(function(source, done) {
        this.push(transform(source).toString("utf8"));

        done();
    });
};
