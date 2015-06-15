$(document).ready(function () {
    OnInitialize();
});

//=========================================================================
/* INITIALIZE */
function OnInitialize() {
    $('input[id^="tb_param_"]').keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
        // Allow: Ctrl+A, Command+A
            (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
        // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    $("#btn_UpdateParameter").click(function (event) {
        event.preventDefault();
        var url = 'Parameter/UpdateParamater';
        var param = {
            "CreatorId": $("#onUserid").text(),
            "ListParamIDs": GenerateListParamIDs(),
            "ListParamNewValues": GenerateListParamNewValues()
        };

        $.ajax({
            type: "POST",
            contentType: 'application/json',
            dataType: "json",
            data: JSON.stringify(param),
            cache: false,
            url: url,
            error: function () {
            },
            success: function (response) {
                if (response.ErrCode == 0) {
                    $("#updateParamsResults").css("class", "result-text-success");
                    $("#updateParamsResults").text("New value of parameters were updated.");
                }
                else {
                    $("#updateParamsResults").css("class", "result-text-fail");
                    $("#updateParamsResults").text(response.ErrMsg);
                }
            },
            beforeSend: function () {

            },
            complete: function () {
            }
        });
    });
}

function GenerateListParamIDs() {
    var paramIDs = "";
    $('input[id^="tb_param_"]').each(function () {
        var paramID = $(this).attr('id');
        paramID = paramID.replace("tb_param_", "");
        paramIDs += paramID + ",";
    });

    return paramIDs.slice(0, -1);
}

function GenerateListParamNewValues() {
    var paramNewValues = "";
    $('input[id^="tb_param_"]').each(function () {
        paramNewValues += $(this).val() +",";
    });

    return paramNewValues.slice(0, -1);
}

//=========================================================================
/* ULTILITIES */
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}