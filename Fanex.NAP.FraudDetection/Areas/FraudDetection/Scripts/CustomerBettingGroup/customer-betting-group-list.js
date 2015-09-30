(function () {
    "use strict";

    customerBettingGroupController.queryGroup();

    $('body').on('click', '.betting-group-row', function () {
        var groupId = $(this).data('groupid');
        customerBettingGroupController.openPopupEditCustomer(groupId);
    });

})();