(function () {
    "use strict";
    
    caseDetailService._caseId = $("#CaseId").val();
    caseDetailService.Search();
    CaseGroupGridService.getCustomerGroupByCase();

    $("#btn_AddNewTask").click(function () {
        window.location.href = "/Task" + "?caseId=" + caseDetailService._caseId;
    });
})();