/* eslint no-console:0 */
"use strict";

var fs = require("fs"),
    
    objectify = require("../index.js").objectify;

fs.readFile(process.argv[2], function(errin, file) {
    var result;

    if(errin) {
        throw new Error(errin);
    }

    result = objectify(file);

    if(process.argv[3]) {
        return fs.writeFile(process.argv[3], result, function(errout) {
            if(errout) {
                throw new Error(errout);
            }

            console.log("Wrote " + process.argv[3]);
        });
    }

    console.log(result);
});
