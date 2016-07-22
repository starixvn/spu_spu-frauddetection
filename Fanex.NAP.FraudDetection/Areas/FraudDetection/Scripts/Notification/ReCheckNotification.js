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
            var htmlTemplateRead = "<div class='notify-text-wrap notify-text-wrap-link' style='width: 100%; cursor: pointer;' data-caseid='{0}' data-matchid='{1}' data-eventdate='{2}''>{3}</div><div class='notify-text-wrap notify-text-time' style='width: 100%'>{4}</div><hr class='style-two'>";
            var htmlTemplateUnRead = "<div class='notify-text-wrap notify-text-bold notify-text-wrap-link' style='width: 100%; cursor: pointer;'  data-caseid='{0}' data-matchid='{1}' data-eventdate='{2}'>{3}</div><div class='notify-text-wrap notify-text-time' style='width: 100%'>{4}</div><hr class='style-two'>";
            for (var i = 0; i < messagesNum; i++)
            {
                var message = results.MessageList[i];
                if (message.IsViewed == true) {
                    messagesHtmlString += htmlTemplateRead.format(message.CaseId, message.MatchId, message.EventDateFormat, message.MessageContent, message.PostedDate);
                }
                else {
                    messagesHtmlString += htmlTemplateUnRead.format(message.CaseId, message.MatchId, message.EventDateFormat, message.MessageContent, message.PostedDate);
                }
            }

            $('#notificationsBody').html(messagesNum > 0 ? messagesHtmlString : "<div class='notify-text-wrap notify-text-nomsg' style='width: 100%'>There is no message.</div>");

            registerViewFraudCaseDetailsEvent();
        },
        error: function () {
        }
    });

    var registerViewFraudCaseDetailsEvent = function () {
        var element = $("#notificationsBody .notify-text-wrap-link");

        element.off("click");
        element.on("click", function (event) {
            event.preventDefault();

            var link = $(this);
            var caseId = link.data("caseid");
            var matchId = link.data("matchid");
            var eventDate = link.data("eventdate");
            var url = SPU.getAbsoluteUrl("FraudCaseDetail/Index") + "?MatchId=" + matchId;
            url += "&CaseId=" + caseId;
            url += "&EventDate=" + eventDate;
            window.open(url, '_blank');
            window.focus();

            $('#notificationContainer').hide();
        });
    };
}

$(document).ready(function () {
    $('#notification-icon').off("click");
    $('#notification-icon').on("click", function (event) {
        $('#noti-unread-msg').hide();
        if (!$('#notificationContainer').is(':visible')) {
            updateStatus = true;
            ReCheckNotification();
            $('#notificationContainer').show();
        }
        else {
            updateStatus = false;
            $('#notificationContainer').hide();
        }
    });

    $(document).mouseup(function (e) {
        if (e.target.id != $("#notificationContainer").attr('id') && !$("#notificationContainer").has(e.target).length && 
            e.target.id != $("#notification-icon").attr('id') && !$("#notification-icon").has(e.target).length) {
            updateStatus = false;
            showNotification = false;
            $("#notificationContainer").hide();
        }
    });

    ReCheckNotification();
    setInterval(ReCheckNotification, 3000);
});
