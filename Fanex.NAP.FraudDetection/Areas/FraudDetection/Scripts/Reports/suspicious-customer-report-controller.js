'use strict';
/*global suspiciousCustomerReportModule*/

suspiciousCustomerReportModule.controller('suspiciousCustomerReportController',
['suspiciousCustomerReportModel',
function (suspiciousCustomerReportModel) {
    var vm = this;

    vm.EventDateFilters = suspiciousCustomerReportModel.EventDateFilters;
    vm.DelinquentStatuses = suspiciousCustomerReportModel.DelinquentStatuses;
    vm.VerificationStatuses = suspiciousCustomerReportModel.VerificationStatuses;
    vm.SuspiciousCustomers = suspiciousCustomerReportModel.SuspiciousCustomers;
    vm.FraudCases = suspiciousCustomerReportModel.FraudCases;
    vm.filter = suspiciousCustomerReportModel.filter;

    vm.eventDateValue = 1;

    vm.generateSuspiciousCustomerReport = function () {
        vm.filter.PageSize = 50;
        vm.filter.PageIndex = 0;

        vm.querySuspiciousCustomers();
    };

    vm.querySuspiciousCustomers = function () {
        suspiciousCustomerReportModel.getSuspiciousCustomerReport(vm.filter).then(function () {
            vm.SuspiciousCustomers = suspiciousCustomerReportModel.SuspiciousCustomers;
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
            TotalViolations: vm.filter.TotalViolations,
            NewViolations: vm.filter.NewViolations,
            IsVerified: vm.filter.IsVerified,
            CaseId: vm.filter.CaseId,
            PageSize: vm.filter.PageSize,
            PageIndex: vm.filter.PageIndex,
            caseName: caseName
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