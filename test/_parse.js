"use strict";

var objectify = require("../").objectify;

module.exports = function(code) {
    return objectify(code).toString("utf8");
};
