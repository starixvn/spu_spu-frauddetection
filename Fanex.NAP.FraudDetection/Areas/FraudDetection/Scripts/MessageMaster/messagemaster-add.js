$(document).ready(function () {
    initializeTagIt();

    $("#btn_cancelMessage").click(function () {
        DialogService.closeDialog();
    });

    $("#btn_addMessage").click(function () {
        addMail.submit();
    });

    var addMail = $('#addNewMesssageForm').submit(function (event) {
        event.preventDefault();


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

var tempData;
function initializeTagIt() {
    var tempId = null;
    var tempDisplayText = '';
    messMasterFactory.getAllUser().success(function (result) {
        $('#RecipientTags').tagit({
            autocomplete: {
                delay: 350,
                appendTo: this,
                source: function (request, response) {
                    response($.map(result, function (value, key) {
                        return {
                            label: value.Username,
                            value: value.Id
                        }
                    }));
                    });
                    response(tempData);
                },
                select: function (event, ui) {
                    event.preventDefault();
                    tempDisplayText = $('#Recipient').val();
                    tempId = ui.item.value;
                    event.target.value = ui.item.label;
                },
                focus: function (event, ui) {
                    return false;
                },
                search: function (event, ui) {
                    var keyword = $(event.target).val();
                    var newSource = [];

                    if (tempData) {
                        $(tempData).each(function (index, element) {
                            if (element.label.indexOf(keyword) != -1) {
                                newSource.push(element);
                            }
                        });

                        $(this).autocomplete('option', 'source', newSource);
                    }
                }
            },
            //beforeTagAdded: function(evt, ui) {
            //    var $tagdropdowns = $('body ul:last li a');
            //    var $activeTag = $tagdropdowns.filter(function() { 
            //        return $(this).hasClass('ui-state-focus') 
            //    });
            //    $tagdropdowns.removeClass('ui-state-focus');

            //    if ($activeTag.length) {
            //        $(this).tagit("createTag", $activeTag.text());
            //        return false;
            //    }

            //},
            afterTagAdded: function () {
                debugger    
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

        $('#OnlRecipientTags').tagit({
            autocomplete: {
                delay: 350,
                appendTo: $('#popup'),
                source: function (request, response) {
                    response($.map(result, function (value, key) {
                        return {
                            label: value.Username,
                            value: value.Id
                        }
                    }));
                    });
                    response(tempData);
                },
                select: function (event, ui) {
                    event.preventDefault();
                    tempDisplayText = $('#OnlineRecipient').val();
                    tempId = ui.item.value;
                    event.target.value = ui.item.label;
                },
                focus: function (event, ui) {
                    return false;
                },
                search: function (event, ui) {
                    var keyword = $(event.target).val();
                    var newSource = [];

                    if (tempData) {
                        $(tempData).each(function (index, element) {
                            if (element.label.indexOf(keyword) != -1) {
                                newSource.push(element);
                            }
                        });

                        $(this).autocomplete('option', 'source', newSource);
                    }
                }
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