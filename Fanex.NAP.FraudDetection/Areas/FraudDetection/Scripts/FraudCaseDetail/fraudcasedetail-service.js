var fraudCaseDetailService = (function ($) {

    var service = {};

    var getBodyRows = function (data) {
        var bodyRows = [];

        $.each(data, function (index, element) {
            bodyRows.push({
                Columns: [
                    { Name: "No", Value: index + 1 },
                    { Name: "CustName", Value: element.CustName },
                    { Name: "TransDate", Value: element.TransDate },
                    { Name: "TransId", Value: element.TransId },
                    { Name: "BetType", Value: element.BetType },
                    { Name: "Choice", CustomCellRender: function () { return element.Choice; } },
                    { Name: "Score", Value: element.Score },
                    { Name: "Odds", CustomCellRender: function () { return element.Odds; } },
                    { Name: "Stake", CustomCellRender: function () { return element.Stake; } },
                    { Name: "WinLoss", Value: element.WinLoss },
                    { Name: "Status", Value: element.Status },
                    { Name: "IP", Value: element.IP }
                ]
            });
        });

        return bodyRows;
    };

    var getGridOption = function (data) {
        var formatNumber = '0,0.00';

        var gridOptions = {
            columns: [
                { HeaderText: "#", Width: 30, Name: "No", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Member", Width: 100, Name: "CustName", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Trans Date", Width: 150, Name: "TransDate", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Bet ID", Width: 90, Name: "TransId", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Bet Type", Width: 100, Name: "BetType", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Choice", Width: 220, Name: "Choice", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Score", Width: 70, Name: "Score", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Odds", Width: 70, Name: "Odds", HeaderAlign: "center", CellAlign: "right" },
                { HeaderText: "Stake", Width: 100, Name: "Stake", HeaderAlign: "center", CellAlign: "right" },
                {
                    HeaderText: "Win Loss", Width: 100, Name: "WinLoss", HeaderAlign: "center", CellAlign: "right",
                    IsCurrency: true,
                    FormatNumber: formatNumber,
                    FormatNegative: '-$',
                    IsAbs: true
                },
                { HeaderText: "Status", Width: 50, Name: "Status", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "IP", Width: 120, Name: "IP", HeaderAlign: "center", CellAlign: "center" }
            ],
            bodyRows: getBodyRows(data),
            showNumberColumn: true,
            showPager: true,
            fullHeight: true,
            gridExpandHeight: 280,
            allowTruncate: true,
            pagerOption: {
                itemsPerPage: 50,
                currentPage: 0,
                itemsPerPageArray: [10, 20, 50, 100, 500],
                showDetail: true
            }
        };

        return gridOptions;
    };

    service.getFraudCaseDetails = function () {
        var gridOptions = getGridOption(data);
        $("#fraudCaseDetailReportId").fanexGrid(gridOptions);
        $("#report-header").width($("#fraudCaseDetailReportId").width());
        $("#report-header").removeClass("hidden");
    };

    service.init = function () {
        service.getFraudCaseDetails();

        $("#btnExportExcel").click(function (event) {
            event.preventDefault();

            waitingDialog.show("Please wait...", { dialogSize: 'sm' });
            var param = {
                "MatchId": $("#MatchId").text(),
                "CaseId": $("#CaseId").text(),
                "EventDate": $("#EventDate").text()
            };

            FraudDetectionScripts.downloadFile("ExportExcel", param);
            waitingDialog.hide();
        });
    };

    return service;

})(jQuery);

(function ($) {
    fraudCaseDetailService.init();
})(jQuery);