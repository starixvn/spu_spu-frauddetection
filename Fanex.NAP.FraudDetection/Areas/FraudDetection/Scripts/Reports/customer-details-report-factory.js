'use strict';
/*global customerDetailsReportModule*/

customerDetailsReportModule.factory('customerDetailsReportFactory', ['$http', function ($http) {
    return {
        getCustInfoById: function (custId) {
            var url = SPU.getAbsoluteUrl("CustomerDetails/GetCustInfoById");

            return $http.get(url, {
                params:
                    { custId: custId }
            });
        },

        getFraudCaseDetails: function (custId, fromDate, toDate) {
            var url = SPU.getAbsoluteUrl("CustomerDetails/GetFraudCaseDetails");

            return $http.get(url, {
                params:
                    { custId: custId, fromDate: fromDate, toDate: toDate }
            });
        },

        getLogNotes: function (custId) {
            var url = SPU.getAbsoluteUrl("CustomerDetails/GetLogNotes");

            return $http.get(url, {
                params:
                    { custId: custId }
            });
        },

        getWinlossStatistic: function (custId, fromDate, toDate) {
            var url = SPU.getAbsoluteUrl("CustomerDetails/GetWinlossStatistic");

            return $http.get(url, {
                params:
                    { custId: custId, fromDate: fromDate, toDate: toDate }
            });
        },

        getDailyViolatedTickets: function (custId, fromDate, toDate) {
            var url = SPU.getAbsoluteUrl("CustomerDetails/GetDailyViolatedTickets");

            return $http.get(url, {
                params:
                    { custId: custId, fromDate: fromDate, toDate: toDate }
            });
        },

        addNote: function (custId, note) {
            var url = SPU.getAbsoluteUrl("CustomerDetails/AddNote");

            return $http.get(url, {
                params:
                    { custId: custId, note: note }
            });
        },

        verifyCustomer: function (custId, caseId) {
            var url = SPU.getAbsoluteUrl("CustomerDetails/VerifyCustomer");

            return $http.get(url, {
                params:
                    { custId: custId, caseId: caseId }
            });
        },

        updateDelinquency: function (custId, isDelinquent) {
            var url = SPU.getAbsoluteUrl("CustomerDetails/UpdateDelinquency");

            return $http.get(url, {
                params:
                    { custId: custId, isDelinquent: isDelinquent }
            });
        }
    };
} ]);