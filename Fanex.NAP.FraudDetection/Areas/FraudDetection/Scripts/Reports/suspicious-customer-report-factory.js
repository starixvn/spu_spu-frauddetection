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
        getSuspiciousCustomerStatistic: function (custId) {
            return $http.get('SuspiciousCustomer/GetSuspiciousCustomerStatistic', {
                params:
                    { custId: custId }
            });
        }
    };
}]);