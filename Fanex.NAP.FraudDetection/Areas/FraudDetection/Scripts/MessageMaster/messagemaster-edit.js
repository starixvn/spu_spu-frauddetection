$(document).ready(function () {
    initializeTagIt();

    $("#btn_cancelMessage").click(function () {
        DialogService.closeDialog();
    });

    $("#btn_editMessage").click(function () {
        editMail.submit();
    });

    var editMail = $('#editMesssageForm').submit(function (event) {
        event.preventDefault();

        $('#editMesssageForm').validate();

        if ($('#editMesssageForm').valid()) {
            var content = $('#content');
            var displayContent = $('#displayContent');
            var decodeString = htmlEncode(displayContent.val());
            content.val(decodeString);

            messMasterService.editMessage($(this).serialize());
        }
    });

    var content = $('#content');
    var displayContent = $('#displayContent');
    var encodeString = htmlDecode(content.val());
    displayContent.val(encodeString);
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
            },
            beforeTagRemoved: function (event, ui) {
                var label = ui.tagLabel;
                var usernameArr = $('#fakeRecipientTags').val().split(';');
                var idArr = $('#Recipient').val().split(';');
                var index = $.inArray(label, usernameArr);
                var result = '';

                idArr.splice(index, 1);
                for (var i = 0; i < idArr.length; i++) {
                    if (idArr[i] !== "") {
                        result += idArr[i] + ';'
                    }
                }

                $('#Recipient').val(result);
            }
        });
        initializeTags("RecipientTags");

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
            },
            beforeTagRemoved: function (event, ui) {
                var label = ui.tagLabel;
                var usernameArr = $('#fakeOnlRecipientTags').val().split(';');
                var idArr = $('#OnlineRecipient').val().split(';');
                var index = $.inArray(label, usernameArr);
                var result = '';

                idArr.splice(index, 1);
                for (var i = 0; i < idArr.length; i++) {
                    if (idArr[i] !== "") {
                        result += idArr[i] + ';'
                    }
                }

                $('#OnlineRecipient').val(result);
            }
        });
        initializeTags("OnlRecipientTags");
    });

    $('input[id^="fake"').hide();
}

function initializeTags(parentName) {
    var recips = $("#fake" + parentName).val().split(';');
    recips.forEach(function (recipient) {
        $("#" + parentName).tagit("createTag", recipient);
    });
}

function isValidId(id) {
    var regex = /^\d+$/;
    return regex.test(id);
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