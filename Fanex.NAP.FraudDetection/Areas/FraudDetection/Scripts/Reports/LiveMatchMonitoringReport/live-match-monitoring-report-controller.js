'use strict';
/*global matchMonitoringReportModule*/

liveMatchMonitoringReportModule.controller('liveMatchMonitoringReportController',
['liveMatchMonitoringReportModel',
function (liveMatchMonitoringReportModel) {
    var vm = this;
    var timeId = null;

    vm.Leagues = liveMatchMonitoringReportModel.Leagues;
    vm.Sports = liveMatchMonitoringReportModel.Sports;
    vm.RefreshOptions = liveMatchMonitoringReportModel.RefreshOptions;
    vm.LiveMatchMonitoringReport = liveMatchMonitoringReportModel.LiveMatchMonitoringReport;
    vm.filter = liveMatchMonitoringReportModel.filter;
    vm.RefreshSecond = 15;

    vm.queryLiveMatchMonitoringReport = function () {
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
            vm.LiveMatchMonitoringReport = liveMatchMonitoringReportModel.LiveMatchMonitoringReport;
            vm.RefreshSecond = 15;
            vm.refreshLiveMatchMonitoringReport();
            waitingDialog.hide();
        });
    };

    vm.refreshLiveMatchMonitoringReport = function () {
        clearInterval(timeId);
        if (vm.RefreshSecond !== -1) {
            timeId = setInterval(function () {
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
                    vm.LiveMatchMonitoringReport = liveMatchMonitoringReportModel.LiveMatchMonitoringReport;
                });
            }, (vm.RefreshSecond * 1000));
        }
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

    liveMatchMonitoringReportModel.initialDateTimePicker();

    vm.getSportsByDate(vm.filter.EventDate);

    vm.getLeaguesByDateAndSport(vm.filter.EventDate, vm.filter.SportId);
}]);