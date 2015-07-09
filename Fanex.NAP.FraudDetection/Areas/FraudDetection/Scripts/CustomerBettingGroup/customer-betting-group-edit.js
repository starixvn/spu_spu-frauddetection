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

                formSearch.submit();
            }
            else {
                $("#addResult").attr('class', 'result-text-fail');
                $("#addResult").html(response.ErrMsg);
            }
        });
    });
});