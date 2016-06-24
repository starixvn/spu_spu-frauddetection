(function () {
    $("#btn_editCase").click(function (event) {
        event.preventDefault();

        var fraudCase = {
            "CaseId": $("#CaseModel_CaseId").val(),
            "CaseName": $("#CaseModel_CaseName").val(),
            "CaseDesc": $("#CaseModel_CaseDesc").val(),
            "IsActive": $('#CaseModel_IsActive').is(':checked'),
            "IsInternal": $('#CaseModel_IsInternal').is(':checked'),
            "TypeId": parseInt($("#CaseModel_TypeId").val())
        };

        caseService.editCase(fraudCase);
    });

    $("#btn_Cancel").click(function () {
        DialogService.closeDialog();
    });

    $("form").submit(function () {
        return false;
    });
})();