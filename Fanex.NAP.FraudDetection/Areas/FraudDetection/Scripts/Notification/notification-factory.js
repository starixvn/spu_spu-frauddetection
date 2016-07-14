var notificationFactory = (function ($) {
    "use strict";

    return {
        getMessages: function(criteria) {
            return $.post('Notification/GetAllMessages', criteria);
        }
};
})(jQuery);
