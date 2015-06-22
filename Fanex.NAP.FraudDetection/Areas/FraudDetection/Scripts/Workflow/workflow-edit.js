$(document).ready(function () {
    OnInitialize();
});

function OnInitialize() {
    $('#EditWorkflowForm').submit(function (event) {
        event.preventDefault();

        $.post(this.action, $(this).serialize(), function (response) {
            if (response.ErrCode === 0) {
                $("#addResult").attr('class', 'result-text-success');
                response.ErrMsg = "Edit workflow successfully!";
            }
            else {
                $("#addResult").attr('class', 'result-text-fail');
            }

            $("#addResult").html(response.ErrMsg);
            Search();
        });
    });
}

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