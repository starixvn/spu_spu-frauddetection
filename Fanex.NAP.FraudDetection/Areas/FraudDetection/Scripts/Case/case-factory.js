var caseFactory = (function ($) {
    "use strict";

    return {
        getCases: function (criteria) {
            return $.post('Case/GetCaseList', criteria);
        },

        getEmptyCase: function () {
            return $.get('Case/AddCase');
        },
        addCase: function (fraudCase) {
            return $.post('Case/AddCase', fraudCase);
        },

        getCaseById: function (caseId) {
            return $.get('Case/GetCaseDetail', { caseId: caseId });
        },
        getCaseDetail: function (criteria) {
            return $.post('GetCaseDetail', criteria);
        },

        getCaseInfo: function (caseId) {
            return $.get('Case/EditCaseInfo', { caseId: caseId });
        },
        editCase: function (criteria) {
            return $.post('Case/EditCaseInfo', criteria);
        },

        editCaseStatus: function (caseId, isActive) {
            return $.post('Case/EditCaseStatus', { caseId: caseId, isActive: isActive });
        },

        editTaskStatus: function (criteria) {
            return $.post('EditTaskStatus', criteria);
        }
    };
})(jQuery);