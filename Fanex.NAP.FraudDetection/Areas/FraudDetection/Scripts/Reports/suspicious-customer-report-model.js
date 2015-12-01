'use strict';
/*global suspiciousCustomerReportModule*/

suspiciousCustomerReportModule.factory('suspiciousCustomerReportModel',
['suspiciousCustomerReportFactory',
function (suspiciousCustomerReportFactory) {
    var suspiciousCustomerReportModel = {};

    suspiciousCustomerReportModel.SuspiciousCustomers = [];

    suspiciousCustomerReportModel.EventDateFilters = [
        { Id: 1, Name: "Today" },
        { Id: 2, Name: "Yesterday" },
        { Id: 3, Name: "Current Week" },
        { Id: 4, Name: "Last Week" },
        { Id: 5, Name: "Current Month" },
        { Id: 6, Name: "Last Month" },
        { Id: 7, Name: "Since Last Month" },
        { Id: 8, Name: "Last 3 Months" },
        { Id: 9, Name: "Last 6 Months" },
        { Id: 10, Name: "Specific Date" }
    ];

    suspiciousCustomerReportModel.DelinquentStatuses = [
        { Id: 1, Name: "All" },
        { Id: 2, Name: "Delinquent" },
        { Id: 3, Name: "Not Delinquent" }
    ];

    suspiciousCustomerReportModel.getSuspiciousCustomerReport = function (criteria) {
        return suspiciousCustomerReportFactory.getSuspiciousCustomerReport(criteria).success(function (customers) {
            suspiciousCustomerReportModel.SuspiciousCustomers = customers;
        });
    };

    suspiciousCustomerReportModel.changeEventDate = function (eventDateId, filter) {
        var today = new Date();
        var fistDayOfWeek = today.getDate() - today.getDay() + 1;
        var startDate = today, endDate = today;

        switch (eventDateId) {
            case 1:
                filter.EventDateFrom = suspiciousCustomerReportModel.formatDate(startDate);
                filter.EventDateTo = suspiciousCustomerReportModel.formatDate(endDate);
                break;
            case 2:
                var yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

                filter.EventDateFrom = suspiciousCustomerReportModel.formatDate(yesterday);
                filter.EventDateTo = suspiciousCustomerReportModel.formatDate(yesterday);
                break;
            case 3:
                startDate = new Date(today.getFullYear(), today.getMonth(), fistDayOfWeek);
                endDate = new Date(today.getFullYear(), today.getMonth(), fistDayOfWeek + 6);

                filter.EventDateFrom = suspiciousCustomerReportModel.formatDate(startDate);
                filter.EventDateTo = suspiciousCustomerReportModel.formatDate(endDate);
                break;
            case 4:
                startDate = new Date(today.getFullYear(), today.getMonth(), fistDayOfWeek - 7);
                endDate = new Date(today.getFullYear(), today.getMonth(), fistDayOfWeek - 1);

                filter.EventDateFrom = suspiciousCustomerReportModel.formatDate(startDate);
                filter.EventDateTo = suspiciousCustomerReportModel.formatDate(endDate);
                break;
            case 5:
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

                filter.EventDateFrom = suspiciousCustomerReportModel.formatDate(startDate);
                filter.EventDateTo = suspiciousCustomerReportModel.formatDate(endDate);
                break;
            case 6:
                startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                endDate = new Date(today.getFullYear(), today.getMonth(), 0);

                filter.EventDateFrom = suspiciousCustomerReportModel.formatDate(startDate);
                filter.EventDateTo = suspiciousCustomerReportModel.formatDate(endDate);
                break;
            case 7:
                startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                endDate = today;

                filter.EventDateFrom = suspiciousCustomerReportModel.formatDate(startDate);
                filter.EventDateTo = suspiciousCustomerReportModel.formatDate(endDate);
                break;
            case 8:
                startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
                endDate = today;

                filter.EventDateFrom = suspiciousCustomerReportModel.formatDate(startDate);
                filter.EventDateTo = suspiciousCustomerReportModel.formatDate(endDate);
                break;
            case 9:
                startDate = new Date(today.getFullYear(), today.getMonth() - 5, 1);
                endDate = today;

                filter.EventDateFrom = suspiciousCustomerReportModel.formatDate(startDate);
                filter.EventDateTo = suspiciousCustomerReportModel.formatDate(endDate);
                break;
            case 10:
                break;
            default:
                break;
        }
    };

    suspiciousCustomerReportModel.initialDateTimePicker = function () {
        var today = new Date();

        $('#eventDateFrom').datepicker({
            dateFormat: "mm/dd/yy"
        });
        $('#eventDateTo').datepicker({
            dateFormat: "mm/dd/yy"
        });

        $('#eventDateFrom').datepicker("setDate", today);
        $('#eventDateTo').datepicker("setDate", today);
    };

    suspiciousCustomerReportModel.openCalendar = function (dateTimePickerId) {
        $(dateTimePickerId).datepicker('show');
    };

    suspiciousCustomerReportModel.formatDate = function (date) {
        var d = date.getDate();
        var m = date.getMonth() + 1;
        var y = date.getFullYear();
        var result = '' + (m <= 9 ? '0' + m : m) + '/' + (d <= 9 ? '0' + d : d) + '/' + y;

        return result;
    };

    /*
    * Render customer report.
    */
    suspiciousCustomerReportModel.renderCustomerReportTable = function (data) {
        //        var suspiciousCustomers = data.SuspiciousCustomers;
        //        var columnHeaders = generateColumnHeaders();
        //        var bodyRows = generateBodyRows(months, suspiciousCustomers);

        //        var gridOptions = {
        //            gridExpandHeight: 230,
        //            marginRight: 0,
        //            showTree: true,
        //            showPager: true,
        //            customPager: true,
        //            pagerOption: {
        //                itemsPerPage: suspiciousCustomerReportService._pageSize,
        //                currentPage: suspiciousCustomerReportService._pageIndex,
        //                totalItem: data.TotalItem,
        //                itemsPerPageArray: [10, 20, 50, 100, 500],
        //                pagerSelectCallBack: reRenderAfterPaged
        //            }
        //        };

        //        suspiciousCustomerReportService.gridOptions.bodyRows = bodyRows;
        //        suspiciousCustomerReportService.gridOptions.columns = columnHeaders;

        //        $("#customerReportId").fanexGrid(suspiciousCustomerReportService.gridOptions);
        //        $("#report-header").width($("#customerReportId").width());
        //        $("#report-header").removeClass("hidden");
    };

    /*
    * Re-rendering.
    */
    function reRenderAfterPaged(pageIndex, itemsPerPage) {
        //        suspiciousCustomerReportService.customerList = [];

        //        suspiciousCustomerReportService._pageSize = itemsPerPage;
        //        suspiciousCustomerReportService._pageIndex = pageIndex;
        //        suspiciousCustomerReportService.gridOptions.pagerOption.currentPage = pageIndex;
        //        suspiciousCustomerReportService.querySuspiciousCustomer();

        return false;
    }

    /*
    * Create the body for rendering.
    */
    var generateBodyRows = function (months, suspiciousCustomers) {
        var rows = [];

        //        for (var i = 0; i < suspiciousCustomers.length; i++) {
        //            var suspiciousCustomer = suspiciousCustomers[i];
        //            var currentRow = {
        //                Columns: [
        //                        { Name: "Row", Value: suspiciousCustomer.Row },
        //                        { Name: "Member", Value: suspiciousCustomer.Customer.CustName },
        //                        { Name: "Group", Value: suspiciousCustomer.Group.GroupName },
        //                        { Name: "SuspiciousTime", Value: suspiciousCustomer.SuspiciousTime },
        //                        { Name: "WinlossDetail", Value: suspiciousCustomer, CustomCellRender: statisticColumn }
        //                    ]
        //            };

        //            rows.push(currentRow);
        //        }

        return rows;
    };

    /*
    * Create the header for rendering.
    */
    var generateColumnHeaders = function () {
        //        var columnHeaders = [
        //            { HeaderText: "#", Width: 70, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
        //            { HeaderText: "Member", Width: 163, Name: "Member", HeaderAlign: "center", CellAlign: "left" },
        //            { HeaderText: "Group", Width: 380, Name: "Group", HeaderAlign: "center", CellAlign: "left" },
        //            { HeaderText: "Suspicious Time", Width: 70, Name: "SuspiciousTime", HeaderAlign: "center", CellAlign: "right" },
        //            { HeaderText: "Win Loss Detail", Width: 80, Name: "WinlossDetail", HeaderAlign: "center", CellAlign: "center" }
        //        ];

        //        return columnHeaders;
    };

    return suspiciousCustomerReportModel;
} ]);