$(document).ready(function () {
    //$.blockUI();
    initializeTagIt();

    $("#btn_cancelMessage").click(function () {
        window.history.back();
    });

    $("#btn_editMessage").click(function () {
        addMail.submit();
    });

    //$.unblockUI();

    var addMail = $('#editMesssageForm').submit(function (event) {
        event.preventDefault();

        $('#editMesssageForm').validate();

        if ($('#editMesssageForm').valid()) {
            $('#fakeRecipient').val(getTags($("#recipient").tagit("assignedTags")));
            $('#fakeOnlRecipient').val(getTags($("#onlRecipient").tagit("assignedTags")));
            messMasterService.editMessage($(this).serialize());
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