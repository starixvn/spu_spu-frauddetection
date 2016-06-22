var dailyDataMonitoringReportFactory = (function ($) {
    "use strict";

    return {
        Search: function(param) {
            return $.get('DailyDataMonitoring/Search', param);
        },

        ExportExcel: function(param) {
            return $.get('DailyDataMonitoring/ExportExcel', param);
        }
    };
})(jQuery);