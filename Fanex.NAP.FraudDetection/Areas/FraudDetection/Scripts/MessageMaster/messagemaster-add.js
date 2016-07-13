$(document).ready(function () {
    //$.blockUI();
    initializeTagIt();

    $("#btn_cancelMessage").click(function () {
        window.history.back();
    });

    $("#btn_addMessage").click(function () {
        addMail.submit();
    });

    //$.unblockUI();

    var addMail = $('#addNewMesssageForm').submit(function (event) {
        event.preventDefault();

        $('#addNewMesssageForm').validate();

        if ($('#addNewMesssageForm').valid()) {
            var content = $('#content');
            var displayContent = $('#displayContent');
            var decodeString = htmlEncode(displayContent.val());
            content.val(decodeString);

            messMasterService.addMessage($(this).serialize());
        }
    });
});

function insertParameters(name) {
    var txt = '<placeholder>' + name + '</placeholder>';
    var displayContent = $('#displayContent');

    displayContent.val(displayContent.val() + txt);
    displayContent.focus();
}

function initializeTagIt() {
    var tempId = null;
    var tempDisplayText = '';
    messMasterFactory.getAllUser().success(function (result) {
        $('#RecipientTags').tagit({
            autocomplete: {
                source: function (request, response) {
                    response($.map(result, function (value, key) {
                        return {
                            label: value.Username,
                            value: value.Id
                        }
                    }));
                },
                select: function (event, ui) {
                    tempDisplayText = $('#Recipient').val();
                    tempId = ui.item.value;
                    ui.item.value = ui.item.label;
                },
                focus: function (event, ui) {
                    return false;
                },
            },
            afterTagAdded: function () {
                if (tempId !== null) {
                    tempDisplayText += tempId + ";";
                    $('#Recipient').val(tempDisplayText);
                }
            }
        });

        $('#OnlRecipientTags').tagit({
            autocomplete: {
                source: function (request, response) {
                    response($.map(result, function (value, key) {
                        return {
                            label: value.Username,
                            value: value.Id
                        }
                    }));
                },
                select: function (event, ui) {
                    tempDisplayText = $('#OnlineRecipient').val();
                    tempId = ui.item.value;
                    ui.item.value = ui.item.label;
                },
                focus: function (event, ui) {
                    return false;
                },
            },
            afterTagAdded: function () {
                if (tempId !== null) {
                    tempDisplayText += tempId + ";";
                    $('#OnlineRecipient').val(tempDisplayText);
                }
            }
        });
    });

    $('input[id^="fake"').hide();
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    //return regex.test(email);
    return true;
}

function getTags(tags) {
    var tagsString = "";
    for (var i in tags)
        tagsString += tags[i] + ";";

    return tagsString.slice(0, -1);;
}

function htmlEncode(value) {
    return $('<div/>').text(value).html();
}

function htmlDecode(value) {
    return $('<div/>').html(value).text();
}