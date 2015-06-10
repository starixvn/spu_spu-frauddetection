$(document).ready(function () {
    OnInitialize();
});

//=========================================================================
/* INITIALIZE */
function OnInitialize() {
    $("#btn_UpdateParameter").click(function (event) {
        event.preventDefault();
        var url = 'Parameter/UpdateParamater';
        var param = {
            "CreatorId": $("#onUserid").text(),
            "PercentageMaxBet": $("#percentageMaxBet").val(),
            "SecondsToGoal": $("#secondsToGoal").val()
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