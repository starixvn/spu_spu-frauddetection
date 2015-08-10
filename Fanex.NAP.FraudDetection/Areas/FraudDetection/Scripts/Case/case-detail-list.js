(function () {
    "use strict";
    
    caseDetailService._caseId = $("#CaseId").val();
    caseDetailService.Search();

    $("#btn_AddNewTask").click(function () {
        var url = "/Task" + "?caseId=" + caseDetailService._caseId;
        window.location.href = window.location.href.split('/Case', 1)[0].toString() + url;
    });
})();