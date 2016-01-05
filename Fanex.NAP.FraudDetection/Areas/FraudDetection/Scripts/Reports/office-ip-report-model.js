'use strict';
/*global officeIPsReportModule*/

officeIPsReportModule.factory('officeIPsReportModel',
['officeIPsReportFactory',
function (officeIPsReportFactory) {
    var officeIPsReportModel = {};

    officeIPsReportModel.SuspiciousTickets = [];

    officeIPsReportModel.filter = {
        FromDate: formatDate(new Date()),
        ToDate: formatDate(new Date())
    };

    officeIPsReportModel.getDailyViolatedTickets = function (fromDate, toDate) {
        return officeIPsReportFactory.getSuspiciousTickets(fromDate, toDate).success(function (tickets) {
            officeIPsReportModel.SuspiciousTickets = tickets;
        });
    };

    officeIPsReportModel.initialDateTimePicker = function () {
        var today = new Date();

        $('#eventDateFrom').datepicker({
            dateFormat: "mm/dd/yy"
        });

        $('#eventDateTo').datepicker({
            dateFormat: "mm/dd/yy"
        });

        $('#eventDateFrom').datepicker("setDate", today);
        $('#eventDateTo').datepicker("setDate", today);
    };

    officeIPsReportModel.openCalendar = function (dateTimePickerId) {
        $(dateTimePickerId).datepicker('show');
    };

    function formatDate(date) {
        var d = date.getDate();
        var m = date.getMonth() + 1;
        var y = date.getFullYear();
        var result = '' + (m <= 9 ? '0' + m : m) + '/' + (d <= 9 ? '0' + d : d) + '/' + y;

        return result;
    }

    return officeIPsReportModel;
} ]);