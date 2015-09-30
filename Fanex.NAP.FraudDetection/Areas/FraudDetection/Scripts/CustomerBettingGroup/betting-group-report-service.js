var bettingGroupReportService = (function ($) {
    var service = {};

    var getBodyRows = function (data) {
        var bodyRows = [];

        $.each(data, function (index, element) {
            bodyRows.push({
                Columns: [
                    { Name: "EventDateStr", Value: element.EventDateStr },
                    { Name: "Match", Value: element.HomeName + ' -vs-' + element.AwayName },
                    { Name: "AssociationMembers", Value: element.AssociationMembers },
                    { Name: "WinLoss", Value: element.WinLoss },
                    { Name: "Ip", Value: element.Ip }
                ]
            });
        });

        return bodyRows;
    };

    var getGridOption = function (data) {
        var formatNumber = '0,0.00';

        var gridOptions = {
            columns: [
                { HeaderText: "Event Date", Width: 100, Name: "EventDateStr", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Match", Width: 200, Name: "Match", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Association Members", Width: 200, Name: "AssociationMembers", HeaderAlign: "center", CellAlign: "left" },
                {
                    HeaderText: "Win Loss", Width: 100, Name: "WinLoss", HeaderAlign: "center", CellAlign: "right",
                    IsCurrency: true,
                    FormatNumber: formatNumber,
                    FormatNegative: '($)',
                    IsAbs: true                    
                },
                { HeaderText: "IP", Width: 100, Name: "Ip", HeaderAlign: "center", CellAlign: "center" }                
            ],
            bodyRows: getBodyRows(data),
            showPager: true,
            fullHeight: true,
            gridExpandHeight: 300,
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

    service.showAssociationCustomers = function () {
        var gridOptions = getGridOption(data);
        $("#fraudCaseDetailReportId").fanexGrid(gridOptions);
    };

    service.init = function () {
        service.showAssociationCustomers();
    };

    return service;

})(jQuery);

(function ($) {
    bettingGroupReportService.init();
})(jQuery);