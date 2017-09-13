(function () {
    "use strict";

    groupDetailService.isHostPermission = isHost;

    groupDetailService._groupId = $("#GroupId").val();
    groupDetailService.Search();

    $("#btn_AddMember").click(function () {
        groupDetailService.addMember($("#username").val(), groupDetailService._groupId);
    });
})();