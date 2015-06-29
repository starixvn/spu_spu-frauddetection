$(document).ready(function () {
    OnInitialize();
});

function OnInitialize() {
    $("#btn_AddWorkflow").click(function (event) {
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
                    response.ErrMsg = "Add new workflow successfully!";
                }
                else {
                    $("#addResult").attr('class', 'result-text-fail');
                }

                $("#addResult").html(response.ErrMsg);
                Search();
            },
            beforeSend: function () {

            },
            complete: function () {
            }
        });
    });    
}