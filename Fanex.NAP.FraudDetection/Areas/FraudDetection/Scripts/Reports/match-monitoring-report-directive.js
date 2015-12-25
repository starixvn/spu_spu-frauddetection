'use strict';
/*global matchMonitoringReportModule*/

matchMonitoringReportModule.directive('fanexGridMatchMonitoringReport', ['$timeout', 'matchMonitoringReportModel', function ($timeout, matchMonitoringReportModel) {
    var generateColumnHeaders = function () {
        var columnHeaders =
        [
            { HeaderText: "#", Width: 20, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "MatchId", Width: 10, Name: "MatchId", HeaderAlign: "center", CellAlign: "left", CanResize: true },
            { HeaderText: "League", Width: 30, Name: "LeagueName", HeaderAlign: "center", CellAlign: "left", CanResize: true },
            { HeaderText: "Match Code", Width: 10, Name: "MatchCode", HeaderAlign: "center", CellAlign: "center", CanResize: true },
            { HeaderText: "Event", Width: 30, Name: "Event", HeaderAlign: "center", CellAlign: "left", CanResize: true },
            { HeaderText: "Status", Width: 10, Name: "EventStatus", HeaderAlign: "center", CellAlign: "center", CanResize: true }
        ];

        return columnHeaders;
    };

    var generateBodyRows = function (matches) {
        var rows = [];

        for (var index = 0; index < matches.length; index++) {
            var match = matches[index];
            var row = {
                Columns: [
                    { Name: "Row", Value: index + 1 },
                    { Name: "MatchId", Value: match.MatchId },
                    { Name: "LeagueName", Value: match.LeagueName },
                    { Name: "MatchCode", Value: match.MatchCode },
                    { Name: "Event", Value: match.Event },
                    { Name: "EventStatus", Value: match.EventStatus }
                ]
            };

            for (var key in match.SuspiciousCases) {
                row.Columns.push(
                    { Name: key, Value: {
                        susCount: match.SuspiciousCases[key],
                        matchId: match.MatchId
                    }, CustomCellRender: caseColumn
                    });
            }

            rows.push(row);
        }

        return rows;
    };

    var caseColumn = function (cell) {
        var susCount = cell.Value.susCount;
        var matchId = cell.Value.matchId;
        var eventDate = matchMonitoringReportModel.filter.EventDate;
        var caseName = cell.Name;

        if (susCount == 0) {
            return "<img title='Scanned and has no suspicious case.' class='ico-scannednosuspicious' alt=''/>";
        }
        else if (susCount > 0) {
            return "<img title='Scanned and has suspicious cases.' class='ico-scannedhassuspicious' " +
                "data-matchid='" + matchId + "' " +
                "data-casename='" + caseName + "' " +
                "data-eventdate='" + eventDate + "'/>";
        }
        else {
            return "<img title='Not scanned.' class='ico-notscanned' alt=''/>";
        }
    };

    var registerViewDetailsEvent = function () {
        var element = $(".freegrid .table-cell .ico-scannedhassuspicious");

        element.die("click");
        element.live("click", function (event) {
            event.preventDefault();

            var matchId = $(this).data("matchid");
            var caseName = $(this).data("casename");
            var eventDate = $(this).data("eventdate");
            var caseId = 0;

            matchMonitoringReportModel.getCaseIdFromCaseName(caseName).success(function (data) {
                caseId = data;
                var url = "FraudCaseDetail/Index?" + "MatchId=" + matchId;
                url += "&CaseId=" + caseId;
                url += "&EventDate=" + eventDate;

                window.open(url, '_blank');
                window.focus();
            });
        });
    };

    return {
        restrict: "A",
        scope: {
            gridData: "=",
            pageOption: '=',
            onPageChanging: '='
        },
        link: function ($scope) {
            $scope.$watch('gridData', function (gridData) {
                $timeout(function () {
                    if (gridData.MatchMonitoring !== undefined) {
                        var bodyRows = generateBodyRows(gridData.MatchMonitoring);
                        var columnHeaders = generateColumnHeaders();

                        var gridOptions = {
                            hideYBackGroundScroller: true,
                            gridExpandHeight: 350,
                            enableHiddenColumns: false,
                            hiddenColumns: [1],
                            autoResizeColumn: true,
                            showPager: true,
                            pagerOption: {
                                itemsPerPage: 50,
                                currentPage: 0,
                                totalItem: gridData.MatchMonitoring.length,
                                itemsPerPageArray: [10, 20, 50, 100, 500]
                            }
                        };

                        gridOptions.columns = columnHeaders;
                        gridOptions.bodyRows = bodyRows;

                        if (gridData.MatchMonitoring.length > 0) {
                            for (var key in gridData.MatchMonitoring[0].SuspiciousCases) {
                                gridOptions.columns.push(
                                    { HeaderText: key, Width: 100, Name: key, HeaderAlign: "center", CellAlign: "center", CanResize: true });
                            }
                        }

                        $('#match-monitoring-report').fanexGrid(gridOptions);

                        registerViewDetailsEvent();

                        $("#report-header").width($('#match-monitoring-report').width());
                        $("#report-header").removeClass("hidden");
                    }
                });
            });
        }
    };
} ]);

matchMonitoringReportModule.directive('datetimepicker', function () {
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

jQuery.fn.extend({
    live: function (types, data, fn) {
        jQuery(this.context).on(types, this.selector, data, fn);
        return this;
    },

    die: function (types, data, fn) {
        jQuery(this.context).off(types, this.selector, data, fn);
        return this;
    }
});