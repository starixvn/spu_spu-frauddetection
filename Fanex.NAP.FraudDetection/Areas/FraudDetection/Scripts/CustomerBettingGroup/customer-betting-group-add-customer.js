(function () {
    "use strict";

    /*
    * Add new customer.
    */
    $("#btn_addCustomer").click(function () {
        var customer = {
            "CustName": $("#CustName").val(),
            "GroupId": $("#GroupId").val()
        };

        customerBettingGroupController.addCustomer(customer);
    });

    /*
    * Cancel.
    */
    $("#btn_Cancel").click(function () {
        DialogService.closeDialog();
    });
})();