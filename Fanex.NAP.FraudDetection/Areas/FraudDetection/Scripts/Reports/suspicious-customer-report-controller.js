'use strict';
/*global suspiciousCustomerReportModule*/

suspiciousCustomerReportModule.controller('suspiciousCustomerReportController',
['suspiciousCustomerReportModel',
function (suspiciousCustomerReportModel) {
    var vm = this;

    vm.EventDateFilters = suspiciousCustomerReportModel.EventDateFilters;
    vm.DelinquentStatuses = suspiciousCustomerReportModel.DelinquentStatuses;
    vm.SuspiciousCustomers = suspiciousCustomerReportModel.SuspiciousCustomers;

    vm.filter = {
        EventDateFrom: suspiciousCustomerReportModel.formatDate(new Date()),
        EventDateTo: suspiciousCustomerReportModel.formatDate(new Date()),
        CustName: '',
        ViolationTimes: '',
        DelinquentId: 1,
        GroupId: -1,
        PageSize: 50,
        PageIndex: 1
    };

    vm.eventDateId = 1;

    vm.querySuspiciousCustomers = function () {
        suspiciousCustomerReportModel.getSuspiciousCustomerReport(vm.filter).then(function () {
            vm.SuspiciousCustomers = suspiciousCustomerReportModel.SuspiciousCustomers;
        });
    };

    vm.changeEventDate = function () {
        suspiciousCustomerReportModel.changeEventDate(vm.eventDateId, vm.filter);
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

    suspiciousCustomerReportModel.initialDateTimePicker();
} ]);