(function () {
    "use strict";

    $("#btn_editGroup").click(function (event) {
        event.preventDefault();

        var group = {
            "GroupId": $("#GroupId").val(),
            "GroupName": $("#GroupName").val(),
            "GroupDesc": $("#GroupDesc").val(),
            "IsActive": $('#IsActive').is(':checked')
        };

        groupService.editGroup(group);
    });

    $("#btn_Cancel").click(function () {
        DialogService.closeDialog();
    });

    $("form").submit(function () {
        return false;
    });
})();