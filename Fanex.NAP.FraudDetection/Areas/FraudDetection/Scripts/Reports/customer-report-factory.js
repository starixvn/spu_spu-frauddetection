var suspiciousCustomerReportFactory = (function ($) {
    "use strict";

    return {
        getSuspiciousCustomerReport: function (criteria) {
            return $.post('SuspiciousCustomer/Search', criteria);
        },
        exportExcel: function (criteria) {
            return $.get('SuspiciousCustomer/ExportExcel', criteria);
        },
        getSuspiciousCustomerStatistic: function (custId) {
            return $.get('SuspiciousCustomer/GetSuspiciousCustomerStatistic', { custId: custId });
        }
    };
})(jQuery);