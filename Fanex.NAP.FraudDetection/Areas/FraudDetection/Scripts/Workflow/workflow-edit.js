$(document).ready(function () {
    $("#btn_editWorkflow").click(function () {
        editWorkflowForm.submit();
    });

    $("#btn_Cancel").click(function () {
        $("div#popup").dialog("destroy").remove();
    });

    var editWorkflowForm = $('#EditWorkflowForm').submit(function (event) {
        event.preventDefault();

        $.post(this.action, $(this).serialize(), function (response) {
            if (response.ErrCode === 0) {
                $("#addResult").attr('class', 'result-text-success');
                $("#addResult").html("Edit workflow successfully!");
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
* Edit a work flow.
*/
function editWorkflowInfo(workflowId) {
    $.get('Workflow/EditWorkflowInfo', { workflowId: workflowId }, function (response) {
        $('<div id="popup"></div>').appendTo('body').dialog({
            modal: true,
            title: "Edit Workflow",
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
* Activate/deactivate a work flow.
*/
function editWorkflowStatus(obj, workflowId) {
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
        text: "Are you sure to " + active + "this Workflow?",
        confirm: function () {
            $.post('Workflow/EditWorkflowStatus', { workflowId: workflowId, isActive: !isActive }, function (result) {
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