$(document).ready(function () {
    $("#btn_editGroup").click(function () {
        editGroup.submit();
    });

    $("#btn_Cancel").click(function () {
        $("div#popup").dialog("destroy").remove();
    });

    var editGroup = $('#EditGroupForm').submit(function (event) {
        event.preventDefault();

        $.post(this.action, $(this).serialize(), function (response) {
            if (response.ErrCode === 0) {
                $("#addResult").attr('class', 'result-text-success');
                $("#addResult").html("Edit group successfully!");
                setTimeout(function () {
                    $("div#popup").dialog("destroy").remove();
                }, 3000);
                Search();
            }
            else {
                $("#addResult").attr('class', 'result-text-fail');
                $("#addResult").html(response.ErrMsg);
            }
        });
    });
});

/*
* Edit a group.
*/
function editGroupInfo(groupId) {
    $.get('Group/EditGroupInfo', { groupId: groupId }, function (response) {
        $('<div id="popup"></div>').appendTo('body').dialog({
            modal: true,
            title: "Edit Group",
            zIndex: 10000,
            autoOpen: true,
            width: '500px',
            resizable: false,
            close: function () {
                $(this).remove();
            }
        }).html(response);
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
                if (result.ErrCode === 0) {
                    Search();
                }
                else {
                    alert(result.ErrMsg);
                }
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