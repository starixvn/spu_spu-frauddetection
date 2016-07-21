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

var tempData;
function initializeTagIt() {
    var tempId = null;
    var tempDisplayText = '';
    var userList = [];

    messMasterFactory.getAllUser().success(function (result) {
        userList = result;
    });

    $('#RecipientTags').tagit({
        autocomplete: {
            delay: 350,
            appendTo: $('#popup').parent().parent(),
            open: function () {
                var indexValue = $('#popup').parent().css("z-index");
                $('.tagit-autocomplete').css("z-index", indexValue + 1);
            },
            focus: function (event, ui) {
                event.target.value = ui.item.label;
                tempId = ui.item.value;
                return false;
            },
            search: function (event, ui) {
                var keyword = $(event.target).val();
                var newSource = [];

                if (!tempData) {
                    tempData = $.map(userList, function (value, key) {
                        return {
                            label: value.Username,
                            value: value.Id
                        }
                    });

                    $(tempData).each(function (index, element) {
                        if (element.label.indexOf(keyword) != -1 ||
                            element.label.toUpperCase().indexOf(keyword.toUpperCase()) != -1) {
                            newSource.push(element);
                        }
                    });
                }
                else {
                    $(tempData).each(function (index, element) {
                        if (element.label.indexOf(keyword) != -1 ||
                            element.label.toUpperCase().indexOf(keyword.toUpperCase()) != -1) {
                            newSource.push(element);
                        }
                    });
                }

                $(this).autocomplete('option', 'source', newSource);
                if (newSource.length === 1) {
                    $(".ui-autocomplete-input").autocomplete("option", "autoFocus", true);
                }
            },
            select: function (event, ui) {
                event.preventDefault();
                $('#RecipientTags').tagit('createTag', ui.item.label);
            },
            close: function (event, ui) {
                $(".ui-autocomplete-input").autocomplete("option", "autoFocus", false);
            }
        },
        afterTagAdded: function () {
            if (tempId !== null) {
                tempDisplayText = $('#Recipient').val();
                tempDisplayText += tempId + ";";
                $('#Recipient').val(tempDisplayText);
                tempId = null;
            }
        },
        beforeTagRemoved: function (event, ui) {
            var label = ui.tagLabel;
            var usernameArr = getTags($("#RecipientTags").tagit("assignedTags")).split(';');
            var idArr = $('#Recipient').val().split(';');
            var index = $.inArray(label, usernameArr);
            var userIdList = '';

            if (index !== -1) {
                idArr.splice(index, 1);
                for (var i = 0; i < idArr.length; i++) {
                    if (idArr[i] !== "") {
                        userIdList += idArr[i] + ';'
                    }
                }
            }

            $('#Recipient').val(userIdList);
        }
    });
    initializeTags("RecipientTags");

    $('#OnlRecipientTags').tagit({
        autocomplete: {
            delay: 350,
            select: function (event, ui) {
                event.preventDefault();
                $('#OnlRecipientTags').tagit('createTag', ui.item.label);
            },
            appendTo: $('#popup').parent().parent(),
            open: function () {
                var indexValue = $('#popup').parent().css("z-index");
                $('.tagit-autocomplete').css("z-index", indexValue + 1);
            },
            focus: function (event, ui) {
                event.target.value = ui.item.label;
                tempId = ui.item.value;
                return false;
            },
            search: function (event, ui) {
                var keyword = $(event.target).val();
                var newSource = [];

                if (!tempData) {
                    tempData = $.map(userList, function (value, key) {
                        return {
                            label: value.Username,
                            value: value.Id
                        }
                    });

                    $(tempData).each(function (index, element) {
                        if (element.label.indexOf(keyword) != -1) {
                            newSource.push(element);
                        }
                    });
                }
                else {
                    $(tempData).each(function (index, element) {
                        if (element.label.indexOf(keyword) != -1) {
                            newSource.push(element);
                        }
                    });
                }

                $(this).autocomplete('option', 'source', newSource);
                if (newSource.length === 1) {
                    $(".ui-autocomplete-input").autocomplete("option", "autoFocus", true);
                }
            },
            close: function (event, ui) {
                $(".ui-autocomplete-input").autocomplete("option", "autoFocus", false);
            }
        },
        afterTagAdded: function () {
            if (tempId !== null) {
                tempDisplayText = $('#OnlineRecipient').val();
                tempDisplayText += tempId + ";";
                $('#OnlineRecipient').val(tempDisplayText);
                tempId = null;
            }
        },
        beforeTagRemoved: function (event, ui) {
            var label = ui.tagLabel;
            var usernameArr = getTags($("#OnlRecipientTags").tagit("assignedTags")).split(';');
            var idArr = $('#OnlineRecipient').val().split(';');
            var index = $.inArray(label, usernameArr);
            var userIdList = '';

            idArr.splice(index, 1);
            for (var i = 0; i < idArr.length; i++) {
                if (idArr[i] !== "") {
                    userIdList += idArr[i] + ';'
                }
            }

            $('#OnlineRecipient').val(userIdList);
        }
    });
    initializeTags("OnlRecipientTags");

    $('.ui-dialog-title').mousedown(function () {
        $('.tagit-autocomplete').hide();
    });

    $('input[id^="fake"').hide();
}

function initializeTags(parentName) {
    var recips = $("#fake" + parentName).val().split(';');
    recips.forEach(function (recipient) {
        $("#" + parentName).tagit("createTag", recipient);
    });
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