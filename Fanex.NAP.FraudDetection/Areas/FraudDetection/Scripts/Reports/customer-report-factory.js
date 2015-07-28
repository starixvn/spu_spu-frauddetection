var suspiciousCustomerReportFactory = (function ($) {
    "use strict";

    return {
        getSuspiciousCustomerReport: function (memberName, groupId) {
            return $.get('SuspiciousCustomer/Search', { memberName: memberName, groupId: groupId });
        }
    };
})(jQuery);