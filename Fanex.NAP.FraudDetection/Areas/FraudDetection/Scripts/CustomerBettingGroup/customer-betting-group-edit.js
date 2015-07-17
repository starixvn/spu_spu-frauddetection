(function () {
    "use strict";

    /*
    * Edit group.
    */
    $("#btn_editGroup").click(function () {
        var group = {
            "GroupId": $("#GroupId").val(),
            "Name": $("#Name").val(),
            "Description": $("#Description").val()
        };

        customerBettingGroupController.editGroup(group);
    });

    /*
    * Cancel.
    */
    $("#btn_Cancel").click(function () {
        DialogService.closeDialog();
    });
})();