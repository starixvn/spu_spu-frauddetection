'use strict';
/*global officeIPsReportModule*/

officeIPsReportModule.directive('fanexGridOfficeIpReport', ['$timeout', function ($timeout) {
    var generateColumnHeaders = function () {
        var formatNumber = '0,0.00';
        var columnHeaders =
        [
            { HeaderText: "#", Width: 30, Name: "No", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "Member", Width: 100, Name: "Member", HeaderAlign: "center", CellAlign: "left" },
            { HeaderText: "Trans Date", Width: 150, Name: "TransDate", HeaderAlign: "center", CellAlign: "left" },
            { HeaderText: "Bet ID", Width: 90, Name: "TransId", HeaderAlign: "center", CellAlign: "left" },
            { HeaderText: "Bet Type", Width: 90, Name: "BetType", HeaderAlign: "center", CellAlign: "left" },
            { HeaderText: "Choice", Width: 90, Name: "Choice", HeaderAlign: "center", CellAlign: "right" },
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
        ];

        return columnHeaders;
    };

    var generateBodyRows = function (data) {
        var rows = [];
        $.each(data, function (index, element) {
            rows.push({
                Columns: [
                    { Name: "No", Value: index + 1 },
                    { Name: "Member", Value: element.CustName },
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

        return rows;
    };

    return {
        restrict: "A",
        scope: {
            gridData: "="
        },
        link: function ($scope) {
            $scope.$watch('gridData', function (gridData) {
                $timeout(function () {
                    if (gridData) {
                        var bodyRows = generateBodyRows(gridData);
                        var columnHeaders = generateColumnHeaders();

                        var gridOptions = {
                            showNumberColumn: true,
                            showPager: true,
                            fullHeight: true,
                            gridExpandHeight: 250,
                            allowTruncate: true,
                            pagerOption: {
                                itemsPerPage: 50,
                                currentPage: 0,
                                itemsPerPageArray: [10, 20, 50, 100, 500]
                            },
                            
                        };

                        gridOptions.columns = columnHeaders;
                        gridOptions.bodyRows = bodyRows;

                        $('#office-ip-report').fanexGrid(gridOptions);
                        
                        $("#report-header").width($('#office-ip-report').width());
                        $("#report-header").removeClass("hidden");
                    }
                });
            });
        }
    };
} ]);

officeIPsReportModule.directive('datetimepicker', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.datetimepicker({
                change: function (date) {
                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(date);
                    });
                }
            });
        }
    };
});