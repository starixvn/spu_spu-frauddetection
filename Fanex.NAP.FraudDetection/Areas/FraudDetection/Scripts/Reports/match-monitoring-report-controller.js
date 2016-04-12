'use strict';
/*global matchMonitoringReportModule*/

matchMonitoringReportModule.controller('matchMonitoringReportController',
['matchMonitoringReportModel',
function (matchMonitoringReportModel) {
    var vm = this;

    vm.Leagues = matchMonitoringReportModel.Leagues;
    vm.Sports = matchMonitoringReportModel.Sports;
    vm.MatchMonitoringReport = matchMonitoringReportModel.MatchMonitoringReport;
    vm.MatchStatuses = matchMonitoringReportModel.MatchStatuses;
    vm.SuspiciousStatuses = matchMonitoringReportModel.SuspiciousStatuses;
    vm.filter = matchMonitoringReportModel.filter;

    vm.queryMatchMonitoringReport = function () {
        waitingDialog.show("Please wait...", { dialogSize: 'sm' });

        if (vm.filter.LeagueId === -1) {
            vm.filter.LeagueIds = matchMonitoringReportModel.getLeagueIdList();
        }
        else {
            vm.filter.LeagueIds = vm.filter.LeagueId;
        }

        if (!vm.filter.IsMainMarket) {
            vm.filter.IsMainMarket = null;
        }

        matchMonitoringReportModel.getAllMatches(vm.filter).then(function () {
            vm.MatchMonitoringReport = matchMonitoringReportModel.MatchMonitoringReport;

            waitingDialog.hide();
        });
    };

    vm.changeEventDate = function () {
        vm.filter.LeagueId = -1;

        vm.getLeaguesByDateAndSport(vm.filter.EventDate, vm.filter.SportId);
    };

    vm.changeSport = function () {
        vm.filter.LeagueId = -1;

        vm.getLeaguesByDateAndSport(vm.filter.EventDate, vm.filter.SportId);
    };

    vm.openCalendar = function (dateTimePickerId) {
        matchMonitoringReportModel.openCalendar(dateTimePickerId);
    };

    vm.getSportsByDate = function (date) {
        matchMonitoringReportModel.getSportsByDate(date).then(function () {
            vm.Sports = matchMonitoringReportModel.Sports;
        });
    };

    vm.getLeaguesByDateAndSport = function (date, sportId) {
        matchMonitoringReportModel.getLeaguesByDateAndSport(date, sportId).then(function () {
            vm.Leagues = matchMonitoringReportModel.Leagues;
        });
    };

    vm.exportExcel = function () {
        waitingDialog.show("Please wait...", { dialogSize: 'sm' });
        FraudDetectionScripts.downloadFile("MatchMonitoring/ExportExcel", vm.filter);
        waitingDialog.hide();
    };

    matchMonitoringReportModel.initialDateTimePicker();

    vm.getSportsByDate(vm.filter.EventDate);

    vm.getLeaguesByDateAndSport(vm.filter.EventDate, vm.filter.SportId);
}]);