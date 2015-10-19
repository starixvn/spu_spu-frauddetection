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

        matchMonitoringReportService.renderLeagues($("#EventDate").val());
        $('#EventDate').on('change', function (e) {
            matchMonitoringReportService.renderLeagues($("#EventDate").val());
        });

        $("#btnSearch").click(function (event) {
            event.preventDefault();

            waitingDialog.show("Please wait...", { dialogSize: 'sm' });
            var param = {
                "EventDate": $("#EventDate").val(),
                "LeagueId": $("#Leagues").val(),
                "MatchCode": $("#MatchCode").val(),
                "MatchStatus": $("#MatchStatus").val(),
                "SuspiciousStatus": $("#SuspiciousStatus").val()
            };

            matchMonitoringReportFactory.Search(param).success(function (data) {
                matchMonitoringReportService.renderReportTable(data);

                waitingDialog.hide();
            });
        });

        $("#btnExportExcel").click(function (event) {
            event.preventDefault();

            waitingDialog.show("Please wait...", { dialogSize: 'sm' });
            var param = {
                "EventDate": $("#EventDate").val(),
                "LeagueId": $("#Leagues").val(),
                "MatchCode": $("#MatchCode").val(),
                "MatchStatus": $("#MatchStatus").val(),
                "SuspiciousStatus": $("#SuspiciousStatus").val()
            };

            matchMonitoringReportFactory.ExportExcel(param).success(function (data) {
                alert(data.Msg);

                waitingDialog.hide();
            });
        });
    };

    matchMonitoringReportService.renderLeagues = function (eventDate) {
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
            gridExpandHeight: 230,
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

        if (data.MatchMonitoring.length > 0) {
            for (var key in data.MatchMonitoring[0].SuspiciousCases) {
                matchMonitoringReportService.gridOptions.columns.push(
                    { HeaderText: key, Width: 100, Name: key, HeaderAlign: "center", CellAlign: "center", CanResize: true });
            }
        }

        $("#matchMonitoringReport").fanexGrid(matchMonitoringReportService.gridOptions);
        $("#report-header").width($("#matchMonitoringReport").width());
        $("#report-header").removeClass("hidden");
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
            url += "&CaseId=" + caseId;
            url += "&EventDate=" + eventDate;

            window.open(url, '_blank');
            window.focus();
        });
    };

    return matchMonitoringReportService;
})(jQuery);