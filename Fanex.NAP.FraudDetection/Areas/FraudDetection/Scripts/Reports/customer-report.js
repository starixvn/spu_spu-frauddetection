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

    $("#btnExportExcel").click(function (event) {
        event.preventDefault();

        waitingDialog.show("Please wait...", { dialogSize: 'sm' });
        var param = {
            "CustName": $("#memberName").val(),
            "GroupId": $("#groupId").val(),
            "groupName": $("#groupId option:selected").text(),
            "PageIndex": 1
        };

        FraudDetectionScripts.downloadFile("SuspiciousCustomer/ExportExcel", param);
        waitingDialog.hide();
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