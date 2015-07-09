/*jshint ignore:start */

// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
    String.prototype.format = function () {
        "use strict";
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] !== 'undefined'
        ? args[number]
        : match
            ;
        });
    };
}
/*jshint ignore:end */