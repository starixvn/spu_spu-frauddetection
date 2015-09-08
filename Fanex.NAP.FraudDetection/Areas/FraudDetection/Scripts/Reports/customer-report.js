(function () {
    "use strict";

    $(document).mouseup(function (e) {
        var container = $(".ui-tooltip");
        if (!container.is(e.target) &&
            container.has(e.target).length === 0) {
            for (var i = 0; i < suspiciousCustomerReportService.customersDetailed.length; i++) {
                var custId = suspiciousCustomerReportService.customersDetailed[i];

                $('#' + custId).tooltip('option', { disabled: true }).tooltip('close');
                $('#' + custId).css('color', 'black');
            }
        }
    });

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