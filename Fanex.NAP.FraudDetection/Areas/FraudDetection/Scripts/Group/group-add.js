function OnInitialize() {
    $("#btn_AddNewGroup").click(function () {
        var url = 'Group/AddNewGroup';
        $.ajax({
            type: "GET",
            contentType: 'application/json',
            dataType: "text",
            cache: false,
            url: url,
            error: function () {
            },
            success: function (response) {
                $('<div id="popup"></div>')
                .appendTo('body')
                .dialog({
                    modal: true,
                    title: "Add New Group",
                    zIndex: 10000,
                    autoOpen: true,
                    width: '500px',
                    resizable: false,
                    close: function () {
                        $(this).remove();
                    }
                })
                .html(response); 
            },
            beforeSend: function () {

            },
            complete: function () {
            }
        });
    });    
}