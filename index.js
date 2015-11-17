"use strict";

var path = require("path"),

    through = require("through2"),
    falafel = require("falafel"),

    objectify = require("./src/objectify");

function transform(source) {
    return falafel({
        source      : source,
        ecmaVersion : 6
    }, objectify);
}

module.exports = function(file) {
    var source = "";

    if(path.extname(file) !== ".js") {
        return through();
    }

    return through(
        function(buf, encoding, done) {
            source += buf;

            done();
        },
        function(done) {
            this.push(transform(source).toString());

            done();
        }
    );
};

module.exports.objectify = transform;
