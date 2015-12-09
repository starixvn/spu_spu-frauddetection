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

    vm.filter = {
        EventDateFrom: suspiciousCustomerReportModel.formatDate(new Date()),
        EventDateTo: suspiciousCustomerReportModel.formatDate(new Date()),
        CustName: '',
        TotalViolations: '',
        NewViolations: '',
        IsDelinquent: null,
        IsVerified: null,
        PageSize: 50,
        PageIndex: 0
    };

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
        vm.eventDateId = 10;
    };

    vm.exportExcel = function () {
        waitingDialog.show("Please wait...", { dialogSize: 'sm' });
        FraudDetectionScripts.downloadFile("SuspiciousCustomer/ExportExcel", vm.filter);
        waitingDialog.hide();
    };

    vm.pagingReport = function (pageIndex, itemsPerPage) {
        vm.filter.PageSize = itemsPerPage;
        vm.filter.PageIndex = pageIndex;

        vm.querySuspiciousCustomers();
    };

    suspiciousCustomerReportModel.initialDateTimePicker();
} ]);