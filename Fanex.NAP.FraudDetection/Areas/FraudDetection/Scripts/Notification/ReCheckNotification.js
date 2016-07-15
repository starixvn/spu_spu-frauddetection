/// <reference path="/@JSense.js" />
/*exported ReCheckNotification*/
"use strict";
var showNotification = false;
var updateStatus = false;

function ReCheckNotification() {
    var urlRecheck = window.rootUrl + "Notification/ReCheckNotification";

    $.ajax({
        url: urlRecheck,
        type: "POST",
        dataType: "json",
        data: { updateStatus: updateStatus },
        success: function (results) {
            if (results.NumNewMessage <= 0)
            {
                $('#noti-unread-msg').hide();
            }
            else
            {
                $('#noti-unread-msg').show();
                $('#noti-unread-msg').html(results.NumNewMessage);
            }

            var messagesHtmlString = "";
            var messagesNum = results.MessageList.length;
            for (var i = 0; i < messagesNum; i++)
            {
                var message = results.MessageList[i];
                if (message.IsViewed == true) {
                    messagesHtmlString += "<div class='notify-text-wrap' style='width: 100%'>" + message.MessageContent + "</div><hr class='style-two'>";
                }
                else {
                    messagesHtmlString += "<div class='notify-text-wrap notify-text-bold' style='width: 100%'>" + message.MessageContent + "</div><hr class='style-two'>";
                }
            }

            $('#notificationsBody').html(messagesHtmlString);
        },
        error: function () {
        }
    });
}

$(document).ready(function () {
    $('#notification-icon').click(function()
    {
        $('#noti-unread-msg').hide();
        showNotification = !showNotification;
        if (showNotification) {
            updateStatus = true;
            ReCheckNotification();
            $('#notificationContainer').show();
        }
        else
        {
            updateStatus = false;
            $('#notificationContainer').hide();
        }
    });

    $(document).mouseup(function (e) {
        if (e.target.id != $("#notificationContainer").attr('id') && !$("#notificationContainer").has(e.target).length) {
            $("#notificationContainer").hide();
        }
    });

    ReCheckNotification();
    setInterval(ReCheckNotification, 3000);
});
