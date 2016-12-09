'use strict';
/*global matchMonitoringReportModule*/

liveMatchMonitoringReportModule.controller('liveMatchMonitoringReportController',
['liveMatchMonitoringReportModel', '$scope',
function (liveMatchMonitoringReportModel, $scope) {
    var vm = this;
    var timeId = null,
        intervalId = null,
        oldFilter = null;

    vm.Leagues = [];
    vm.Sports = [];
    vm.RefreshOptions = liveMatchMonitoringReportModel.RefreshOptions;
    vm.LiveMatchMonitoringReport = liveMatchMonitoringReportModel.LiveMatchMonitoringReport;
    vm.filter = liveMatchMonitoringReportModel.filter;
    vm.RefreshSecond = 15;

    vm.queryLiveMatchMonitoringReport = function () {
        waitingDialog.show("Please wait...", { dialogSize: 'sm' });
        pageNumber = 0;

        if (vm.filter.LeagueId === -1) {
            vm.filter.LeagueIds = liveMatchMonitoringReportModel.getLeagueIdList();
        }
        else {
            vm.filter.LeagueIds = vm.filter.LeagueId;
        }

        if (!vm.filter.IsMainMarket) {
            vm.filter.IsMainMarket = null;
        }

        oldFilter = jQuery.extend(true, {}, vm.filter);
        liveMatchMonitoringReportModel.getAllMatches(vm.filter).then(function () {
            vm.LiveMatchMonitoringReport = liveMatchMonitoringReportModel.LiveMatchMonitoringReport;
            vm.RefreshSecond = 15;
            vm.CountDownToRefresh();
            waitingDialog.hide();
        });
    };

    vm.refreshLiveMatchMonitoringReport = function () {
        if (oldFilter) {
            $('#refreshIcon').addClass('loading-icon');
            $('#refreshIcon').remove('refresh-icon');
            liveMatchMonitoringReportModel.getAllMatches(oldFilter).then(function () {
                vm.LiveMatchMonitoringReport = liveMatchMonitoringReportModel.LiveMatchMonitoringReport;
                $('#refreshIcon').removeClass('loading-icon');
                $('#refreshIcon').addClass('refresh-icon');
                vm.CountDownToRefresh();
            });
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

    vm.CountDownToRefresh = function () {
        clearInterval(intervalId);
        var countdown = vm.RefreshSecond;
        $('#secondRefresh').text(countdown);

        if (countdown !== -1) {
            intervalId = setInterval(function () {
                countdown = countdown - 1;
                $('#secondRefresh').text(countdown);
                if (countdown === 0) {
                    clearInterval(intervalId);
                    vm.refreshLiveMatchMonitoringReport();
                    $('#secondRefresh').text(vm.RefreshSecond);
                }
            }, 1000);
        }
        else {
            $('#secondRefresh').text("");
        }
    };

    liveMatchMonitoringReportModel.initialDateTimePicker();

    vm.getSportsByDate(vm.filter.EventDate);
    vm.getLeaguesByDateAndSport(vm.filter.EventDate, vm.filter.SportId);
    $scope.$watch(function () {
        return vm.Sports.length > 0 && vm.Leagues.length > 0;
    }, function (newValue) {
        if (newValue) {
            vm.queryLiveMatchMonitoringReport();
        }
    });

    $scope.$watch(function () {
        return $('#secondRefresh').text() == "-1";
    }, function (newValue) {
        if (newValue) {
            $('#secondRefresh').text("");
        }
    });
}]);