(function () {
    "use strict";

    $("#btn_addNewCase").click(function () {
        caseService.getEmptyCase();
    });

    
    caseService.Search();
})();