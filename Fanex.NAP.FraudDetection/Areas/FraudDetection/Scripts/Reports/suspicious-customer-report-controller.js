'use strict';
/*global suspiciousCustomerReportModule*/

suspiciousCustomerReportModule.controller('suspiciousCustomerReportController',
['suspiciousCustomerReportModel',
function (suspiciousCustomerReportModel) {
    var vm = this;

    vm.EventDateFilters = suspiciousCustomerReportModel.EventDateFilters;
    vm.DelinquentStatuses = suspiciousCustomerReportModel.DelinquentStatuses;
    vm.HedgeStatuses = suspiciousCustomerReportModel.HedgeStatuses;
    vm.VerificationStatuses = suspiciousCustomerReportModel.VerificationStatuses;
    vm.SuspiciousCustomers = suspiciousCustomerReportModel.SuspiciousCustomers;
    vm.FraudCases = suspiciousCustomerReportModel.FraudCases;
    vm.filter = suspiciousCustomerReportModel.filter;
    vm.Generated = false;

    vm.eventDateValue = 1;

    vm.generateSuspiciousCustomerReport = function () {
        vm.querySuspiciousCustomers();

        vm.Generated = true;
    };

    vm.querySuspiciousCustomers = function () {
        waitingDialog.show("Please wait...", { dialogSize: 'sm' });
        
        suspiciousCustomerReportModel.getSuspiciousCustomerReport(vm.filter).then(function () {
            vm.SuspiciousCustomers = suspiciousCustomerReportModel.SuspiciousCustomers;

            waitingDialog.hide();
        });
    };

    vm.changeEventDate = function () {
        suspiciousCustomerReportModel.changeEventDate(vm.eventDateValue, vm.filter);
    };

    vm.openCalendar = function (dateTimePickerId) {
        suspiciousCustomerReportModel.openCalendar(dateTimePickerId);
    };

    vm.changeEventDateFromTo = function () {
        vm.eventDateValue = 10;
    };

    vm.exportExcel = function () {
        waitingDialog.show("Please wait...", { dialogSize: 'sm' });
        var index = vm.FraudCases.map(function (e) {
            return e.CaseId;
        }).indexOf(vm.filter.CaseId);

        var caseName = vm.FraudCases[index].CaseName;

        var criteria = {
            EventDateFrom: vm.filter.EventDateFrom,
            EventDateTo: vm.filter.EventDateTo,
            CustName: vm.filter.CustName,
            IsVerified: vm.filter.IsVerified,
            CaseId: vm.filter.CaseId,
            caseName: caseName,
            IsDelinquent: vm.filter.IsDelinquent,
            IsHedge: vm.filter.IsHedge
        };

        FraudDetectionScripts.downloadFile("SuspiciousCustomer/ExportExcel", criteria);
        waitingDialog.hide();
    };

    vm.pagingReport = function (pageIndex, itemsPerPage) {
        vm.filter.PageSize = itemsPerPage;
        vm.filter.PageIndex = pageIndex;

        vm.querySuspiciousCustomers();
    };

    suspiciousCustomerReportModel.getAllCases().then(function () {
        vm.FraudCases = suspiciousCustomerReportModel.FraudCases;

        var defaultCase = {
            CaseId: 0,
            CaseName: 'All'
        };

        vm.FraudCases.unshift(defaultCase);
    });

    suspiciousCustomerReportModel.initialDateTimePicker();
} ]);