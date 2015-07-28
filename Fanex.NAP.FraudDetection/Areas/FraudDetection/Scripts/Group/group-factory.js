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
        }
    };
})(jQuery);