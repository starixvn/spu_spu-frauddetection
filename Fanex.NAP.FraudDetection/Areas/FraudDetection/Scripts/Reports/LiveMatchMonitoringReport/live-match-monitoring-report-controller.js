'use strict';
/*global matchMonitoringReportModule*/

liveMatchMonitoringReportModule.controller('liveMatchMonitoringReportController',
['liveMatchMonitoringReportModel',
function (liveMatchMonitoringReportModel) {
    var vm = this;

    vm.Leagues = liveMatchMonitoringReportModel.Leagues;
    vm.Sports = liveMatchMonitoringReportModel.Sports;
    vm.MatchMonitoringReport = liveMatchMonitoringReportModel.MatchMonitoringReport;
    vm.MatchStatuses = liveMatchMonitoringReportModel.MatchStatuses;
    vm.SuspiciousStatuses = liveMatchMonitoringReportModel.SuspiciousStatuses;
    vm.filter = liveMatchMonitoringReportModel.filter;

    vm.queryMatchMonitoringReport = function () {
        waitingDialog.show("Please wait...", { dialogSize: 'sm' });

        if (vm.filter.LeagueId === -1) {
            vm.filter.LeagueIds = liveMatchMonitoringReportModel.getLeagueIdList();
        }
        else {
            vm.filter.LeagueIds = vm.filter.LeagueId;
        }

        if (!vm.filter.IsMainMarket) {
            vm.filter.IsMainMarket = null;
        }

        liveMatchMonitoringReportModel.getAllMatches(vm.filter).then(function () {
            vm.MatchMonitoringReport = liveMatchMonitoringReportModel.MatchMonitoringReport;

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
        liveMatchMonitoringReportModel.openCalendar(dateTimePickerId);
    };

    vm.getSportsByDate = function (date) {
        liveMatchMonitoringReportModel.getSportsByDate(date).then(function () {
            vm.Sports = liveMatchMonitoringReportModel.Sports;
        });
    };

    vm.getLeaguesByDateAndSport = function (date, sportId) {
        liveMatchMonitoringReportModel.getLeaguesByDateAndSport(date, sportId).then(function () {
            vm.Leagues = liveMatchMonitoringReportModel.Leagues;
        });
    };

    vm.exportExcel = function () {
        waitingDialog.show("Please wait...", { dialogSize: 'sm' });
        FraudDetectionScripts.downloadFile("MatchMonitoring/ExportExcel", vm.filter);
        waitingDialog.hide();
    };

    liveMatchMonitoringReportModel.initialDateTimePicker();

    vm.getSportsByDate(vm.filter.EventDate);

    vm.getLeaguesByDateAndSport(vm.filter.EventDate, vm.filter.SportId);
}]);