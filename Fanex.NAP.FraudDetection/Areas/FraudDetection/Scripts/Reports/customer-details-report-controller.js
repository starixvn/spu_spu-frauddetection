'use strict';
/*global customerDetailsReportModule*/

customerDetailsReportModule.controller('customerDetailsReportController',
['$window', 'customerDetailsReportModel',
function ($window, customerDetailsReportModel) {

    var vm = this;

    vm.CustInfo = customerDetailsReportModel.CustInfo;
    vm.Summary = customerDetailsReportModel.Summary;
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