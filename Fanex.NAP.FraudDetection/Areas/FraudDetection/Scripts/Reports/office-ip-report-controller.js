'use strict';
/*global officeIPsReportModule*/

officeIPsReportModule.controller('officeIPsReportController',
['officeIPsReportModel',
function (officeIPsReportModel) {

    var vm = this;

    vm.SuspiciousTickets = officeIPsReportModel.SuspiciousTickets;
    vm.filter = officeIPsReportModel.filter;
    vm.isReady = false;

    vm.query = function () {
        waitingDialog.show("Please wait...", { dialogSize: 'sm' });

        officeIPsReportModel.getDailyViolatedTickets(vm.filter.FromDate, vm.filter.ToDate).then(function () {
            vm.SuspiciousTickets = officeIPsReportModel.SuspiciousTickets;

            waitingDialog.hide();
            vm.isReady = true;
        });
    };

    vm.openCalendar = function (dateTimePickerId) {
        officeIPsReportModel.openCalendar(dateTimePickerId);
    };

    vm.exportExcel = function () {
        waitingDialog.show("Please wait...", { dialogSize: 'sm' });
        FraudDetectionScripts.downloadFile("OfficeIPs/ExportExcel", vm.filter);
        waitingDialog.hide();
    };

    officeIPsReportModel.initialDateTimePicker();
} ]);