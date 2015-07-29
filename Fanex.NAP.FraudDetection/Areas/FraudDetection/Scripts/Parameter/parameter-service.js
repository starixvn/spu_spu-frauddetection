var parameterService = (function ($) {
    "use strict";

    var parameterService = {};

    parameterService.updateParameter = function (params) {
        parameterFactory.updateParameter(params).success(function (response) {
            AlertService.showAlert(response);
        });
    };

    parameterService.generateListParamIDs = function () {
        var paramIDs = "";
        $('input[id^="tb_param_"]').each(function () {
            var paramId = $(this).attr('id');
            paramId = paramId.replace("tb_param_", "");
            paramIDs += paramId + ",";
        });

        return paramIDs.slice(0, -1);
    };

    parameterService.generateListParamNewValues = function () {
        var paramNewValues = "";
        $('input[id^="tb_param_"]').each(function () {
            paramNewValues += $(this).val() + ",";
        });

        return paramNewValues.slice(0, -1);
    };

    parameterService.isNumber = function (evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    };

    return parameterService;

})(jQuery);