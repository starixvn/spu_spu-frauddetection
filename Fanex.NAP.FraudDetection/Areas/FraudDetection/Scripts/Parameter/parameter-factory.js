var parameterFactory = (function ($) {
    "use strict";

    return {
        updateParameter: function (criteria) {
            return $.post('Parameter/UpdateParameter', criteria);
        }
    };
})(jQuery);