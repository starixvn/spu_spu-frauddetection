var fraudCaseDetailFactory = (function ($) {

    var service = {};

    service.getFraudCaseDetails = function (criteria) {
        var url = SPU.getAbsoluteUrl("FraudCaseDetail/GetFraudCaseDetails");

        return $.post(url, criteria);
    };

    //service.getDataAllTicketRows = function (ip) {
    //    var bodyRows = [];
    //    $.ajax({
    //        url: SPU.getAbsoluteUrl("FraudCaseDetail/GetAllTicketsByIp?ip=" + ip),
    //        type: 'GET',
    //        async: true,
    //        dataType: 'json',
    //        beforeSend: function () {
    //            //waitingDialog.show("Please wait...", { dialogSize: 'sm' });
    //        },
    //        success: function (data) {
    //            balanceUpDay = moment(data.BalanceUpDay).format("DD/MM/YYYY");
    //            $.each(data.BetList, function (index, element) {
    //                bodyRows.push({
    //                    Columns: [
    //                        { Name: "No" },
    //                        { Name: "CustName", Value: element.CustName },
    //                        { Name: "TransDate", Value: element.TransDate },
    //                        { Name: "TransId", Value: element.TransId },
    //                        { Name: "Bettype", Value: element.BetType },
    //                        { Name: "Choice", CustomCellRender: function () { return element.Choice; } },
    //                        { Name: "Score", Value: element.Score },
    //                        { Name: "Odds", CustomCellRender: function () { return element.Odds; } },
    //                        { Name: "Stake", CustomCellRender: function () { return element.Stake; } },
    //                        { Name: "WinLoss", Value: element.WinLoss },
    //                        { Name: "Status", Value: element.Status },
    //                    ]
    //                });
    //            });
    //        },
    //        error: function () {
    //            //alert(_messages.errorTryAgain);
    //        },
    //        complete: function () {
    //            //waitingDialog.hide();
    //            //$('#popup .match').addClass('clearfix');
    //        }
    //    });
    //    return bodyRows;
    //};

    return service;

})(jQuery);
