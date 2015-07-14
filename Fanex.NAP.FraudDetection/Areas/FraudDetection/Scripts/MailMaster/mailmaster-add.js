$(document).ready(function () {
    tinyMCE.init({
        mode: "specific_textareas",
        editor_selector: "editor",
        height: "350",
        content_css: "/Content/tinymce/tinymce.css",
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
        window.location.href = '/MailMaster';
    });

    $("#btn_addMail").click(function () {
        addMail.submit();
    });

    var addMail = $('#addNewMailForm').submit(function (event) {
        event.preventDefault();

        $('#addNewMailForm').validate();

        $('#editor').text(tinyMCE.activeEditor.getContent());

        if ($('#addNewMailForm').valid()) {
            $.post(this.action, $(this).serialize(), function (result) {
                if (result.IsSuccessful) {
                    window.location.href = '/MailMaster';
                } else {
                    AlertService.showAlert(result);
                }
            });
        }
    });
});

function insertSuspiciousStatistic(name) {
    var data = '&lt;placeholder&gt;' + name + '&lt;/placeholder&gt;';
    tinyMCE.execCommand('mceInsertContent', false, data);
}