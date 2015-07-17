var customerBettingGroupModel = (function () {
    "use strict";

    var customerBettingGroupModel = {};

    customerBettingGroupModel.serverResult = '';

    customerBettingGroupModel.groups = [];
    customerBettingGroupModel.group = '';

    customerBettingGroupModel.customers = [];
    customerBettingGroupModel.customer = '';

    customerBettingGroupModel.getGroups = function () {
        return customerBettingGroupFactory.getGroups().success(function (groups) {
            customerBettingGroupModel.groups = groups;
        });
    };

    customerBettingGroupModel.getEmptyGroup = function () {
        return customerBettingGroupFactory.getEmptyGroup().success(function (result) {
            customerBettingGroupModel.serverResult = result;
        });
    };

    customerBettingGroupModel.addGroup = function (group) {
        return customerBettingGroupFactory.addGroup(group).success(function (result) {
            customerBettingGroupModel.serverResult = result;
        });
    };

    customerBettingGroupModel.deleteGroup = function (groupId) {
        return customerBettingGroupFactory.deleteGroup(groupId).success(function (result) {
            customerBettingGroupModel.serverResult = result;
        });
    };

    customerBettingGroupModel.getGroupInfo = function (groupId) {
        return customerBettingGroupFactory.getGroupInfo(groupId).success(function (group) {
            customerBettingGroupModel.group = group;
        });
    };

    customerBettingGroupModel.editGroup = function (group) {
        return customerBettingGroupFactory.editGroup(group).success(function (result) {
            customerBettingGroupModel.serverResult = result;
        });
    };

    customerBettingGroupModel.getEmptyCustomer = function (groupId) {
        return customerBettingGroupFactory.getEmptyCustomer(groupId).success(function (customer) {
            customerBettingGroupModel.customer = customer;
        });
    };

    customerBettingGroupModel.addCustomer = function (customer) {
        return customerBettingGroupFactory.addCustomer(customer).success(function (result) {
            customerBettingGroupModel.serverResult = result;
        });
    };

    customerBettingGroupModel.deleteCustomer = function (custId, groupId) {
        return customerBettingGroupFactory.deleteCustomer(custId, groupId).success(function (result) {
            customerBettingGroupModel.serverResult = result;
        });
    };

    customerBettingGroupModel.getGroupById = function (groupId) {
        return customerBettingGroupFactory.getGroupById(groupId).success(function (group) {
            customerBettingGroupModel.group = group;
        });
    };

    return customerBettingGroupModel;
})(jQuery);