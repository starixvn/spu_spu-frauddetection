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
            $('#fakeRecipient').val(getTags($("#recipient").tagit("assignedTags")));
            $('#fakeOnlRecipient').val(getTags($("#onlRecipient").tagit("assignedTags")));
            messMasterService.addMessage($(this).serialize());
        }
    });
});

function insertParameters(name) {
    var data = '&lt;placeholder&gt;' + name + '&lt;/placeholder&gt;';
    //var data = '<' + name + '>';
    $('#content').append(data);
}

function initializeTagIt() {

    $('#recipient').tagit({
        beforeTagAdded: function (event, ui) {
            return isEmail(ui.tagLabel);
        }
    });

    $('#onlRecipient').tagit({
        beforeTagAdded: function (event, ui) {
            return isEmail(ui.tagLabel);
        }
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