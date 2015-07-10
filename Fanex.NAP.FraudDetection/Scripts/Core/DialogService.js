var DialogService = (function($) {
    var service = {};
    var dialogOpt = {
        position: { my: "top+30%", at: "center top", of: window },
        modal: true,
        width: 'auto'
    };

    var dialogId = "spu-dialog-frame";
    var dialogSelector = "#" + dialogId;

    var getDialogTarget = function() {
        var target = $(dialogSelector);
        if (target.length > 0) {
            return target;
        }

        target = $('<div id="{0}" style="overflow: hidden"/>'.format(dialogId));

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

    service.currentOpenDialog = null;

    service.openDialogFrame = function (url, title, options) {

        var frameHtml = '<iframe scrolling="no" src="' + url + '" width="100%" height="100%" frameborder="0" border="0"></iframe>';

        var target = getDialogTarget();

        target.html(frameHtml);

        return openDialog(target, title, options);
    };

    service.openDialogContent = function(content, title, options) {
        //var frameHtml = content;
        //var frame = $("#aff-dialog-frame");

        //if (frame.length > 0) {
        //    frame.html(frameHtml);
        //} else {
        //    var blockLoading = '<div class="block-loading"></div>';
        //    frame = '<div id="aff-dialog-frame">' + blockLoading + frameHtml + '</div>';
        //}
        //return AFFILIATE.openDialog(frame, title, options);
    };

    service.closeDialog = function () {
        if (parent.DialogService.currentOpenDialog !== null) {
            parent.DialogService.currentOpenDialog.dialog("close");
        }
    };
    
    return service;

})(jQuery);