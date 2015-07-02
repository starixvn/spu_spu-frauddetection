$(document).ready(function () {
    $("#btn_addWorkflow").click(function () {
        addWorkflowForm.submit();
    });

    $("#btn_Cancel").click(function () {
        $("div#popup").dialog("destroy").remove();
    });

    var addWorkflowForm = $("#AddWorkflowForm").submit(function (event) {
        event.preventDefault();

        var url = 'Workflow/AddNewWorkflow';
        var param = {
            "WorkflowName": $("#WorkflowName").val(),
            "WorkflowDesc": $("#WorkflowDesc").val(),
            "IsActive": $('#IsActive').is(':checked')
        };
        $.ajax({
            type: "POST",
            contentType: 'application/json',
            dataType: "json",
            data: JSON.stringify(param),
            cache: false,
            url: url,
            error: function () {
            },
            success: function (response) {
                if (response.ErrCode == 0) {
                    $("#addResult").attr('class', 'result-text-success');
                    $("#addResult").html("Add new workflow successfully!"); 
                    setTimeout(function () {
                        $("div#popup").dialog("destroy").remove();
                    }, 3000);
                    Search();
                }
                else {
                    $("#addResult").attr('class', 'result-text-fail');
                    $("#addResult").html(response.ErrMsg);
                }
            },
            beforeSend: function () {

            },
            complete: function () {
            }
        });
    });
});