"use strict";

var path = require("path"),

    through = require("through2"),
    falafel = require("falafel"),

    objectify = require("./src/objectify");

module.exports = function(file) {
    var text = "";

    if(path.extname(file) !== ".js") {
        return through();
    }

    return through(
        function(buf, encoding, done) {
            text += buf;

            done();
        },
        function(done) {
            this.push(falafel(text, objectify).toString());

            done();
        }
    );
};

module.exports.objectify = function(src) {
    return falafel(src, objectify);
};
