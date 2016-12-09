'use strict';
/*global liveMatchMonitoringReportModel*/
var pageNumber = 0;
liveMatchMonitoringReportModule.directive('fanexGridMatchMonitoringReport', ['$timeout', 'liveMatchMonitoringReportModel', function ($timeout, liveMatchMonitoringReportModel) {
    var pageSize = 50;
    var generateColumnHeaders = function () {
        var columnHeaders =
        [
            { HeaderText: "#", Width: 40, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "MatchId", Width: 10, Name: "MatchId", HeaderAlign: "center", CellAlign: "left", CanResize: true },
            { HeaderText: "Verified", Width: 40, Name: "Verified", HeaderAlign: "center", CellAlign: "center", CanResize: true, CustomCellRender: verifiedColumn },
            { HeaderText: "Last Verified By", Width: 100, Name: "LastVerifiedBy", HeaderAlign: "center", CellAlign: "center", CanResize: true, CustomCellRender: lastVerifiedByColumn },
            { HeaderText: "Event", Width: 400, Name: "Event", HeaderAlign: "center", CellAlign: "left", CanResize: true, CustomCellRender: eventRenderer },
            { HeaderText: "Live Score", Width: 100, Name: "LiveScore", HeaderAlign: "center", CellAlign: "center", CanResize: true },
        ];

        return columnHeaders;
    };

    function eventRenderer(cell) {
        return '<span title="' + cell.Value.titleData + '">' + cell.Value.eventData + '</span>';
    };

    var oldPlayingMatchs = [];
    var generateBodyRows = function (matches) {
        var greaterNumber = matches.length - oldPlayingMatchs.length;
        var rows = [];
        var tempOldPlayingMatchs = [];
        var cssName = 'playing-match';

        for (var index = 0; index < matches.length; index++) {
            var match = matches[index];
            var row = null;
            if (match.IsPlayingMatch) {
                tempOldPlayingMatchs.push(match);
                row = {
                    Columns: [
                        { Name: "Row", Value: index + 1, TdClass: cssName },
                        { Name: "MatchId", Value: match.MatchId, TdClass: cssName },
                        { Name: "Verified", Value: match, TdClass: cssName },
                        { Name: "LastVerifiedBy", Value: match, TdClass: cssName },
                        {
                            Name: "Event", Value:
                              {
                                  eventData: match.Event,
                                  titleData: match.Event.split("<b>").join("").split("</b>").join("")
                                      .split("</br>").join("").split("<span class='league'>").join("- ").split("</span>").join("")
                              },
                            TdClass: cssName
                        },
                        {
                            Name: "LiveScore",
                            Value: match,
                            CustomCellRender: scoreColumn,
                            TdClass: cssName,
                            CssClass: getCssNameForChangingScore(oldPlayingMatchs[index], match)
                        }
                    ],
                };
                for (var key in match.SuspiciousCases) {
                    row.Columns.push(
                        {
                            Name: key, Value: {
                                susCount: match.SuspiciousCases[key],
                                matchId: match.MatchId
                            },
                            CustomCellRender: caseColumn,
                            TdClass: cssName
                        });
                }
            }
            else {
                row = {
                    Columns: [
                        { Name: "Row", Value: index + 1 },
                        { Name: "MatchId", Value: match.MatchId },
                        { Name: "Verified", Value: match },
                        { Name: "LastVerifiedBy", Value: match },
                        {
                            Name: "Event", Value:
                              {
                                  eventData: match.Event,
                                  titleData: match.Event.split("<b>").join("").split("</b>").join("")
                                      .split("</br>").join("").split("<span class='league'>").join("- ").split("</span>").join("")
                              }
                        },
                        { Name: "LiveScore", Value: match.LiveHomeScore + " - " + match.LiveAwayScore }
                    ]
                };
                for (var key in match.SuspiciousCases) {
                    row.Columns.push(
                        {
                            Name: key, Value: {
                                susCount: match.SuspiciousCases[key],
                                matchId: match.MatchId
                            }, CustomCellRender: caseColumn
                        });
                }
            }

            rows.push(row);
        }

        oldPlayingMatchs = tempOldPlayingMatchs;

        return rows;
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

    var scoreColumn = function (cell) {
        var match = cell.Value;

        var result = "<b>" + match.LiveHomeScore + "</b>" + " - " + "<b>" + match.LiveAwayScore + "</b>";

        return result;
    };

    var getCssNameForChangingScore = function (oldMatch, newMatch) {
        if (oldMatch && oldMatch.MatchId === newMatch.MatchId) {
            if (oldMatch.LiveHomeScore !== newMatch.LiveHomeScore || oldMatch.LiveAwayScore !== newMatch.LiveAwayScore) {
                return ' score-changed';
            }
            else {
                return '';
            }
        }
        else {
            return '';
        }
    };

    var caseColumn = function (cell) {
        var susCount = cell.Value.susCount;
        var matchId = cell.Value.matchId;
        var eventDate = liveMatchMonitoringReportModel.filter.EventDate;
        var caseName = cell.Name;

        if (susCount == 0) {
            return "<span class='ico-scannednosuspicious'></span>";
        }
        else if (susCount > 0) {
            return "<div class='ico-scannedhassuspicious' " +
                "data-matchid='" + matchId + "' " +
                "data-casename='" + caseName + "' " +
                "data-suscount='" + susCount + "' " +
                "data-eventdate='" + eventDate + "'>" + "<span class=\"number-bet-count\">" + susCount + "</span>" + "</div>";
        }
        else {
            return "<span class='ico-notscanned'></span>";
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

            liveMatchMonitoringReportModel.getCaseIdFromCaseName(caseName).success(function (data) {
                caseId = data;
                var url = "FraudCaseDetail/Index?" + "MatchId=" + matchId;
                url += "&CaseId=" + caseId;
                url += "&EventDate=" + eventDate;

                window.open(url, '_blank');
                window.focus();
            });
        });
    };

    var lastVerifiedByColumn = function (cell) {
        var matchId = cell.Value.MatchId;
        var user = cell.Value.LastVerifiedBy.length > 0 ? cell.Value.LastVerifiedBy : "-";
        var result = "<span " +
            "id='lvb" + matchId + "'>" + user + "</span>";

        return result;
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

            liveMatchMonitoringReportModel.updateVerification(matchId, !isActive).then(function () {
                if (liveMatchMonitoringReportModel.IsUpdated) {
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
                                itemsPerPage: pageSize,
                                currentPage: pageNumber,
                                totalItem: gridData.MatchMonitoring.length,
                                itemsPerPageArray: [10, 20, 50, 100, 500],
                                afterPagedFunction: function () {
                                    pageNumber = this.currentPage;
                                    pageSize = this.itemsPerPage;
                                }
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

                        registerUpdateVerifiedEvent();

                        $("#report-header").width($('#match-monitoring-report').width());
                        $("#report-header").removeClass("hidden");
                    }
                });
            });
        }
    };
}]);

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