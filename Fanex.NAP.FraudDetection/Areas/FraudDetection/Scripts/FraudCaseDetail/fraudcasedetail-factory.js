var fraudCaseDetailFactory = (function ($) {

    var service = {};

    service.getFraudCaseDetails = function (criteria) {
        var url = SPU.getAbsoluteUrl("FraudCaseDetail/GetFraudCaseDetails");

        return $.post(url, criteria);
    };

    return service;

})(jQuery);
