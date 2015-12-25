'use strict';
/*global matchMonitoringReportModule*/

matchMonitoringReportModule.factory('matchMonitoringReportModel',
['matchMonitoringReportFactory',
function (matchMonitoringReportFactory) {
    var matchMonitoringReportModel = {};

    matchMonitoringReportModel.Leagues = [];
    matchMonitoringReportModel.MatchMonitoringReport = {};
    matchMonitoringReportModel.CaseId = '';

    matchMonitoringReportModel.MatchStatuses = [
        { Value: 'All', Name: "All" },
        { Value: 'completed', Name: "Completed" },
        { Value: 'running', Name: "Running" }
    ];

    matchMonitoringReportModel.SuspiciousStatuses = [
        { Value: 0, Name: "All" },
        { Value: 1, Name: "Yes" },
        { Value: 2, Name: "No" }
    ];

    matchMonitoringReportModel.filter = {
        EventDate: formatDate(new Date()),
        LeagueId: -1,
        MatchCode: '',
        MatchStatus: 'All',
        SuspiciousStatus: 0
    };

    matchMonitoringReportModel.getLeaguesByDate = function (date) {
        return matchMonitoringReportFactory.getLeaguesByDate(date).success(function (leagues) {
            matchMonitoringReportModel.Leagues = leagues;

            var defaultLeague = {
                LeagueId: -1,
                LeagueName: 'All Leagues'
            };

            matchMonitoringReportModel.Leagues.unshift(defaultLeague);
        });
    };

    matchMonitoringReportModel.getAllMatches = function (criteria) {
        return matchMonitoringReportFactory.getAllMatches(criteria).success(function (report) {
            matchMonitoringReportModel.MatchMonitoringReport = report;
        });
    };

    matchMonitoringReportModel.getCaseIdFromCaseName = function (caseName) {
        return matchMonitoringReportFactory.getCaseIdFromCaseName(caseName).success(function (caseId) {
            matchMonitoringReportModel.CaseId = caseId;
        });
    };

    matchMonitoringReportModel.initialDateTimePicker = function () {
        var today = new Date();

        $('#eventDate').datepicker({
            dateFormat: "mm/dd/yy"
        });

        $('#eventDate').datepicker("setDate", today);
    };

    matchMonitoringReportModel.openCalendar = function (dateTimePickerId) {
        $(dateTimePickerId).datepicker('show');
    };

    function formatDate(date) {
        var d = date.getDate();
        var m = date.getMonth() + 1;
        var y = date.getFullYear();
        var result = '' + (m <= 9 ? '0' + m : m) + '/' + (d <= 9 ? '0' + d : d) + '/' + y;

        return result;
    }

    return matchMonitoringReportModel;
} ]);