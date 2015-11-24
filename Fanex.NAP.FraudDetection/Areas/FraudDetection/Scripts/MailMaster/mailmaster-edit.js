$(document).ready(function () {
    tinyMCE.init({
        document_base_url: window.location.href.split('/MailMaster', 1)[0].toString(),
        relative_urls: false,
        remove_script_host: false,
        mode: "specific_textareas",
        editor_selector: "editor",
        height: "350",
        content_css: "Content/Common/tinymce.css",
        theme: "modern",
        plugins: [
            "advlist autolink lists link image charmap print preview hr anchor pagebreak",
            "searchreplace wordcount visualblocks visualchars code fullscreen",
            "insertdatetime media nonbreaking save table contextmenu directionality",
            "emoticons template paste textcolor colorpicker textpattern"
        ],
        toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
        toolbar2: "print preview media | forecolor backcolor emoticons | fontselect fontsizeselect",
        image_advtab: true
    });

    initializeTagIt();

    $("#btn_cancelMail").click(function () {
        window.history.back();
    });

    $("#btn_editMail").click(function () {
        addMail.submit();
    });

    var addMail = $('#editMailForm').submit(function (event) {
        event.preventDefault();

        $('#editMailForm').validate();

        $('#editor').text(tinyMCE.activeEditor.getContent());

        if ($('#editMailForm').valid()) {
            $('#FakeTo').val(getTags($("#To").tagit("assignedTags")));
            $('#FakeCcTo').val(getTags($("#CcTo").tagit("assignedTags")));
            $('#FakeBccTo').val(getTags($("#BccTo").tagit("assignedTags")));
            mailMasterService.editMail($(this).serialize());
        }
    });
});

function insertSuspiciousStatistic(name) {
    var data = '&lt;placeholder&gt;' + name + '&lt;/placeholder&gt;';
    tinyMCE.execCommand('mceInsertContent', false, data);
}

function initializeTagIt() {

    $('#To').tagit({
        beforeTagAdded: function (event, ui) {
            return isEmail(ui.tagLabel);
        }
    });
    initializeMailTags("To");

    $('#CcTo').tagit({
        beforeTagAdded: function (event, ui) {
            return isEmail(ui.tagLabel);
        }
    });
    initializeMailTags("CcTo");

    $('#BccTo').tagit({
        beforeTagAdded: function (event, ui) {
            return isEmail(ui.tagLabel);
        }
    });
    initializeMailTags("BccTo");

    $('input[id^="Fake"').hide();
}

function initializeMailTags(parentName) {
    var emails = $("#Fake" + parentName).val().split(';');
    emails.forEach(function (email) {
        $("#" + parentName).tagit("createTag", email);
    });
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function getTags(tags) {
    var tagsString = "";
    for (var i in tags)
        tagsString += tags[i] + ";";

    return tagsString.slice(0, -1); ;
}