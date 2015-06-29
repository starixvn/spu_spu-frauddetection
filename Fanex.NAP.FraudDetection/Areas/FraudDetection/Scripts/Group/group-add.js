$(document).ready(function () {
    $("#btn_addGroup").click(function () {
        addGroup.submit();
    });

    var addGroup = $("#AddGroupForm").submit(function (event) {
        event.preventDefault();

        var url = 'Group/AddNewGroup';
        var param = {
            "GroupName": $("#GroupName").val(),
            "GroupDesc": $("#GroupDesc").val(),
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
                    response.ErrMsg = "Add new group successfully!";
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
});