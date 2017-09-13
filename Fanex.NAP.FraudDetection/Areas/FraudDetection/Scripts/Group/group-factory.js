var groupFactory = (function ($) {
    "use strict";

    return {
        getGroups: function (criteria) {
            return $.post('Group/GetGroupList', criteria);
        },

        getEmptyGroup: function () {
            return $.get('Group/AddGroup');
        },
        addGroup: function (group) {
            return $.post('Group/AddGroup', group);
        },

        getGroupInfo: function (groupId) {
            return $.get('Group/EditGroup', { groupId: groupId });
        },

        editGroup: function (group) {
            return $.post('Group/EditGroup', group);
        },

        editGroupStatus: function (groupId, isActive) {
            return $.post('Group/EditGroupStatus', { groupId: groupId, isActive: isActive });
        },

        getGroupDetail: function (criteria) {
            return $.post('GroupDetail', criteria);
        },

        removeMemberFromGroup: function (custId, groupId) {
            return $.post('RemoveMember', { custId: custId, groupId: groupId });
        },

        addMemberToGroup: function (username, groupId) {
            return $.post('AddMember', { username: username, groupId: groupId });
        }
    };
})(jQuery);