var suspiciousCustomerReportFactory = (function ($) {
    "use strict";

    return {
        getSuspiciousCustomerReport: function (criteria) {
            return $.post('SuspiciousCustomer/Search', criteria);
        }
    };
})(jQuery);