$(document).ready(function () {
    $("#btn_addCase").click(function () {
        addCaseForm.submit();
    });

    $("#btn_Cancel").click(function () {
        $("div#popup").dialog("destroy").remove();
    });

    var addCaseForm = $("#AddCaseForm").submit(function (event) {
        event.preventDefault();

        var url = 'Case/AddNewCase';
        var param = {
            "CaseName": $("#CaseName").val(),
            "CaseDesc": $("#CaseDesc").val(),
            "IsActive": $('#IsActive').is(':checked')
        };
        $.ajax({
            type: "POST",
            contentType: 'application/json',
            dataType: "json",
            data: JSON.stringify(param),
            cache: false,
            url: url,
            error: function () {
            },
            success: function (response) {
                if (response.IsSuccessful) {
                    setTimeout(function () {
                        DialogService.closeDialog();
                    }, 3000);
                }

                AlertService.setAlertId('sentAlertOnPopup');
                AlertService.showAlert(response);
            },
            beforeSend: function () {

            },
            complete: function () {
            }
        });
    });
});