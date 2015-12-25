'use strict';
/*global matchMonitoringReportModule*/

matchMonitoringReportModule.factory('matchMonitoringReportFactory', ['$http', function ($http) {
    return {
        getLeaguesByDate: function (eventDate) {
            var url = SPU.getAbsoluteUrl("MatchMonitoring/GetLeaguesByDate");

            return $http.get(url, {
                params:
                    { eventDate: eventDate }
            });
        },

        getAllMatches: function (criteria) {
            var url = SPU.getAbsoluteUrl("MatchMonitoring/Search");

            return $http.post(url, criteria);
        },

        getCaseIdFromCaseName: function (caseName) {
            var url = SPU.getAbsoluteUrl("MatchMonitoring/GetCaseIdFromName");

            return $http.get(url, {
                params: { caseName: caseName }
            });
        }
    };
} ]);