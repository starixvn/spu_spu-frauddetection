var AlertServiceOnPopup = (function ($) {
    var service = {};

    var $sentAlert = $('#sentAlertOnPopup');
    var $message = $('#sentAlertOnPopup div');
    var timeoutId = null;

    var clearTimeout = function () {
        if (timeoutId !== null) {
            window.clearTimeout(timeoutId);
            timeoutId = null;
        }
    };

    service.init = function () {
        $sentAlert.on('close.bs.alert', function () {
            clearTimeout();

            $sentAlert.hide();
            return false;
        });
    };

    var defaultMessage = "The operation is successful.";

    var showAlertByObject = function (data) {
        if (data.IsSuccessful === true || data.ErrCode === 0) {
            if (data.Message === "") {
                data.Message = defaultMessage;
            }

            $message.text(data.Message);
            $sentAlert.removeClass('alert-danger');
            $sentAlert.addClass('alert-success');

            timeoutId = setTimeout(function() {
                $sentAlert.hide();
                timeoutId = null;
            }, 3000);
        } else {
            $message.text(data.Message);
            $sentAlert.removeClass('alert-success');
            $sentAlert.addClass('alert-danger');
        }

        $sentAlert.show();
    };

    var showAlertByString = function (message) {
        $message.text(message);
        $sentAlert.removeClass('alert-success');
        $sentAlert.addClass('alert-danger');

        $sentAlert.show();
    };

    service.showAlert = function (data) {
        // clear the previous timeout.
        clearTimeout();

        if (typeof data === "object") {
            showAlertByObject(data);
        }

        if (typeof data === "string") {
            showAlertByString(data);
        }
    };

    service.hideAlert = function () {
        // clear the previous timeout.
        clearTimeout();

        $sentAlert.hide();
    };

    return service;

})(jQuery);

(function () {
    AlertServiceOnPopup.init();
})();