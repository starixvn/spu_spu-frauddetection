'use strict';
/*global matchMonitoringReportModule*/

matchMonitoringReportModule.directive('fanexGridMatchMonitoringReport', ['$timeout', 'matchMonitoringReportModel', function ($timeout, matchMonitoringReportModel) {
    var generateColumnHeaders = function () {
        var columnHeaders =
        [
            { HeaderText: "#", Width: 40, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "MatchId", Width: 10, Name: "MatchId", HeaderAlign: "center", CellAlign: "left", CanResize: true },
            { HeaderText: "Delq.", Width: 52, Name: "Delinquent", HeaderAlign: "center", CellAlign: "center", CustomCellRender: delinquentColumn },
            { HeaderText: "Verified", Width: 52, Name: "Verified", HeaderAlign: "center", CellAlign: "center", CustomCellRender: verifiedColumn },
            { HeaderText: "Last Verified By", Width: 100, Name: "LastVerifiedBy", HeaderAlign: "center", CellAlign: "center", CanResize: true, CustomCellRender: lastVerifiedByColumn },
            { HeaderText: "League", Width: 300, Name: "LeagueName", HeaderAlign: "center", CellAlign: "left", CanResize: true },
            { HeaderText: "Match Code", Width: 100, Name: "MatchCode", HeaderAlign: "center", CellAlign: "center", CanResize: true },
            { HeaderText: "Event", Width: 300, Name: "Event", HeaderAlign: "center", CellAlign: "left", CanResize: true, CustomCellRender: eventRenderer},
            { HeaderText: "Status", Width: 80, Name: "EventStatus", HeaderAlign: "center", CellAlign: "center", CanResize: true }
        ];

        return columnHeaders;
    };

    function eventRenderer(cell) {
        return '<span title="' + cell.Value.titleData + '">' + cell.Value.eventData + '</span>';
    };

    var generateBodyRows = function (matches) {
        var rows = [];

        for (var index = 0; index < matches.length; index++) {
            var match = matches[index];
            var row = {
                Columns: [
                    { Name: "Row", Value: index + 1 },
                    { Name: "MatchId", Value: match.MatchId },
                    { Name: "Delinquent", Value: match },
                    { Name: "Verified", Value: match },
                    { Name: "LastVerifiedBy", Value: match },
                    { Name: "LeagueName", Value: match.LeagueName },
                    { Name: "MatchCode", Value: match.MatchCode },
                    { Name: "Event", Value: 
                        {
                            eventData: match.Event,
                            titleData: match.Event.split("<b>").join("").split("</b>").join("")
                        }
                    },
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

    var delinquentColumn = function (cell) {
        var matchId = cell.Value.MatchId;
        var result = "<img alt='' " +
            "data-matchid='" + matchId + "' " +
            "id='d" + matchId + "' ";

        if (cell.Value.IsDelinquent) {
            result += "class='macth-monitoring-delinquent ico-tick'>";
        } else {
            result += "class='macth-monitoring-delinquent ico-untick'>";
        }

        return result;
    };

    var verifiedColumn = function (cell) {
        var matchId = cell.Value.MatchId;
        var result = "<img alt='' " +
            "data-matchid='" + matchId + "' " +
            "id='v" + matchId + "' ";

        if (cell.Value.IsVerified) {
            result += "class='macth-monitoring-verified ico-tick'>";
        } else {
            result += "class='macth-monitoring-verified ico-untick'>";
        }

        return result;
    };

    var lastVerifiedByColumn = function (cell) {
        var matchId = cell.Value.MatchId;
        var user = cell.Value.LastVerifiedBy.length > 0 ? cell.Value.LastVerifiedBy : "-";
        var result = "<span " +
            "id='lvb" + matchId + "'>" + user + "</span>";

        return result;
    };

    var caseColumn = function (cell) {
        var susCount = cell.Value.susCount;
        var matchId = cell.Value.matchId;
        var eventDate = matchMonitoringReportModel.filter.EventDate;
        var caseName = cell.Name;

        if (susCount == 0) {
            return "<img class='ico-scannednosuspicious' alt=''/>";
        }
        else if (susCount > 0) {
            return "<img class='ico-scannedhassuspicious' " +
                "data-matchid='" + matchId + "' " +
                "data-casename='" + caseName + "' " +
                "data-eventdate='" + eventDate + "'/>";
        }
        else {
            return "<img class='ico-notscanned' alt=''/>";
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

    var registerUpdateVerifiedEvent = function () {
        var element = $(".freegrid .table-cell .macth-monitoring-verified");

        element.die("click");
        element.live("click", function (event) {
            event.preventDefault();

            var matchId = $(this).data("matchid");
            var isActive = false;
            if ($(this).hasClass('ico-tick')) {
                isActive = true;
            }

            matchMonitoringReportModel.updateVerification(matchId, !isActive).then(function () {
                if (matchMonitoringReportModel.IsUpdated) {
                    if (isActive) {
                        $('#v' + matchId).removeClass('ico-tick').addClass('ico-untick');
                    } else {
                        $('#v' + matchId).removeClass('ico-untick').addClass('ico-tick');
                    }

                    $('#lvb' + matchId).text($('.account-name').text());
                }
            });
        });
    };

    var registerUpdateDelinquentEvent = function () {
        var element = $(".freegrid .table-cell .macth-monitoring-delinquent");

        element.die("click");
        element.live("click", function (event) {
            event.preventDefault();

            var matchId = $(this).data("matchid");
            var isActive = false;
            if ($(this).hasClass('ico-tick')) {
                isActive = true;
            }

            matchMonitoringReportModel.updateDelinquency(matchId, !isActive).then(function () {
                if (matchMonitoringReportModel.IsUpdated) {
                    if (isActive) {
                        $('#d' + matchId).removeClass('ico-tick').addClass('ico-untick');
                    } else {
                        $('#d' + matchId).removeClass('ico-untick').addClass('ico-tick');
                    }
                }
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
                            gridExpandHeight: 300,
                            enableHiddenColumns: false,
                            hiddenColumns: [1],
                            allowTruncate: true,
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

                        registerUpdateDelinquentEvent();

                        registerUpdateVerifiedEvent();

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