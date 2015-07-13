var DialogService = (function($) {
    var service = {};
    var dialogOpt = {
        position: { my: "top+30%", at: "center top", of: window },
        modal: true,
        width: 'auto',
        close: function () {
            $(this).remove();
        }
    };
    
    var dialogId = 'spu-dialog-frame';
    var dialogSelector = "#" + dialogId;

    var getDialogTarget = function() {
        var target = $(dialogSelector);
        if (target.length > 0) {
            return target;
        }

        target = $('<div id="{0}" style="overflow: hidden; display:none;" />'.format(dialogId));

        target.appendTo("body");

        return target;
    };

    // Dialog
    
    var openDialog = function(target, title, options) {
        options = options || {};

        if (title) {
            options.title = title;
        }

        if (target instanceof jQuery === false) {
            target = $(target);
        }

        service.currentOpenDialog = target.dialog($.extend({}, dialogOpt, options));

        return service.currentOpenDialog;
    };

    service.setDialogId = function (id) {
        dialogId = id;
    };

    service.currentOpenDialog = null;

    service.openDialogFrame = function (url, title, options) {

        var frameHtml = '<iframe scrolling="no" src="' + url + '" width="100%" height="100%" frameborder="0" border="0"></iframe>';

        var target = getDialogTarget();

        target.html(frameHtml);

        return openDialog(target, title, options);
    };

    service.openDialogContent = function (htmlContent, title, options) {

        var frameHtml = htmlContent;

        var target = getDialogTarget();

        target.html(frameHtml);

        return openDialog(target, title, options);
    };

    service.closeDialog = function () {
        if (parent.DialogService.currentOpenDialog !== null) {
            parent.DialogService.currentOpenDialog.dialog("close");
        }
    };
    
    return service;

})(jQuery);