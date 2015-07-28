var mailMasterFactory = (function ($) {
    "use strict";

    return {
        getMails: function () {
            return $.get('MailMaster/GetAllMails');
        },
        addMail: function (mail) {
            return $.post('AddMail', mail);
        },
        deleteMail: function (mailId) {
            return $.post('MailMaster/DeleteMail', { mailId: mailId });
        },
        getMailById: function (mailId) {
            return $.get('MailMaster/EditMail', { mailId: mailId });
        },
        editMail: function (mail) {
            return $.post('EditMail', mail);
        },
        editMailStatus: function (mailId, isActive) {
            return $.post('MailMaster/EditMailStatus', { mailId: mailId, isActive: isActive });
        }
    };
})(jQuery);