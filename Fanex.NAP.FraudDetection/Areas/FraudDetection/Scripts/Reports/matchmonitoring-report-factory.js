var matchMonitoringReportFactory = (function ($) {
    "use strict";

    return {
        getLeaguesByDate: function (eventDate) {
            return $.get('MatchMonitoring/GetLeaguesByDate', { eventDate: eventDate });
        },
        
        Search: function (param) {
            return $.get('MatchMonitoring/Search', param);
        },
        
        GetCaseIdFromCaseName: function (caseName) {
            return $.get('MatchMonitoring/GetCaseIdFromName', { caseName: caseName });
        }
    };
})(jQuery);