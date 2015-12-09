'use strict';
/*global suspiciousCustomerReportModule*/

suspiciousCustomerReportModule.factory('suspiciousCustomerReportModel',
['suspiciousCustomerReportFactory',
function (suspiciousCustomerReportFactory) {
    var suspiciousCustomerReportModel = {};

    suspiciousCustomerReportModel.SuspiciousCustomers = [];

    suspiciousCustomerReportModel.EventDateFilters = [
        { Value: 1, Name: "Today" },
        { Value: 2, Name: "Yesterday" },
        { Value: 3, Name: "Current Week" },
        { Value: 4, Name: "Last Week" },
        { Value: 5, Name: "Current Month" },
        { Value: 6, Name: "Last Month" },
        { Value: 7, Name: "Since Last Month" },
        { Value: 8, Name: "Last 3 Months" },
        { Value: 9, Name: "Last 6 Months" },
        { Value: 10, Name: "Specific Date" }
    ];

    suspiciousCustomerReportModel.DelinquentStatuses = [
        { Value: null, Name: "All" },
        { Value: true, Name: "Delinquent" },
        { Value: false, Name: "Not Delinquent" }
    ];

    suspiciousCustomerReportModel.VerificationStatuses = [
        { Value: null, Name: "All" },
        { Value: true, Name: "Verified" },
        { Value: false, Name: "Not Verified" }
    ];

    suspiciousCustomerReportModel.getSuspiciousCustomerReport = function (criteria) {
        return suspiciousCustomerReportFactory.getSuspiciousCustomerReport(criteria).success(function (customers) {
            suspiciousCustomerReportModel.SuspiciousCustomers = customers;
        });
    };

    suspiciousCustomerReportModel.changeEventDate = function (eventDateValue, filter) {
        var today = new Date();
        var fistDayOfWeek = today.getDate() - today.getDay() + 1;
        var startDate = today, endDate = today;

        switch (eventDateValue) {
            case 1:
                filter.EventDateFrom = suspiciousCustomerReportModel.formatDate(startDate);
                filter.EventDateTo = suspiciousCustomerReportModel.formatDate(endDate);
                break;
            case 2:
                var yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

                filter.EventDateFrom = suspiciousCustomerReportModel.formatDate(yesterday);
                filter.EventDateTo = suspiciousCustomerReportModel.formatDate(yesterday);
                break;
            case 3:
                startDate = new Date(today.getFullYear(), today.getMonth(), fistDayOfWeek);
                endDate = new Date(today.getFullYear(), today.getMonth(), fistDayOfWeek + 6);

                filter.EventDateFrom = suspiciousCustomerReportModel.formatDate(startDate);
                filter.EventDateTo = suspiciousCustomerReportModel.formatDate(endDate);
                break;
            case 4:
                startDate = new Date(today.getFullYear(), today.getMonth(), fistDayOfWeek - 7);
                endDate = new Date(today.getFullYear(), today.getMonth(), fistDayOfWeek - 1);

                filter.EventDateFrom = suspiciousCustomerReportModel.formatDate(startDate);
                filter.EventDateTo = suspiciousCustomerReportModel.formatDate(endDate);
                break;
            case 5:
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

                filter.EventDateFrom = suspiciousCustomerReportModel.formatDate(startDate);
                filter.EventDateTo = suspiciousCustomerReportModel.formatDate(endDate);
                break;
            case 6:
                startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                endDate = new Date(today.getFullYear(), today.getMonth(), 0);

                filter.EventDateFrom = suspiciousCustomerReportModel.formatDate(startDate);
                filter.EventDateTo = suspiciousCustomerReportModel.formatDate(endDate);
                break;
            case 7:
                startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                endDate = today;

                filter.EventDateFrom = suspiciousCustomerReportModel.formatDate(startDate);
                filter.EventDateTo = suspiciousCustomerReportModel.formatDate(endDate);
                break;
            case 8:
                startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
                endDate = today;

                filter.EventDateFrom = suspiciousCustomerReportModel.formatDate(startDate);
                filter.EventDateTo = suspiciousCustomerReportModel.formatDate(endDate);
                break;
            case 9:
                startDate = new Date(today.getFullYear(), today.getMonth() - 5, 1);
                endDate = today;

                filter.EventDateFrom = suspiciousCustomerReportModel.formatDate(startDate);
                filter.EventDateTo = suspiciousCustomerReportModel.formatDate(endDate);
                break;
            case 10:
                break;
            default:
                break;
        }
    };

    suspiciousCustomerReportModel.initialDateTimePicker = function () {
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

    suspiciousCustomerReportModel.openCalendar = function (dateTimePickerId) {
        $(dateTimePickerId).datepicker('show');
    };

    suspiciousCustomerReportModel.formatDate = function (date) {
        var d = date.getDate();
        var m = date.getMonth() + 1;
        var y = date.getFullYear();
        var result = '' + (m <= 9 ? '0' + m : m) + '/' + (d <= 9 ? '0' + d : d) + '/' + y;

        return result;
    };

    suspiciousCustomerReportModel.getNotes = function (custId) {
        alert(custId);
    };

    return suspiciousCustomerReportModel;
} ]);