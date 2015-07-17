(function () {
    "use strict";

    customerBettingGroupController.queryGroup();

    /*
    * Open Pop-up add new group.
    */
    $("#btn_addNewCustomerBettingGroup").click(function () {
        customerBettingGroupController.openPopupAddGroup();
    });
})();