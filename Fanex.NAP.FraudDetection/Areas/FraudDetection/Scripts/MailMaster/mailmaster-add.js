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

    $("#btn_cancelMail").click(function () {
        window.history.back();
    });

    $("#btn_addMail").click(function () {
        addMail.submit();
    });

    var addMail = $('#addNewMailForm').submit(function (event) {
        event.preventDefault();

        $('#addNewMailForm').validate();

        $('#editor').text(tinyMCE.activeEditor.getContent());

        if ($('#addNewMailForm').valid()) {
            mailMasterService.addMail($(this).serialize());
        }
    });
});

function insertSuspiciousStatistic(name) {
    var data = '&lt;placeholder&gt;' + name + '&lt;/placeholder&gt;';
    tinyMCE.execCommand('mceInsertContent', false, data);
}