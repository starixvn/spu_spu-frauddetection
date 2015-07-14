$(document).ready(function () {
    $("#btn_editGroup").click(function () {
        editGroup.submit();
    });

    $("#btn_Cancel").click(function () {
        $("div#popup").dialog("destroy").remove();
    });

    var editGroup = $('#EditGroupForm').submit(function (event) {
        event.preventDefault();

        $.post(this.action, $(this).serialize(), function (response) {
            if (response.IsSuccessful) {
                setTimeout(function () {
                    DialogService.closeDialog();
                }, 3000);

                formSearch.submit();
            }

            AlertServiceOnPopup.showAlert(response);
        });
    });
});