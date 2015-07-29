var taskFactory = (function ($) {
    "use strict";

    return {
        addTask: function (criteria) {
            return $.post('Task/AddTask', criteria);
        },

        editTask: function (criteria) {
            return $.post('EditTask', criteria);
        }
    };
})(jQuery);