/// <reference path="/@JSense.js" />
/*exported ReCheckNotification*/
"use strict";

function ReCheckNotification() {
    var urlRecheck = window.rootUrl + "Notification/ReCheckNotification";

    $.ajax({
        url: urlRecheck,
        type: "POST",
        dataType: "json",
        success: function (results) {
            alert('results');
        },
        error: function () {
        }
    });
}

$(document).ready(function () {
    setInterval(ReCheckNotification, 10000);
});