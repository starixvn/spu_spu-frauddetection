(function () {
    "use strict";

    var formSearch = $('#formSearch').submit(function (event) {
        event.preventDefault();

        var memberName = $("#memberName").val();
        var groupId = $("#groupId").val();

        suspiciousCustomerReportService.querySuspiciousCustomer(memberName, groupId);
    });

    formSearch.submit();

})();