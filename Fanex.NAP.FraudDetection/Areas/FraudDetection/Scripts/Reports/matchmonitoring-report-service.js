var matchMonitoringReportService = (function ($) {
    "use strict";

    var matchMonitoringReportService = {};

    matchMonitoringReportService._pageIndex = 0;
    matchMonitoringReportService._pageSize = 50;
    matchMonitoringReportService.gridOptions = '';

    matchMonitoringReportService.initialize = function () {
        $('#EventDate').datepicker();

        $('#eventDateDatetimePickerIcon').click(function () {
            $('#EventDate').datepicker("show");
        });

        $('#EventDate').on('change', function (e) {
            var eventDate = $("#EventDate").val();

            matchMonitoringReportFactory.getLeaguesByDate(eventDate).success(function (response) {
                $('#Leagues').find('option').remove().end();
                $('#Leagues').append($('<option value="-1">All Leagues</option>'));
                $.each(response, function (i, league) {
                    $('#Leagues').append($('<option>', {
                        value: league.LeagueId,
                        text: league.LeagueName
                    }));
                });
            });
        });

        $("#btnSearch").click(function (event) {
            event.preventDefault();

            var param = {
                "EventDate": $("#EventDate").val(),
                "LeagueId": $("#Leagues").val(),
                "MatchStatus": $("#MatchStatus").val(),
                "SuspiciousStatus": $("#SuspiciousStatus").val()
            };

            matchMonitoringReportFactory.Search(param).success(function (data) {
                matchMonitoringReportService.renderReportTable(data);
            });
        });
    };

    matchMonitoringReportService.renderReportTable = function (data) {
        matchMonitoringReportService.gridOptions =
        {
            columns: [
                { HeaderText: "#", Width: 20, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "MatchId", Width: 10, Name: "MatchId", HeaderAlign: "center", CellAlign: "left", CanResize: true },
                { HeaderText: "League", Width: 30, Name: "LeagueName", HeaderAlign: "center", CellAlign: "left", CanResize: true },
                { HeaderText: "Match Code", Width: 10, Name: "MatchCode", HeaderAlign: "center", CellAlign: "center", CanResize: true },
                { HeaderText: "Event", Width: 30, Name: "Event", HeaderAlign: "center", CellAlign: "left", CanResize: true },
                { HeaderText: "Status", Width: 10, Name: "EventStatus", HeaderAlign: "center", CellAlign: "center", CanResize: true }
            ],
            bodyRows: matchMonitoringReportService.createReportTable(data.MatchMonitoring),
            hideYBackGroundScroller: true,
            gridExpandHeight: 180,
            enableHiddenColumns: false,
            hiddenColumns: [1],
            autoResizeColumn: true,
            showPager: true,
            pagerOption: {
                itemsPerPage: matchMonitoringReportService._pageSize,
                currentPage: matchMonitoringReportService._pageIndex,
                itemsPerPageArray: [10, 20, 50, 100, 500]
            }
        };

        for (var key in data.MatchMonitoring[0].SuspiciousCases) {
            matchMonitoringReportService.gridOptions.columns.push(
                { HeaderText: key, Width: 100, Name: key, HeaderAlign: "center", CellAlign: "center", CanResize: true });
        }

        $("#matchMonitoringReport").fanexGrid(matchMonitoringReportService.gridOptions);
    };

    matchMonitoringReportService.createReportTable = function (matches) {
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
                    }, CustomCellRender: matchMonitoringReportService.caseColumn
                    });
            }

            rows.push(row);
        }

        return rows;
    };

    matchMonitoringReportService.caseColumn = function (cell) {
        var susCount = cell.Value.susCount;
        var matchId = cell.Value.matchId;
        var eventDate = $("#EventDate").val();
        var caseName = cell.Name;

        if (susCount == 0) {
            return "<img title='Scanned and has no suspicious case.' class='ico-scannednosuspicious' alt=''/>";
        }
        else if (susCount > 0) {
            return "<img title='Scanned and has suspicious cases.' class='ico-scannedhassuspicious' onclick='matchMonitoringReportService.viewFraudCaseDetail(" + matchId + ",\"" + caseName + "\",\"" + eventDate + "\")'/>";
        }
        else {
            return "<img title='Not scanned.' class='ico-notscanned' alt=''/>";
        }
    };

    matchMonitoringReportService.viewFraudCaseDetail = function (matchId, caseName, eventDate) {
        var caseId = 0;
        matchMonitoringReportFactory.GetCaseIdFromCaseName(caseName).success(function (data) {
            caseId = data;
            var url = "FraudCaseDetail/Index?" + "MatchId=" + matchId;
            url += "&CasedId=" + caseId;
            url += "&EventDate=" + eventDate;

            window.open(url, '_blank');
            window.focus();
        });
    };

    return matchMonitoringReportService;
})(jQuery);