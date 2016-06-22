'use strict';
/*global matchMonitoringReportModule*/

liveMatchMonitoringReportModule.factory('liveMatchMonitoringReportFactory', ['$http', function ($http) {
    return {
        getSportsByDate: function (eventDate) {
            var url = SPU.getAbsoluteUrl("MatchMonitoring/GetSportsByDate");

            return $http.get(url, {
                params:
                    { eventDate: eventDate }
            });
        },

        getLeaguesByDate: function (eventDate) {
            var url = SPU.getAbsoluteUrl("MatchMonitoring/GetLeaguesByDate");

            return $http.get(url, {
                params:
                    { eventDate: eventDate }
            });
        },

        getLeaguesByDateAndSport: function (eventDate, sportId) {
            var url = SPU.getAbsoluteUrl("MatchMonitoring/GetLeaguesByDateAndSport");

            return $http.get(url, {
                params:
                    {
                        eventDate: eventDate,
                        sportId: sportId
                    }
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
        },

        updateDelinquency: function (matchId, isActive) {
            var url = SPU.getAbsoluteUrl("MatchMonitoring/UpdateDelinquency");

            return $http.get(url, {
                params: { matchId: matchId, isActive: isActive }
            });
        },

        updateVerification: function (matchId, isActive) {
            var url = SPU.getAbsoluteUrl("MatchMonitoring/UpdateVerification");

            return $http.get(url, {
                params: { matchId: matchId, isActive: isActive }
            });
        }
    };
} ]);