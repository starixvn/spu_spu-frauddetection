(function () {
    "use strict";

    $("#btn_AddNewGroup").click(function () {
        groupService.openPopupAddGroup();
    });

    groupService.Search();
})();