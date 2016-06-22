'use strict';
/*global matchMonitoringReportModule*/

liveMatchMonitoringReportModule.factory('liveMatchMonitoringReportModel',
['liveMatchMonitoringReportFactory',
function (liveMatchMonitoringReportFactory) {
    var liveMatchMonitoringReportModel = {};

    liveMatchMonitoringReportModel.Leagues = [];
    liveMatchMonitoringReportModel.Sports = [];
    liveMatchMonitoringReportModel.MatchMonitoringReport = {};
    liveMatchMonitoringReportModel.CaseId = '';
    liveMatchMonitoringReportModel.IsUpdated = false;

    liveMatchMonitoringReportModel.filter = {
        EventDate: formatDate(new Date()),
        LeagueId: -1,
        LeagueIds: '',
        SportId: -1,
        MatchCode: '',
        IsMainMarket: true
    };

    liveMatchMonitoringReportModel.getSportsByDate = function (date) {
        return liveMatchMonitoringReportFactory.getSportsByDate(date).success(function (sports) {
            liveMatchMonitoringReportModel.Sports = sports;

            var defaultSport = {
                SportId: -1,
                SportName: 'All Sports'
            };

            liveMatchMonitoringReportModel.Sports.unshift(defaultSport);
        });
    };

    liveMatchMonitoringReportModel.getLeaguesByDateAndSport = function (date, sportId) {
        return liveMatchMonitoringReportFactory.getLeaguesByDateAndSport(date, sportId).success(function (leagues) {
            liveMatchMonitoringReportModel.Leagues = leagues;

            var defaultLeague = {
                LeagueId: -1,
                LeagueName: 'All Leagues'
            };

            liveMatchMonitoringReportModel.Leagues.unshift(defaultLeague);
        });
    };



    liveMatchMonitoringReportModel.getLeaguesByDate = function (date) {
        return liveMatchMonitoringReportFactory.getLeaguesByDate(date).success(function (leagues) {
            liveMatchMonitoringReportModel.Leagues = leagues;

            var defaultLeague = {
                LeagueId: -1,
                LeagueName: 'All Leagues'
            };

            liveMatchMonitoringReportModel.Leagues.unshift(defaultLeague);
        });
    };

    liveMatchMonitoringReportModel.getAllMatches = function (criteria) {
        return liveMatchMonitoringReportFactory.getAllMatches(criteria).success(function (report) {
            liveMatchMonitoringReportModel.MatchMonitoringReport = report;
        });
    };

    liveMatchMonitoringReportModel.getCaseIdFromCaseName = function (caseName) {
        return liveMatchMonitoringReportFactory.getCaseIdFromCaseName(caseName).success(function (caseId) {
            liveMatchMonitoringReportModel.CaseId = caseId;
        });
    };

    liveMatchMonitoringReportModel.updateDelinquency = function (matchId, isActive) {
        return liveMatchMonitoringReportFactory.updateDelinquency(matchId, isActive).success(function (result) {
            liveMatchMonitoringReportModel.IsUpdated = result.IsSuccessful;
            AlertService.showAlert(result);
        });
    };

    liveMatchMonitoringReportModel.updateVerification = function (matchId, isActive) {
        return liveMatchMonitoringReportFactory.updateVerification(matchId, isActive).success(function (result) {
            liveMatchMonitoringReportModel.IsUpdated = result.IsSuccessful;
            AlertService.showAlert(result);
        });
    };

    liveMatchMonitoringReportModel.initialDateTimePicker = function () {
        var today = new Date();

        $('#eventDate').datepicker({
            dateFormat: "mm/dd/yy"
        });

        $('#eventDate').datepicker("setDate", today);
    };

    liveMatchMonitoringReportModel.getLeagueIdList = function () {
        var result = [];

        angular.forEach(liveMatchMonitoringReportModel.Leagues, function (league) {
            result.push(league.LeagueId);
        });

        return result.join(',');
    };

    liveMatchMonitoringReportModel.openCalendar = function (dateTimePickerId) {
        $(dateTimePickerId).datepicker('show');
    };

    function formatDate(date) {
        var d = date.getDate();
        var m = date.getMonth() + 1;
        var y = date.getFullYear();
        var result = '' + (m <= 9 ? '0' + m : m) + '/' + (d <= 9 ? '0' + d : d) + '/' + y;

        return result;
    }

    return liveMatchMonitoringReportModel;
}]);