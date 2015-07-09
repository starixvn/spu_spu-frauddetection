var AlertService = (function ($) {
    var service = {};

    var $sentAlert = $('#sentAlert');
    var $message = $('#sentAlert div');
    var timeoutID = null;

    service.init = function () {
        $sentAlert.on('close.bs.alert', function () {
            if (timeoutID !== null) {
                clearTimeout(timeoutID);
                timeoutID = null;
            }

            $sentAlert.hide();
            return false;
        });
    };

    service.showAlert = function (data) {
        if (data.IsSuccessful === true) {
            $message.text('aabas');
            $sentAlert.removeClass('alert-danger');
            $sentAlert.addClass('alert-success');

            timeoutID = setTimeout(function () {
                $sentAlert.hide();
                timeoutID = null;
            }, 3000);
        } else {
            $message.text(data.Message);
            $sentAlert.removeClass('alert-success');
            $sentAlert.addClass('alert-danger');
        }

        $sentAlert.show();
    };

    return service;

})(jQuery);

(function ($) {
    AlertService.init();
})();