(function () {
    $("#btn_editCase").click(function (event) {
        event.preventDefault();

        var fraudCase = {
            "CaseId": $("#CaseId").val(),
            "CaseName": $("#CaseName").val(),
            "CaseDesc": $("#CaseDesc").val(),
            "IsActive": $('#IsActive').is(':checked')
        };

        caseService.editCase(fraudCase);
    });

    $("#btn_Cancel").click(function () {
        DialogService.closeDialog();
    });
})();