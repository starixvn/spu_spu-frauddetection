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
                "MatchStatus": $("#MatchStatus").val(),
                "SuspiciousStatus": $("#SuspiciousStatus").val()
            };

            matchMonitoringReportFactory.Search(param).success(function (data) {
                matchMonitoringReportService.renderReportTable(data);

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

var waitingDialog = waitingDialog || (function ($) {
    'use strict';

    // Creating modal dialog's DOM
    var $dialog = $(
        '<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
        '<div class="modal-dialog modal-m">' +
        '<div class="modal-content">' +
        '<div class="modal-header"><h4 style="margin:0;"></h4></div>' +
        '<div class="modal-body">' +
        '<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
        '</div>' +
        '</div></div></div>');

    return {
        /**
        * Opens our dialog
        * @param message Custom message
        * @param options Custom options:
        options.dialogSize - bootstrap postfix for dialog size, e.g. "sm", "m";
        options.progressType - bootstrap postfix for progress bar type, e.g. "success", "warning".
        */
        show: function (message, options) {
            // Assigning defaults
            if (typeof options === 'undefined') {
                options = {};
            }
            if (typeof message === 'undefined') {
                message = 'Loading';
            }
            var settings = $.extend({
                dialogSize: 'm',
                progressType: '',
                onHide: null // This callback runs after the dialog was hidden
            }, options);

            // Configuring dialog
            $dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
            $dialog.find('.progress-bar').attr('class', 'progress-bar');
            if (settings.progressType) {
                $dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
            }
            $dialog.find('h4').text(message);
            // Adding callbacks
            if (typeof settings.onHide === 'function') {
                $dialog.off('hidden.bs.modal').on('hidden.bs.modal', function () {
                    settings.onHide.call($dialog);
                });
            }
            // Opening dialog
            $dialog.modal();
        },
        /**
        * Closes dialog
        */
        hide: function () {
            $dialog.modal('hide');
        }
    };
})(jQuery);