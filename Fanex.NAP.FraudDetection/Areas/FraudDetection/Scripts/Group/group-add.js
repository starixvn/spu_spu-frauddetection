$(document).ready(function () {
    $("#btn_addGroup").click(function () {
        addGroup.submit();
    });

    $("#btn_Cancel").click(function () {
        $("div#popup").dialog("destroy").remove();
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
                if (response.IsSuccessful) {
                    setTimeout(function() {
                        DialogService.closeDialog();
                    }, 3000);
                    Search();
                }

                AlertServiceOnPopup.showAlert(response);
            },
            beforeSend: function () {

            },
            complete: function () {
            }
        });
    });
});