(function () {
    "use strict";

    $("#btn_addCase").click(function (event) {
        event.preventDefault();

        var fraudCase = {
            "CaseName": $("#CaseName").val(),
            "CaseDesc": $("#CaseDesc").val(),
            "IsActive": $('#IsActive').is(':checked')
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