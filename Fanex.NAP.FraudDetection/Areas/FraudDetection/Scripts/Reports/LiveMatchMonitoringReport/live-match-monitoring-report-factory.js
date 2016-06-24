'use strict';
/*global matchMonitoringReportModule*/

liveMatchMonitoringReportModule.factory('liveMatchMonitoringReportFactory', ['$http', function ($http) {
    return {
        getSportsByDate: function (eventDate) {
            var url = SPU.getAbsoluteUrl("LiveMatchMonitoring/GetSportsByDate");

            return $http.get(url, {
                params:
                    { eventDate: eventDate }
            });
        },

        getLeaguesByDate: function (eventDate) {
            var url = SPU.getAbsoluteUrl("LiveMatchMonitoring/GetLeaguesByDate");

            return $http.get(url, {
                params:
                    { eventDate: eventDate }
            });
        },

        getLeaguesByDateAndSport: function (eventDate, sportId) {
            var url = SPU.getAbsoluteUrl("LiveMatchMonitoring/GetLeaguesByDateAndSport");

            return $http.get(url, {
                params:
                    {
                        eventDate: eventDate,
                        sportId: sportId
                    }
            });
        },

        getAllMatches: function (criteria) {
            var url = SPU.getAbsoluteUrl("LiveMatchMonitoring/Search");

            return $http.post(url, criteria);
        },

        getCaseIdFromCaseName: function (caseName) {
            var url = SPU.getAbsoluteUrl("LiveMatchMonitoring/GetCaseIdFromName");

            return $http.get(url, {
                params: { caseName: caseName }
            });
        }
    };
} ]);