(function () {
    "use strict";

    customerBettingGroupController.queryGroup();

    $('body').on('click', '.betting-group-row', function () {
        var groupId = $(this).data('groupid');

        $('.betting-group-row').removeClass('selected-row');
        $(this).addClass('selected-row');

        customerBettingGroupController.openPopupEditCustomer(groupId);
    });

})();