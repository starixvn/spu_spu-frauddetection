$(function () {
    "use strict";

    $("#btn_OpenNewMessage").click(function () {
        messMasterService.openPopupAddMessage();
    });

    messMasterService.isHostPermission = isHost;
    messMasterService.getAllMessage();
});