$(document).ready(function () {
    //$.blockUI();
    initializeTagIt();

    $("#btn_cancelMessage").click(function () {
        window.history.back();
    });

    $("#btn_editMessage").click(function () {
        editMail.submit();
    });

    //$.unblockUI();

    var editMail = $('#editMesssageForm').submit(function (event) {
        event.preventDefault();

        $('#editMesssageForm').validate();

        if ($('#editMesssageForm').valid()) {
            $('#fakeRecipient').val(getTags($("#recipient").tagit("assignedTags")));
            $('#fakeOnlRecipient').val(getTags($("#onlRecipient").tagit("assignedTags")));
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
    var content = $('#content');
    content.val(content.val() + txt);
    content.focus();

}

function initializeTagIt() {

    $('#Recipient').tagit({
        beforeTagAdded: function (event, ui) {
            return isEmail(ui.tagLabel);
        }
    });
    initializeMailTags("Recipient");

    $('#OnlRecipient').tagit({
        beforeTagAdded: function (event, ui) {
            return isEmail(ui.tagLabel);
        }
    });
    initializeMailTags("OnlRecipient");

    $('input[id^="fake"').hide();
}

function initializeMailTags(parentName) {
    var recips = $("#fake" + parentName).val().split(';');
    recips.forEach(function (recipient) {
        $("#" + parentName).tagit("createTag", recipient);
    });
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