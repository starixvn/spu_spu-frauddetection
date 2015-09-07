var suspiciousCustomerReportService = (function ($) {
    "use strict";

    var suspiciousCustomerReportService = {};

    suspiciousCustomerReportService.gridOptions = '';
    suspiciousCustomerReportService._pageIndex = 0;
    suspiciousCustomerReportService._pageSize = 50;

    suspiciousCustomerReportService.customersDetailed = [];

    suspiciousCustomerReportService.searchParams = {
        CustName: '',
        GroupId: -1,
        PageSize: suspiciousCustomerReportService._pageSize,
        PageIndex: suspiciousCustomerReportService._pageIndex + 1
    };

    suspiciousCustomerReportService.querySuspiciousCustomer = function () {
        suspiciousCustomerReportService.customersDetailed = [];
        waitingDialog.show("Please wait...", { dialogSize: 'sm' });
        suspiciousCustomerReportService.searchParams.PageSize = suspiciousCustomerReportService._pageSize;
        suspiciousCustomerReportService.searchParams.PageIndex = suspiciousCustomerReportService._pageIndex + 1;

        suspiciousCustomerReportFactory.getSuspiciousCustomerReport(suspiciousCustomerReportService.searchParams).success(function (result) {
            renderCustomerReportTable(result);

            waitingDialog.hide();
        });
    };

    suspiciousCustomerReportService.getSuspiciousCustomerStatistic = function (custId) {
        if (suspiciousCustomerReportService.customersDetailed.indexOf(custId) === -1) {
            suspiciousCustomerReportFactory.getSuspiciousCustomerStatistic(custId).success(function (result) {
                $('#' + custId).css('color', 'blue');
                $('#' + custId).attr('title', 'tooltip');
                $('#' + custId).tooltip({
                    content: createCusomerWinlossTable(result),
                    position: {
                        my: "left bottom",
                        at: "left top-10"
                    }
                });

                suspiciousCustomerReportService.customersDetailed.push(custId);

                $('#' + custId).mouseout();
                $('#' + custId).mouseover();

                setTimeout(function () { $('#' + custId).mouseout(); }, 3000);
            });
        }
    };

    function createCusomerWinlossTable(customerWinloss) {
        var result = "<table>" +
            "<tr><th>Month</th><th>Turnover</th><th>Win Loss</th><th>Margin</th></tr>";

        for (var i = 0; i < customerWinloss.length; i++) {
            var month = customerWinloss[i].Month;
            var turnover = customerWinloss[i].Turnover !== null ? numeral(customerWinloss[i].Turnover).format(formatConstant.TWO_DECIMAL_NUMBER) : 'N/A';
            var winLoss = customerWinloss[i].MemberWinlost !== null ? numeral(customerWinloss[i].MemberWinlost).format(formatConstant.TWO_DECIMAL_NUMBER) : 'N/A';
            var margin = customerWinloss[i].Margin !== null ? numeral(customerWinloss[i].Margin).format(formatConstant.TWO_DECIMAL_PERCENT_NUMBER) : 'N/A';

            result += "<tr><td>" + month +
                "</td><td>" + turnover +
                "</td><td>" + winLoss +
                "</td><td>" + margin +
                "</td></tr>";
        }

        result += "</table>";

        return result;
    }

    /*
    * Render customer report.
    */
    var renderCustomerReportTable = function (data) {
        var suspiciousCustomers = data.SuspiciousCustomers;
        var months = data.Months;
        var columnHeaders = generateColumnHeaders();
        var bodyRows = generateBodyRows(months, suspiciousCustomers);

        suspiciousCustomerReportService.gridOptions = {
            gridExpandHeight: 180,
            marginRight: 0,
            showTree: true,
            showPager: true,
            customPager: true,
            pagerOption: {
                itemsPerPage: suspiciousCustomerReportService._pageSize,
                currentPage: suspiciousCustomerReportService._pageIndex,
                totalItem: data.TotalItem,
                itemsPerPageArray: [10, 20, 50, 100, 500],
                pagerSelectCallBack: reRenderAfterPaged
            }
        };

        suspiciousCustomerReportService.gridOptions.bodyRows = bodyRows;
        suspiciousCustomerReportService.gridOptions.columns = columnHeaders;

        $("#customerReportId").fanexGrid(suspiciousCustomerReportService.gridOptions);
    };

    /*
    * Re-rendering.
    */
    function reRenderAfterPaged(pageIndex, itemsPerPage) {
        suspiciousCustomerReportService.customersDetailed = [];

        suspiciousCustomerReportService._pageSize = itemsPerPage;
        suspiciousCustomerReportService._pageIndex = pageIndex;
        suspiciousCustomerReportService.gridOptions.pagerOption.currentPage = pageIndex;
        suspiciousCustomerReportService.querySuspiciousCustomer();

        return false;
    }

    /*
    * Create the body for rendering.
    */
    var generateBodyRows = function (months, suspiciousCustomers) {
        var rows = [];

        for (var i = 0; i < suspiciousCustomers.length; i++) {
            var suspiciousCustomer = suspiciousCustomers[i];
            var currentRow = {
                Columns: [
                        { Name: "Row", Value: suspiciousCustomer.Row },
                        { Name: "Member", Value: suspiciousCustomer.Customer.CustName },
                        { Name: "Group", Value: suspiciousCustomer.Group.GroupName },
                        { Name: "SuspiciousTime", Value: suspiciousCustomer.SuspiciousTime },
                        { Name: "WinlossDetail", Value: suspiciousCustomer.Customer, CustomCellRender: statisticColumn }
                    ]
            };

            rows.push(currentRow);
        }

        return rows;
    };

    /*
    * Create the header for rendering.
    */
    var generateColumnHeaders = function () {
        var columnHeaders = [
            { HeaderText: "#", Width: 70, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "Member", Width: 150, Name: "Member", HeaderAlign: "center", CellAlign: "left" },
            { HeaderText: "Group", Width: 300, Name: "Group", HeaderAlign: "center", CellAlign: "left" },
            { HeaderText: "Suspicious Time", Width: 70, Name: "SuspiciousTime", HeaderAlign: "center", CellAlign: "right" },
            { HeaderText: "Winloss Detail", Width: 80, Name: "WinlossDetail", HeaderAlign: "center", CellAlign: "center" }
        ];

        return columnHeaders;
    };

    /*
    * Format.
    */
    var formatConstant = {
        INT_NUMBER: '0,0',
        TWO_DECIMAL_NUMBER: '-0,0.00',
        FOUR_DECIMAL_NUMBER: '0,0.0000',
        TWO_DECIMAL_PERCENT_NUMBER: '0,0.00%',
        MMM_DD_YYYY_STRING: 'MMM DD, YYYY',
        M_DD_YY_STRING: 'M dd, yy',
        MM_DD_YYYY_WITH_SLASH_STRING: 'MM/dd/yyyy',
        MMM_YY_STRING: 'MMM YY',
        MMM_YY_STRING_MONTH_PICKER: 'MMM yyyy',
        MMM_DD_YY_STRING_MONTH_PICKER: 'MMM dd, yyyy',
        MM_DD_YYYY_WITH_SLASH_STRING_MOMENT: 'M/D/YYYY',
        MMM_DD_YYYY_STRING_MOMENT: 'MMM D, YYYY',
        MMM_DD_YYYY_H_M_STRING: 'MMM DD, YYYY HH:mm'
    };

    function statisticColumn(cell) {
        return "<span id='" + cell.Value.CustId + "' class='glyphicon glyphicon-stats' title='Click to show Winloss Detail'" +
            "onclick='suspiciousCustomerReportService.getSuspiciousCustomerStatistic(" + cell.Value.CustId + ");' " +
            "style='cursor: pointer'>";
    }

    return suspiciousCustomerReportService;
})(jQuery);