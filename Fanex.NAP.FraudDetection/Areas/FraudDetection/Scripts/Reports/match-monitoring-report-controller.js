'use strict';
/*global matchMonitoringReportModule*/

matchMonitoringReportModule.controller('matchMonitoringReportController',
['matchMonitoringReportModel',
function (matchMonitoringReportModel) {
    var vm = this;

    vm.Leagues = matchMonitoringReportModel.Leagues;
    vm.MatchMonitoringReport = matchMonitoringReportModel.MatchMonitoringReport;
    vm.MatchStatuses = matchMonitoringReportModel.MatchStatuses;
    vm.SuspiciousStatuses = matchMonitoringReportModel.SuspiciousStatuses;
    vm.filter = matchMonitoringReportModel.filter;

    vm.queryMatchMonitoringReport = function () {
        waitingDialog.show("Please wait...", { dialogSize: 'sm' });

        matchMonitoringReportModel.getAllMatches(vm.filter).then(function () {
            vm.MatchMonitoringReport = matchMonitoringReportModel.MatchMonitoringReport;

            waitingDialog.hide();
        });
    };

    vm.changeEventDate = function () {
        vm.getLeaguesByDate(vm.filter.EventDate);
    };

    vm.openCalendar = function (dateTimePickerId) {
        matchMonitoringReportModel.openCalendar(dateTimePickerId);
    };

    vm.getLeaguesByDate = function (date) {
        matchMonitoringReportModel.getLeaguesByDate(date).then(function () {
            vm.Leagues = matchMonitoringReportModel.Leagues;
        });
    };

    vm.exportExcel = function () {
        waitingDialog.show("Please wait...", { dialogSize: 'sm' });
        FraudDetectionScripts.downloadFile("MatchMonitoring/ExportExcel", vm.filter);
        waitingDialog.hide();
    };

    matchMonitoringReportModel.initialDateTimePicker();

    vm.getLeaguesByDate(vm.filter.EventDate);
} ]);