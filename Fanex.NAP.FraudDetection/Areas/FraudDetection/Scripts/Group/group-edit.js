$(document).ready(function () {
    $("#btn_editGroup").click(function () {
        editGroup.submit();
    });

    $("#btn_Cancel").click(function () {
        DialogService.closeDialog();
    });

    var editGroup = $('#EditGroupForm').submit(function (event) {
        event.preventDefault();

        $.post(this.action, $(this).serialize(), function (response) {
            if (response.IsSuccessful) {
                setTimeout(function () {
                    DialogService.closeDialog();
                }, 3000);
                Search();
            }

            AlertService.setAlertId('sentAlertOnPopup');
            AlertService.showAlert(response);
        });
    });
});

/*
* Edit a group.
*/
function editGroupInfo(groupId) {
    $.get('Group/EditGroupInfo', { groupId: groupId }, function (response) {
        DialogService.setDialogId("pop-up");
        DialogService.openDialogContent(response, "Edit Group", {
            width: '500px'
        });
    });
}

/*
* Activate/deactivate a group.
*/
function editGroupStatus(obj, groupId) {
    var active = "activate ";
    var isActive = false;
    if ($(obj).hasClass('ico-tick')) {
        active = "deactivate ";
        isActive = true;
    }

    if (isActive) {
        $(obj).removeClass('ico-tick').addClass('ico-untick');
    } else {
        $(obj).removeClass('ico-untick').addClass('ico-tick');
    }

    $.confirm({
        confirmButtonClass: 'btn-green btn-customConfirm',
        cancelButtonClass: 'btn-green btn-customCancel',
        title: "Confirmation",
        text: "Are you sure to " + active + "this group?",
        confirm: function () {
            $.post('Group/EditGroupStatus', { groupId: groupId, isActive: !isActive }, function (result) {
                if (result.IsSuccessful) {
                    Search();
                }

                AlertService.showAlert(result);
            });
        },
        cancel: function () {
            if (!isActive) {
                $(obj).removeClass('ico-tick').addClass('ico-untick');
            } else {
                $(obj).removeClass('ico-untick').addClass('ico-tick');
            }
        },
        confirmButton: "OK",
        cancelButton: "Cancel"
    });
}