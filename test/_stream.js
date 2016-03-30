"use strict";

module.exports = function(file, contents, done) {
    var Readable  = require("stream").Readable,
        concat    = require("concat-stream"),
        objectify = require("../browserify"),
        readable  = new Readable(),
        through;
    
    through = objectify(file);
    
    readable.pipe(through);
    
    readable.push(contents);
    readable.push(null);
    
    through.pipe(concat(done));
};
