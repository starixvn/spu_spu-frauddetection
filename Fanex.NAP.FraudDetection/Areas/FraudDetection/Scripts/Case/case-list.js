(function () {
    "use strict";

    debugger;

    $("#btn_addNewCase").click(function () {
        caseService.getEmptyCase();
    });

    
    caseService.Search();
})();