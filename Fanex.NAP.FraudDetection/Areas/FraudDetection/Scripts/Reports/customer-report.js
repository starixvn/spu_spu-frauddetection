$(function () {
    "use strict";

    /*
    * Search form.
    */
    var formSearch = $('#formSearch').submit(function (event) {
        event.preventDefault();

        var memberName = $("#memberName").val();
        var groupId = $("#groupId").val();

        $.get(this.action, { memberName: memberName, groupId: groupId }, function (suspiciousCustomers) {
            renderCustomerReportTable(suspiciousCustomers);
        });
    });

    formSearch.submit();

    /*
    * Render customer report.
    */
    var renderCustomerReportTable = function (suspiciousCustomers) {
        var columnHeaders = generateColumnHeaders();
        var customHeader = generateCustomColumnHeaders();
        var bodyRows = generateBodyRows(suspiciousCustomers);
        var gridOptions = {
            customizeHeader: true,
            groupHeaderRows: customHeader,
            columns: columnHeaders,
            bodyRows: bodyRows,
            gridExpandHeight: 150,
            showTree: true,
            showPager: true,
            showColumnsShowHide: false,
            pagerOption:
            {
                itemsPerPage: 10,
                currentPage: 0,
                itemsPerPageArray: [10, 20, 50, 100, 500]
            }
        };

        $("#customerReportId").fanexGrid(gridOptions);
    };

    /*
    * Create the body for rendering.
    */
    var generateBodyRows = function (suspiciousCustomers) {
        debugger;
        var rows = [];
        var month1 = "Jun";
        var month2 = "Jun1";
        var month3 = "Jun2";

        for (var i = 0; i < suspiciousCustomers.length; i++) {
            var suspiciousCustomer = suspiciousCustomers[i];

            var currentRow = {
                Columns: [
                        { Name: "Row", Value: i + 1 },
                        { Name: "Member", Value: suspiciousCustomer.Customer.CustName },
                        { Name: "Group", Value: suspiciousCustomer.Group.GroupName },
                        { Name: "SuspiciousTime", Value: suspiciousCustomer.SuspiciousTime },
                        { Name: month1, Value: suspiciousCustomer.Margins[0] !== 'undefined' ? suspiciousCustomer.Margins[0] : "N/A" },
                        { Name: month2, Value: suspiciousCustomer.Margins[1] !== 'undefined' ? suspiciousCustomer.Margins[1] : "N/A" },
                        { Name: month3, Value: suspiciousCustomer.Margins[2] !== 'undefined' ? suspiciousCustomer.Margins[2] : "N/A" },
                        { Name: month1, Value: suspiciousCustomer.WinLoss[0] !== 'undefined' ? suspiciousCustomer.WinLoss[0] : "N/A" },
                        { Name: month2, Value: suspiciousCustomer.WinLoss[1] !== 'undefined' ? suspiciousCustomer.WinLoss[1] : "N/A" },
                        { Name: month3, Value: suspiciousCustomer.WinLoss[2] !== 'undefined' ? suspiciousCustomer.WinLoss[2] : "N/A" }
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
        var month1 = "Jun";
        var month2 = "Jun1";
        var month3 = "Jun2";
        var columnHeaders = [
            { HeaderText: "#", Width: 50, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "Member", Width: 150, Name: "Member", HeaderAlign: "center", CellAlign: "left" },
            { HeaderText: "Group", Width: 300, Name: "Group", HeaderAlign: "center", CellAlign: "left" },
            { HeaderText: "Suspicious Time", Width: 150, Name: "SuspiciousTime", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: month1, Width: 115, Name: month1, HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: month2, Width: 115, Name: month2, HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: month3, Width: 115, Name: month3, HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: month1, Width: 60, Name: month1, HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: month2, Width: 60, Name: month2, HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: month3, Width: 60, Name: month3, HeaderAlign: "center", CellAlign: "center" }
        ];

        return columnHeaders;
    };

    /*
    * Create the custom header for rendering.
    */
    var generateCustomColumnHeaders = function () {
        var customColumnHeaders = [
            {
                Columns: [
                    { HeaderText: "#", Name: "Row", HeaderAlign: "center", MergeRowNumber: 2 },
                    { HeaderText: "Member", Name: "Member", HeaderAlign: "center", MergeRowNumber: 2 },
                    { HeaderText: "Group", Name: "Group", HeaderAlign: "center", MergeRowNumber: 2 },
                    { HeaderText: "Suspicious Time", Name: "SuspiciousTime", HeaderAlign: "center", MergeRowNumber: 2 },
                    { HeaderText: "Win Loss", Name: "Jun", HeaderAlign: "center", MergeColNumber: 3 },
                    { HeaderText: "Margin %", Name: "Jun", HeaderAlign: "center", MergeColNumber: 3 }
                ]
            }
        ];

        return customColumnHeaders;
    };
});