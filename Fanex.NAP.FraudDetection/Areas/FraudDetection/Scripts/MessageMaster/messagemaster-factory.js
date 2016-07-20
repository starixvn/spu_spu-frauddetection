var messMasterFactory = (function ($) {
    "use strict";

    return {
        getMessages: function () {
            var url = SPU.getAbsoluteUrl('MessageMaster/GetAllMessages');
            return $.get(url);
        },
        addMessage: function (message) {
            var url = SPU.getAbsoluteUrl('MessageMaster/AddMessage');
            return $.post(url, message);
        },
        addNewMessage: function () {
            var url = SPU.getAbsoluteUrl('MessageMaster/AddMessage');
            return $.get(url);
        },
        deleteMessage: function (messId) {
            var url = SPU.getAbsoluteUrl('MessageMaster/DeleteMessage');
            return $.post(url, { messageId: messId });
        },
        editMessage: function (message) {
            var url = SPU.getAbsoluteUrl('MessageMaster/EditMessage');
            return $.post(url, message);
        },
        editMessageInfo: function (messageId) {
            var url = SPU.getAbsoluteUrl('MessageMaster/EditMessage');
            return $.get(url, { messageId: messageId });
        },
        editMessageStatus: function (messId, isActive) {
            var url = SPU.getAbsoluteUrl('MessageMaster/EditMessageStatus');
            return $.post(url, { messageId: messId, isActive: isActive });
        },
        getAllUser: function() {
            var url = SPU.getAbsoluteUrl('MessageMaster/GetAllUsers');
            return $.get(url);
        }
    };
})(jQuery);