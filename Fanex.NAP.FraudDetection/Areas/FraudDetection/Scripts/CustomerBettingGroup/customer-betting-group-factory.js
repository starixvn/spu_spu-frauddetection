var customerBettingGroupFactory = (function ($) {
    "use strict";

    return {
        getGroups: function () {
            return $.get('CustomerBettingGroup/GetAllGroups');
        },
        getCustomers: function () {
            return $.get('CustomerBettingGroup/GetAllGroups');
        },
        getEmptyGroup: function () {
            return $.get('CustomerBettingGroup/AddNewGroup');
        },
        addGroup: function (group) {
            return $.post('CustomerBettingGroup/AddNewGroup', group);
        },
        deleteGroup: function (groupId) {
            return $.get('CustomerBettingGroup/Delete', { groupId: groupId });
        },
        getGroupInfo: function (groupId) {
            return $.get('CustomerBettingGroup/EditGroupInfo', { groupId: groupId });
        },
        editGroup: function (group) {
            return $.post('CustomerBettingGroup/EditGroup', group);
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
        }
    };
})(jQuery);