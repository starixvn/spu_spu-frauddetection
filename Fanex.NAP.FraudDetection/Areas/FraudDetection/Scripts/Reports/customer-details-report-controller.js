'use strict';
/*global customerDetailsReportModule*/

customerDetailsReportModule.controller('customerDetailsReportController',
['$window', 'customerDetailsReportModel',
function ($window, customerDetailsReportModel) {

    var vm = this;

    vm.CustInfo = customerDetailsReportModel.CustInfo;
    vm.Summary = customerDetailsReportModel.Summary;
    vm.EventChoices = customerDetailsReportModel.EventChoices;
    vm.FraudCaseDetails = customerDetailsReportModel.FraudCaseDetails;
    vm.LogNotes = customerDetailsReportModel.LogNotes;
    vm.DailyViolatedTickets = customerDetailsReportModel.DailyViolatedTickets;
    vm.GeneralInfo = customerDetailsReportModel.GeneralInfo;
    vm.Note = '';

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

    vm.addNote = function () {
        customerDetailsReportModel.addNote(vm.GeneralInfo.CustId, vm.Note).then(function () {
            vm.Note = '';
            vm.getLogNotes();
        });
    };

    customerDetailsReportModel.getCustInfoById(vm.GeneralInfo.CustId).then(function () {
        vm.CustInfo = customerDetailsReportModel.CustInfo;
    });

    customerDetailsReportModel.getFraudCaseDetails(vm.GeneralInfo.CustId, vm.GeneralInfo.FromDate, vm.GeneralInfo.ToDate).then(function () {
        vm.FraudCaseDetails = customerDetailsReportModel.FraudCaseDetails;

        vm.getLogNotes();

        //                customerDetailsReportModel.getDailyViolatedTickets(vm.GeneralInfo.CustId, vm.GeneralInfo.FromDate, vm.GeneralInfo.ToDate).then(function () {
        //                    vm.DailyViolatedTickets = customerDetailsReportModel.DailyViolatedTickets;

        customerDetailsReportModel.getWinlossStatistic(vm.GeneralInfo.CustId, vm.GeneralInfo.FromDate, vm.GeneralInfo.ToDate).then(function () {
            vm.Summary = customerDetailsReportModel.Summary;
            vm.EventChoices = customerDetailsReportModel.EventChoices;
            vm.SportsByMargin = customerDetailsReportModel.SportsByMargin;
            vm.BettypesByMargin = customerDetailsReportModel.BettypesByMargin;
        });
        //                });
    });
} ]);