(function () {
    "use strict";

    $("#btn_addGroup").click(function (event) {
        event.preventDefault();

        var group = {
            "GroupName": $("#GroupName").val(),
            "GroupDesc": $("#GroupDesc").val(),
            "IsActive": $('#IsActive').is(':checked')
        };

        groupService.addGroup(group);
    });

    $("#btn_Cancel").click(function () {
        DialogService.closeDialog();
    });
})();