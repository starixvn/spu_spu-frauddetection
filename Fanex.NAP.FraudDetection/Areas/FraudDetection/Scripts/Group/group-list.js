(function () {
    "use strict";

    $("#btn_AddNewGroup").click(function () {
        groupService.openPopupAddGroup();
    });

    groupService.isHostPermission = isHost;
    groupService.Search();
})();