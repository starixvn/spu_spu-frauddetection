var dailyDataMonitoringReportService = (function ($) {
    "use strict";

    var dailyDataMonitoringReportService = {};

    dailyDataMonitoringReportService._pageIndex = 0;
    dailyDataMonitoringReportService._pageSize = 50;
    dailyDataMonitoringReportService.gridOptions = '';

    dailyDataMonitoringReportService.initialize = function () {
        $('#EventDateFrom').datepicker();
        $('#EventDateTo').datepicker();

        $('#eventDateFromDatetimePickerIcon').click(function () {
            $('#EventDateFrom').datepicker("show");
        });

        $('#eventDateToDatetimePickerIcon').click(function () {
            $('#EventDateTo').datepicker("show");
        });

        $("#btnSearch").click(function (event) {
            event.preventDefault();

            waitingDialog.show("Please wait...", { dialogSize: 'sm' });
            var param = {
                "EventDateFrom": $("#EventDateFrom").val(),
                "EventDateTo": $("#EventDateTo").val()
            };

            dailyDataMonitoringReportFactory.Search(param).success(function (data) {
                dailyDataMonitoringReportService.renderReportTable(data);

                waitingDialog.hide();
            });
        });

        $("#btnExportExcel").click(function (event) {
            event.preventDefault();

            waitingDialog.show("Please wait...", { dialogSize: 'sm' });
            var param = {
                "EventDateFrom": $("#EventDateFrom").val(),
                "EventDateTo": $("#EventDateTo").val()
            };

            FraudDetectionScripts.downloadFile("DailyDataMonitoring/ExportExcel", param);
            waitingDialog.hide();
        });
    };

    dailyDataMonitoringReportService.renderReportTable = function (data) {
        dailyDataMonitoringReportService.gridOptions =
        {
            columns: [
                { HeaderText: "Match", Width: 300, Name: "Event", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Event Date", Width: 200, Name: "EventDate", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Category", Width: 200, Name: "DataType", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Captured Time", Width: 200, Name: "OldDate", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Captured Data", Width: 100, Name: "OldValue", HeaderAlign: "center", CellAlign: "right" },
                { HeaderText: "Compared Time", Width: 200, Name: "NewDate", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Compared Data", Width: 100, Name: "NewValue", HeaderAlign: "center", CellAlign: "right" }
            ],
            bodyRows: dailyDataMonitoringReportService.createReportTable(data.dailyDataMonitoring),
            hideYBackGroundScroller: true,
            gridExpandHeight: 250,
            enableHiddenColumns: false,
            showPager: true,
            pagerOption: {
                itemsPerPage: dailyDataMonitoringReportService._pageSize,
                currentPage: dailyDataMonitoringReportService._pageIndex,
                itemsPerPageArray: [10, 20, 50, 100, 500]
            }
        };

        $("#dailyDataMonitoringReport").fanexGrid(dailyDataMonitoringReportService.gridOptions);
        $("#report-header").width($("#dailyDataMonitoringReport").width());
        $("#report-header").removeClass("hidden");
    };

    dailyDataMonitoringReportService.createReportTable = function (records) {
        var rows = [];

        for (var index = 0; index < records.length; index++) {
            var record = records[index];
            var row = {
                Columns: [
                    { Name: "Event", Value: record.Event },
                    { Name: "EventDate", Value: record.EventDate },
                    { Name: "DataType", Value: record.DataType },
                    { Name: "OldDate", Value: record.OldDate },
                    { Name: "OldValue", Value: record.OldValue },
                    { Name: "NewDate", Value: record.NewDate },
                    { Name: "NewValue", Value: record.NewValue }
                ]
            };

            rows.push(row);
        }

        return rows;
    };

    return dailyDataMonitoringReportService;
})(jQuery);