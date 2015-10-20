(function () {
    "use strict";

    $("#btn_addNewCase").click(function () {
        caseService.getEmptyCase();
    });

    caseService.isHostPermission = isHost;
    caseService.Search();
})();