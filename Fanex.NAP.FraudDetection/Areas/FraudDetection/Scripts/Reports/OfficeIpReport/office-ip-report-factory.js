'use strict';
/*global officeIPsReportModule*/

officeIPsReportModule.factory('officeIPsReportFactory', ['$http', function ($http) {
    return {
        getSuspiciousTickets: function (fromDate, toDate) {
            var url = SPU.getAbsoluteUrl("OfficeIPs/GetSuspiciousTickets");

            return $http.get(url, {
                params:
                    { fromDate: fromDate, toDate: toDate }
            });
        }
    };
} ]);