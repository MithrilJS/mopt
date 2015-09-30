"use strict";

var fs = require("fs"),
    
    falafel = require("falafel"),
    
    objectify = require("../index.js").objectify;

fs.readFile(process.argv[2], function(errin, file) {
    var result;

    if(errin) {
        throw new Error(errin);
    }

    result = falafel(file, objectify);

    if(process.argv[3]) {
        return fs.writeFile(process.argv[3], result, function(errout) {
            if(errout) {
                throw new Error(errout);
            }

            console.log("Wrote " + process.argv[3]); // TODO: REMOVE DEBUGGING
        });
    }

    console.log(result); // TODO: REMOVE DEBUGGING
});
