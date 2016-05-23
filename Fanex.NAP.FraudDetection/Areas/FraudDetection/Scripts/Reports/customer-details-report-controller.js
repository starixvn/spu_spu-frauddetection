'use strict';
/*global customerDetailsReportModule*/

customerDetailsReportModule.controller('customerDetailsReportController',
['$window', 'customerDetailsReportModel',
function ($window, customerDetailsReportModel) {

    var vm = this;

    vm.CustInfo = customerDetailsReportModel.CustInfo;
    vm.Summary = customerDetailsReportModel.Summary;
    vm.WinlossMonthly = customerDetailsReportModel.WinlossMonthly;
    vm.EventChoices = customerDetailsReportModel.EventChoices;
    vm.SportsByMargin = customerDetailsReportModel.SportsByMargin;
    vm.BettypesByMargin = customerDetailsReportModel.BettypesByMargin;
    vm.FraudCaseDetails = customerDetailsReportModel.FraudCaseDetails;
    vm.LogNotes = customerDetailsReportModel.LogNotes;
    vm.DailyViolatedTickets = customerDetailsReportModel.DailyViolatedTickets;
    vm.GeneralInfo = customerDetailsReportModel.GeneralInfo;
    vm.EditAssingee = customerDetailsReportModel.EditAssingee;
    vm.IsHost = customerDetailsReportModel.IsHost;
    vm.HasRemoveLogNotePermission = customerDetailsReportModel.HasRemoveLogNotePermission;
    vm.Note = '';
    vm.DailyViolatedTicketsLoaded = false;
    vm.WinlossStatisticLoaded = false;
    vm.HedgeInfo = 'The Hedge Account will always be marked as "Verified" on Suspicious Customer report.';

    vm.editAssingee = function () {
        vm.EditAssingee.isEditAssignee = !vm.EditAssingee.isEditAssignee;
    };

    vm.cancelEditAssingee = function () {
        vm.EditAssingee.isEditAssignee = !vm.EditAssingee.isEditAssignee;
    };

    vm.saveEditAssingee = function () {
        vm.EditAssingee.isEditAssignee = !vm.EditAssingee.isEditAssignee;

        var assignees = [];
        angular.forEach(vm.EditAssingee.AssigneesTicked, function (assignee) {
            assignees.push(assignee.name);
        });

        vm.EditAssingee.assignees = assignees.join(',');

        customerDetailsReportModel.insertAssignees(vm.GeneralInfo.CustId, vm.EditAssingee.assignees);
    };

    vm.getLogNotes = function () {
        customerDetailsReportModel.getLogNotes(vm.GeneralInfo.CustId).then(function () {
            vm.LogNotes = customerDetailsReportModel.LogNotes;
        });
    };

    vm.getWinlossMonthly = function () {
        var toolTip = $("#btn_customermonthlywinloss");
        toolTip.attr('title', 'tooltip');
        toolTip.tooltip({
            content: "<b style='color: red;'>Loading…</b>",
            position: {
                my: "left top",
                at: "left+30 top+20"
            },
            track: true,
            show: {
                effect: "slideDown"
            }
        }).on('mouseout focusout mouseover mouseenter mouseleave', function (eventTooltip) {
            eventTooltip.stopImmediatePropagation();
        });

        toolTip.tooltip('open');

        customerDetailsReportModel.getWinlossMonthly(vm.GeneralInfo.CustId, vm.GeneralInfo.FromDate, vm.GeneralInfo.ToDate).then(function () {
            vm.WinlossMonthly = customerDetailsReportModel.WinlossMonthly;

            toolTip.tooltip('close');
            toolTip.tooltip({
                content: createMonthlyWinlossTable(customerDetailsReportModel.WinlossMonthly),
                position: {
                    my: "left top",
                    at: "left+30 top+20"
                },
                track: true,
                show: {
                    effect: "slideDown"
                }
            }).on('mouseout focusout mouseover mouseenter mouseleave', function (eventTooltip) {
                eventTooltip.stopImmediatePropagation();
            });

            toolTip.tooltip('open');

            $(document).on('mousedown', function (e) {
                var container = $(".ui-tooltip");
                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    toolTip.tooltip('option', { disabled: true }).tooltip('close');
                    toolTip.tooltip("destroy");
                    $(document).off('mousedown');
                    toolTip.removeAttr('title');
                }
            });
        });
    };

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function createMonthlyWinlossTable(winlossMonthly) {
        var result = "<table class='customer-report-statistic'>" +
            "<tr><th>Month</th><th>Turnover</th><th>Win Loss</th><th>Margin(%)</th><th>Bet Count</th></tr>";

        for (var i = 0; i < winlossMonthly.length; i++) {
            var month = winlossMonthly[i].ReportDate;
            var turnover = parseFloat(winlossMonthly[i].Turnover).toFixed(2);
            var winloss = parseFloat(winlossMonthly[i].Winloss).toFixed(2);
            var margin = parseFloat(winlossMonthly[i].Margin).toFixed(2);
            var betcount = winlossMonthly[i].BetCount;

            result += "<tr><td style='text-align:center;'>" + month +
                "</td><td style='text-align:right;'>" + numberWithCommas(turnover) +
                "</td><td style='text-align:right;'>" + numberWithCommas(winloss) +
                "</td><td style='text-align:right;'>" + margin +
                "</td><td style='text-align:right;'>" + numberWithCommas(betcount) +
                "</td></tr>";
        }

        result += "</table>";

        return result;
    };

    vm.getFraudCaseDetails = function () {
        customerDetailsReportModel.getFraudCaseDetails(vm.GeneralInfo.CustId, vm.GeneralInfo.FromDate, vm.GeneralInfo.ToDate).then(function () {
            vm.FraudCaseDetails = customerDetailsReportModel.FraudCaseDetails;
        });
    };

    vm.goBack = function () {
        $window.history.back();
    };

    vm.updateDelinquency = function () {
        customerDetailsReportModel.updateDelinquency(vm.GeneralInfo.CustId, vm.CustInfo.IsDelinquent).then(function () {
            vm.getLogNotes();
        });
    };

    vm.updateHedgeAccount = function () {
        customerDetailsReportModel.updateHedgeAccount(vm.GeneralInfo.CustId, vm.CustInfo.IsHedge).then(function () {
            vm.getLogNotes();
        });
    };

    vm.addNote = function () {
        customerDetailsReportModel.addNote(vm.GeneralInfo.CustId, vm.Note).then(function () {
            vm.Note = '';
            vm.getLogNotes();
        });
    };

    customerDetailsReportModel.getHostPermission().then(function () {
        vm.IsHost = customerDetailsReportModel.IsHost;
    });

    customerDetailsReportModel.getRemoveLogNotePermission().then(function () {
        vm.HasRemoveLogNotePermission = customerDetailsReportModel.HasRemoveLogNotePermission;
    });

    customerDetailsReportModel.getCustInfoById(vm.GeneralInfo.CustId).then(function () {
        vm.CustInfo = customerDetailsReportModel.CustInfo;
    });

    customerDetailsReportModel.getAssigneesById(vm.GeneralInfo.CustId).then(function () {
        vm.EditAssingee.assignees = customerDetailsReportModel.EditAssingee.assignees;

        customerDetailsReportModel.getUsers().then(function () {
            vm.EditAssingee.Assignees = customerDetailsReportModel.EditAssingee.Assignees;

            var assignees = vm.EditAssingee.assignees.split(',');

            angular.forEach(assignees, function (assignee) {
                angular.forEach(vm.EditAssingee.Assignees, function (item) {
                    if (item.name === assignee) {
                        item.ticked = true;

                        vm.EditAssingee.AssigneesTicked.push(item);
                    }
                });
            });
        });
    });

    customerDetailsReportModel.getFraudCaseDetails(vm.GeneralInfo.CustId, vm.GeneralInfo.FromDate, vm.GeneralInfo.ToDate).then(function () {
        vm.FraudCaseDetails = customerDetailsReportModel.FraudCaseDetails;

        vm.getLogNotes();

        customerDetailsReportModel.getDailyViolatedTickets(vm.GeneralInfo.CustId, vm.GeneralInfo.FromDate, vm.GeneralInfo.ToDate).then(function () {
            vm.DailyViolatedTickets = customerDetailsReportModel.DailyViolatedTickets;

            vm.DailyViolatedTicketsLoaded = true;
        });

        customerDetailsReportModel.getWinlossStatistic(vm.GeneralInfo.CustId, vm.GeneralInfo.FromDate, vm.GeneralInfo.ToDate).then(function () {
            vm.Summary = customerDetailsReportModel.Summary;
            vm.EventChoices = customerDetailsReportModel.EventChoices;
            vm.SportsByMargin = customerDetailsReportModel.SportsByMargin;
            vm.BettypesByMargin = customerDetailsReportModel.BettypesByMargin;

            vm.WinlossStatisticLoaded = true;
        });
    });
} ]);