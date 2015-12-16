'use strict';
/*global customerDetailsReportModule*/

customerDetailsReportModule.factory('customerDetailsReportFactory', ['$http', function ($http) {
    return {
        getCustInfoById: function (custId) {
            return $http.get('/CustomerDetails/GetCustInfoById', {
                params:
                    { custId: custId }
            });
        },

        getFraudCaseDetails: function (custId, fromDate, toDate) {
            return $http.get('/CustomerDetails/GetFraudCaseDetails', {
                params:
                    { custId: custId, fromDate: fromDate, toDate: toDate }
            });
        },

        getLogNotes: function (custId) {
            return $http.get('/CustomerDetails/GetLogNotes', {
                params:
                    { custId: custId }
            });
        },

        getWinlossStatistic: function (custId, fromDate, toDate) {
            return $http.get('/CustomerDetails/GetWinlossStatistic', {
                params:
                    { custId: custId, fromDate: fromDate, toDate: toDate }
            });
        },

        getDailyViolatedTickets: function (custId, fromDate, toDate) {
            return $http.get('/CustomerDetails/GetDailyViolatedTickets', {
                params:
                    { custId: custId, fromDate: fromDate, toDate: toDate }
            });
        },

        addNote: function (custId, note) {
            return $http.get('/CustomerDetails/AddNote', {
                params:
                    { custId: custId, note: note }
            });
        },

        verifyCustomer: function (custId, caseId) {
            return $http.get('/CustomerDetails/VerifyCustomer', {
                params:
                    { custId: custId, caseId: caseId }
            });
        },
        
        updateDelinquency: function(custId, isDelinquent) {
            return $http.get('/CustomerDetails/UpdateDelinquency', {
                params:
                    { custId: custId, isDelinquent: isDelinquent }
            });
        }
    };
} ]);