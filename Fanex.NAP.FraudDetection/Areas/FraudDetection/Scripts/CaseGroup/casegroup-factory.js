var caseGroupFactory = (function ($) {

    var service = {};

    service.getAvailableCustomerGroups = function(caseId) {

        var criteria = {
            caseId: caseId
        };
    
        var url = SPU.getAbsoluteUrl("CaseGroup/GetAvailableCustomerGroups");

        return $.post(url, criteria);
    };

    service.addCustomerGroupToCase = function (criteria) {
        var url = SPU.getAbsoluteUrl("CaseGroup/AddCustomerGroupToCase");

        return $.post(url, criteria);
    };

    return service;

})(jQuery);
