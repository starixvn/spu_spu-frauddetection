(function () {
    "use strict";

    $("#btn_addNewCase").click(function () {
        caseService.getEmptyCase();
    });

    caseService.isHostPermission = isHost;
    caseService.isTest = isTest;

    caseService.Search();
})();