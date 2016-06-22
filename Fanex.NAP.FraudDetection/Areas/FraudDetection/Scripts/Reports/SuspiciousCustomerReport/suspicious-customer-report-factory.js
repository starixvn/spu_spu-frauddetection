'use strict';
/*global suspiciousCustomerReportModule*/

suspiciousCustomerReportModule.factory('suspiciousCustomerReportFactory', ['$http', function ($http) {
    return {
        getSuspiciousCustomerReport: function (criteria) {
            return $http.post('SuspiciousCustomer/Search', criteria);
        },
        exportExcel: function (criteria) {
            return $http.get('SuspiciousCustomer/ExportExcel', criteria);
        },
        getNotes: function (custId) {
            return $http.get('SuspiciousCustomer/GetNotes', {
                params:
                    { custId: custId }
            });
        },
        getAllCases: function () {
            return $http.get('SuspiciousCustomer/GetAllCases');
        }
    };
}]);