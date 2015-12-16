'use strict';
/*global customerDetailsReportModule*/

customerDetailsReportModule.directive('fanexGridCustomerDetailsReportFraudCase',
    ['$timeout', 'customerDetailsReportModel',
    function ($timeout, customerDetailsReportModel) {
        var generateColumnHeaders = function () {
            var columnHeaders =
        [
            { HeaderText: "Case", Width: 200, Name: "Case", HeaderAlign: "center", CellAlign: "left" },
            { HeaderText: "Violations", Width: 60, Name: "Violations", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "Verified", Width: 60, Name: "Verified", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "Unverified", Width: 60, Name: "Unverified", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "Last Verified Date", Width: 130, Name: "LastVerifiedDate", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "Last Verified By", Width: 120, Name: "LastVerifiedBy", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "Verify All", Width: 80, Name: "VerifyAll", HeaderAlign: "center", CellAlign: "center" }
        ];

            return columnHeaders;
        };

        var generateBodyRows = function (fraudCaseDetails) {
            var rows = [];

            for (var i = 0; i < fraudCaseDetails.length; i++) {
                var fraudCaseDetail = fraudCaseDetails[i];
                var currentRow = {
                    Columns:
                [
                    { Name: "Case", Value: fraudCaseDetail.CaseName },
                    { Name: "Violations", Value: fraudCaseDetail.TotalViolations },
                    { Name: "Verified", Value: fraudCaseDetail.VerifiedViolations },
                    { Name: "Unverified", Value: fraudCaseDetail.UnverifiedViolations },
                    { Name: "LastVerifiedDate", Value: fraudCaseDetail.LastVerifiedDateString },
                    { Name: "LastVerifiedBy", Value: fraudCaseDetail.LastVerifiedBy },
                    { Name: "VerifyAll", Value: fraudCaseDetail, CustomCellRender: verifyColumn }
                ]
                };

                rows.push(currentRow);
            }

            return rows;
        };

        function verifyColumn(cell) {
            var custId = customerDetailsReportModel.GeneralInfo.CustId;
            var caseId = cell.Value.CaseId;
            var result = "<a href=''  class='suspicious-customer-details-verify' data-custid='" + custId + "' data-caseid='" + caseId + "'>Verify</a>";

            return result;
        }

        var registerVerifyEvent = function () {
            var verifyElement = $(".freegrid .table-cell .suspicious-customer-details-verify");

            verifyElement.off("click");
            verifyElement.on("click", function (event) {
                event.preventDefault();

                var custId = $(this).data("custid");
                var caseId = $(this).data("caseid");

                customerDetailsReportModel.verifyCustomer(custId, caseId).then(function() {
                    var scope = angular.element($(".freegrid")).scope();
                    
                    scope.cdrCtrl.getFraudCaseDetails();
                    scope.cdrCtrl.getLogNotes();
                });
            });
        };

        return {
            restrict: "A",
            scope: {
                gridData: "="
            },
            link: function ($scope, iElement) {
                $scope.$watch('gridData', function (gridData) {
                    $timeout(function () {
                        if (gridData) {
                            var bodyRows = generateBodyRows(gridData);
                            var columnHeaders = generateColumnHeaders();

                            var gridOptions = {
                                gridExpandHeight: 700,
                                marginRight: 0,
                                showTree: true,
                                customPager: true,
                                allowTruncate: true
                            };

                            gridOptions.columns = columnHeaders;
                            gridOptions.bodyRows = bodyRows;

                            $(iElement).fanexGrid(gridOptions);

                            registerVerifyEvent();
                        }
                    });
                });
            }
        };
    } ]);

customerDetailsReportModule.directive('fanexGridCustomerDetailsReportLogNotes', ['$timeout', function ($timeout) {
    var generateColumnHeaders = function () {
        var columnHeaders =
        [
            { HeaderText: "Date", Width: 80, Name: "Date", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "Description", Width: 300, Name: "Description", HeaderAlign: "center", CellAlign: "left" },
            { HeaderText: "Author", Width: 60, Name: "Author", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "Type", Width: 60, Name: "Type", HeaderAlign: "center", CellAlign: "center" }
        ];

        return columnHeaders;
    };

    var generateBodyRows = function (logsNotes) {
        var rows = [];

        for (var i = 0; i < logsNotes.length; i++) {
            var logsNote = logsNotes[i];
            var currentRow = {
                Columns:
                [
                    { Name: "Date", Value: logsNote.LogDateString },
                    { Name: "Description", Value: logsNote.LogDesc },
                    { Name: "Author", Value: logsNote.AuthorName },
                    { Name: "Type", Value: logsNote.CustLogTypeName }
                ]
            };

            rows.push(currentRow);
        }

        return rows;
    };

    return {
        restrict: "A",
        scope: {
            gridData: "="
        },
        link: function ($scope, iElement) {
            $scope.$watch('gridData', function (gridData) {
                $timeout(function () {
                    if (gridData) {
                        var bodyRows = generateBodyRows(gridData);
                        var columnHeaders = generateColumnHeaders();

                        var gridOptions = {
                            gridExpandHeight: 700,
                            marginRight: 0,
                            showTree: true,
                            customPager: true,
                            allowTruncate: true
                        };

                        gridOptions.columns = columnHeaders;
                        gridOptions.bodyRows = bodyRows;

                        $(iElement).fanexGrid(gridOptions);
                    }
                });
            });
        }
    };
} ]);

customerDetailsReportModule.directive('fanexGridCustomerDetailsReportSummary', ['$timeout', function ($timeout) {
    var generateColumnHeaders = function () {
        var columnHeaders =
        [
            { HeaderText: "Turnover", Width: 100, Name: "Turnover", HeaderAlign: "center", CellAlign: "right" },
            { HeaderText: "Win Loss", Width: 80, Name: "WinLoss", HeaderAlign: "center", CellAlign: "right" },
            { HeaderText: "Margin (%)", Width: 80, Name: "Margin", HeaderAlign: "center", CellAlign: "right" },
            { HeaderText: "Bet Count", Width: 80, Name: "BetCount", HeaderAlign: "center", CellAlign: "right" }
        ];

        return columnHeaders;
    };

    var generateBodyRows = function (summary) {
        var rows = [];

        var currentRow = {
            Columns:
                [
                    { Name: "Turnover", Value: summary.SumTO },
                    { Name: "WinLoss", Value: summary.SumWL },
                    { Name: "Margin", Value: summary.Margin },
                    { Name: "BetCount", Value: summary.BetCount }
                ]
        };

        rows.push(currentRow);

        return rows;
    };

    return {
        restrict: "A",
        scope: {
            gridData: "="
        },
        link: function ($scope, iElement) {
            $scope.$watch('gridData', function (gridData) {
                $timeout(function () {
                    if (gridData) {
                        var bodyRows = generateBodyRows(gridData);
                        var columnHeaders = generateColumnHeaders();

                        var gridOptions = {
                            gridExpandHeight: 700,
                            marginRight: 0,
                            showTree: true,
                            customPager: true,
                            allowTruncate: true
                        };

                        gridOptions.columns = columnHeaders;
                        gridOptions.bodyRows = bodyRows;

                        $(iElement).fanexGrid(gridOptions);
                    }
                });
            });
        }
    };
} ]);

customerDetailsReportModule.directive('fanexGridCustomerDetailsReportEventChoice', ['$timeout', function ($timeout) {
    var generateColumnHeaders = function () {
        var columnHeaders =
        [
            { HeaderText: "Sport", Width: 100, Name: "Sport", HeaderAlign: "center", CellAlign: "left" },
            { HeaderText: "Turnover", Width: 80, Name: "Turnover", HeaderAlign: "center", CellAlign: "right" },
            { HeaderText: "Win Loss", Width: 80, Name: "WinLoss", HeaderAlign: "center", CellAlign: "right" },
            { HeaderText: "Margin (%)", Width: 80, Name: "Margin", HeaderAlign: "center", CellAlign: "right" }
        ];

        return columnHeaders;
    };

    var generateBodyRows = function (eventChoices) {
        var rows = [];
        for (var i = 0; i < eventChoices.length; i++) {
            var eventChoice = eventChoices[i];
            var currentRow = {
                Columns:
                [
                    { Name: "Sport", Value: eventChoice.EventChoice },
                    { Name: "Turnover", Value: eventChoice.SumTO },
                    { Name: "WinLoss", Value: eventChoice.SumWL },
                    { Name: "Margin", Value: eventChoice.Margin }
                ]
            };

            rows.push(currentRow);
        }

        return rows;
    };

    return {
        restrict: "A",
        scope: {
            gridData: "="
        },
        link: function ($scope, iElement) {
            $scope.$watch('gridData', function (gridData) {
                $timeout(function () {
                    if (gridData) {
                        var bodyRows = generateBodyRows(gridData);
                        var columnHeaders = generateColumnHeaders();

                        var gridOptions = {
                            gridExpandHeight: 700,
                            marginRight: 0,
                            showTree: true,
                            customPager: true,
                            allowTruncate: true
                        };

                        gridOptions.columns = columnHeaders;
                        gridOptions.bodyRows = bodyRows;

                        $(iElement).fanexGrid(gridOptions);
                    }
                });
            });
        }
    };
} ]);

customerDetailsReportModule.directive('fanexGridCustomerDetailsReportSport', ['$timeout', function ($timeout) {
    var generateColumnHeaders = function () {
        var columnHeaders =
        [
            { HeaderText: "Sport", Width: 100, Name: "Sport", HeaderAlign: "center", CellAlign: "left" },
            { HeaderText: "Turnover", Width: 80, Name: "Turnover", HeaderAlign: "center", CellAlign: "right" },
            { HeaderText: "Win Loss", Width: 80, Name: "WinLoss", HeaderAlign: "center", CellAlign: "right" },
            { HeaderText: "Margin (%)", Width: 80, Name: "Margin", HeaderAlign: "center", CellAlign: "right" }
        ];

        return columnHeaders;
    };

    var generateBodyRows = function (sports) {
        var rows = [];
        for (var i = 0; i < sports.length; i++) {
            var sport = sports[i];
            var currentRow = {
                Columns:
                [
                    { Name: "Sport", Value: sport.SportName },
                    { Name: "Turnover", Value: sport.SumTO },
                    { Name: "WinLoss", Value: sport.SumWL },
                    { Name: "Margin", Value: sport.Margin }
                ]
            };

            rows.push(currentRow);
        }

        return rows;
    };

    return {
        restrict: "A",
        scope: {
            gridData: "="
        },
        link: function ($scope, iElement) {
            $scope.$watch('gridData', function (gridData) {
                $timeout(function () {
                    if (gridData) {
                        var bodyRows = generateBodyRows(gridData);
                        var columnHeaders = generateColumnHeaders();

                        var gridOptions = {
                            gridExpandHeight: 700,
                            marginRight: 0,
                            showTree: true,
                            customPager: true,
                            allowTruncate: true
                        };

                        gridOptions.columns = columnHeaders;
                        gridOptions.bodyRows = bodyRows;

                        $(iElement).fanexGrid(gridOptions);
                    }
                });
            });
        }
    };
} ]);

customerDetailsReportModule.directive('fanexGridCustomerDetailsReportBettype', ['$timeout', function ($timeout) {
    var generateColumnHeaders = function () {
        var columnHeaders =
        [
            { HeaderText: "Sport", Width: 100, Name: "Sport", HeaderAlign: "center", CellAlign: "left" },
            { HeaderText: "Turnover", Width: 80, Name: "Turnover", HeaderAlign: "center", CellAlign: "right" },
            { HeaderText: "Win Loss", Width: 80, Name: "WinLoss", HeaderAlign: "center", CellAlign: "right" },
            { HeaderText: "Margin (%)", Width: 80, Name: "Margin", HeaderAlign: "center", CellAlign: "right" }
        ];

        return columnHeaders;
    };

    var generateBodyRows = function (bettypes) {
        var rows = [];
        for (var i = 0; i < bettypes.length; i++) {
            var bettype = bettypes[i];
            var currentRow = {
                Columns:
                [
                    { Name: "Sport", Value: bettype.BettypeName },
                    { Name: "Turnover", Value: bettype.SumTO },
                    { Name: "WinLoss", Value: bettype.SumWL },
                    { Name: "Margin", Value: bettype.Margin }
                ]
            };

            rows.push(currentRow);
        }

        return rows;
    };

    return {
        restrict: "A",
        scope: {
            gridData: "="
        },
        link: function ($scope, iElement) {
            $scope.$watch('gridData', function (gridData) {
                $timeout(function () {
                    if (gridData) {
                        var bodyRows = generateBodyRows(gridData);
                        var columnHeaders = generateColumnHeaders();

                        var gridOptions = {
                            gridExpandHeight: 700,
                            marginRight: 0,
                            showTree: true,
                            customPager: true,
                            allowTruncate: true
                        };

                        gridOptions.columns = columnHeaders;
                        gridOptions.bodyRows = bodyRows;

                        $(iElement).fanexGrid(gridOptions);
                    }
                });
            });
        }
    };
} ]);

customerDetailsReportModule.directive('fanexGridCustomerDetailsReportDailyViolatedTickets', ['$timeout', function ($timeout) {
    var generateColumnHeaders = function () {
        var formatNumber = '0,0.00';
        var columnHeaders =
        [
            { HeaderText: "#", Width: 30, Name: "No", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Trans Date", Width: 150, Name: "TransDate", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Member", Width: 100, Name: "CustName", HeaderAlign: "center", CellAlign: "left" },
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
                    FormatNegative: '($)',
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
                    { Name: "TransDate", Value: element.TransDate },
                    { Name: "CustName", Value: element.CustName },
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
        link: function ($scope, iElement) {
            $scope.$watch('gridData', function (gridData) {
                $timeout(function () {
                    if (gridData) {
                        var bodyRows = generateBodyRows(gridData);
                        var columnHeaders = generateColumnHeaders();

                        var gridOptions = {
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

                        gridOptions.columns = columnHeaders;
                        gridOptions.bodyRows = bodyRows;

                        $(iElement).fanexGrid(gridOptions);
                    }
                });
            });
        }
    };
} ]);