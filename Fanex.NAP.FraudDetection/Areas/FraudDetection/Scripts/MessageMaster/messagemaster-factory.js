var messMasterFactory = (function ($) {
    "use strict";

    return {
        getMessages: function () {
            return $.get('MessageMaster/GetAllMessages');
        },
        //addMail: function (mail) {
        //    return $.post('AddMail', mail);
        //},
        deleteMessage: function (messId) {
            return $.post('MessageMaster/DeleteMessage', { messageId: messId });
        },
        //getMailById: function (mailId) {
        //    return $.get('MailMaster/EditMail', { mailId: mailId });
        //},
        //editMail: function (mail) {
        //    return $.post('EditMail', mail);
        //},
        editMailStatus: function (messId, isActive) {
            return $.post('MessageMaster/EditMessageStatus', { messageId: messId, isActive: isActive });
        }
    };
})(jQuery);