(function () {
    "use strict";

    var formSearch = $('#formSearch').submit(function (event) {
        event.preventDefault();

        suspiciousCustomerReportService.searchParams.CustName = $("#memberName").val();
        suspiciousCustomerReportService.searchParams.GroupId = $("#groupId").val();
        suspiciousCustomerReportService._pageIndex = 0;
        suspiciousCustomerReportService._pageSize = 50;

        suspiciousCustomerReportService.querySuspiciousCustomer();
    });

    formSearch.submit();

})();