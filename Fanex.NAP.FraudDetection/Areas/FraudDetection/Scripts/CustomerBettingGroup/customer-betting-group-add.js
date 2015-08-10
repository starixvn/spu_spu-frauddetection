(function () {
    "use strict";

    /*
    * Add new group.
    */
    $("#btn_addGroup").click(function () {
        var group = {
            "Name": $("#Name").val(),
            "Description": $("#Description").val()
        };

        customerBettingGroupController.addGroup(group);
    });

    /*
    * Cancel.
    */
    $("#btn_Cancel").click(function () {
        DialogService.closeDialog();
    });

    $("form").submit(function () {
        return false;
    });
})();