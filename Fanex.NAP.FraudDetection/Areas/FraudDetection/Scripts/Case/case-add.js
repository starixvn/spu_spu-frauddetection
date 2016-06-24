(function () {
    "use strict";

    $("#btn_addCase").click(function (event) {
        event.preventDefault();

        var fraudCase = {
            "CaseName": $("#CaseModel_CaseName").val(),
            "CaseDesc": $("#CaseModel_CaseDesc").val(),
            "IsActive": $('#CaseModel_IsActive').is(':checked'),
            "IsInternal": $('#CaseModel_IsInternal').is(':checked'),
            "TypeId": parseInt($("#CaseModel_TypeId").val())
        };

        caseService.addCase(fraudCase);
    });

    $("#btn_Cancel").click(function () {
        DialogService.closeDialog();
    });

    $("form").submit(function () {
        return false;
    });
})();