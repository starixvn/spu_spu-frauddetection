var customerBettingGroupFactory = (function ($) {
    "use strict";

    return {
        getGroups: function () {
            return $.get('CustomerBettingGroup/GetAllBettingGroups');
        },
        getCustomers: function () {
            return $.get('CustomerBettingGroup/GetAllBettingGroups');
        },
        deleteGroup: function (groupId) {
            return $.get('CustomerBettingGroup/DeleteBettingGroup', { groupId: groupId });
        },
        getGroupInfo: function (groupId) {
            return $.get('CustomerBettingGroup/EditBettingGroupInfo', { groupId: groupId });
        },
        editGroup: function (group) {
            return $.post('CustomerBettingGroup/EditBettingGroupInfo', group);
        },
        getEmptyCustomer: function (groupId) {
            return $.get('CustomerBettingGroup/EditCustomers', { groupId: groupId });
        },
        addCustomer: function (customer) {
            return $.post('CustomerBettingGroup/EditCustomers', customer);
        },
        deleteCustomer: function (custId, groupId) {
            return $.post('CustomerBettingGroup/DeleteCustomer', { custId: custId, groupId: groupId });
        },
        getGroupById: function (groupId) {
            return $.get('CustomerBettingGroup/GetGroupById', { groupId: groupId });
        },

        getAssociationCustomers: function (custId) {
            return $.get('CustomerBettingGroup/GetAssociationCustomers', { custId: custId });
        }
    };
})(jQuery);