$(document).ready(function () {
//    //Process redirect to Case list.
//    var successed = $("#successed").val();
//    if (successed == "true") {
//        confirm('Successfull!\nPress OK to continue', function () {
    //            document.location = currentDomainURL + "/Case/List";
//        });
//    }
        
});

//--------------------------------------------------------------------------------------------------------------------

function editActive(obj, caseId) {

    if ($(obj).hasClass('ico-tick')) {

        confirm('Do you want to deactivate this task?', function () {
            $(obj).removeClass('ico-tick').addClass('ico-untick');

            var url = 'EditActive?caseId=' + caseId + '&status=false';

            //todo
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'html',
                cache: false,
                beforeSend: function () {
                },
                success: function (result) {
                    result = result.toLowerCase();

                    if (result == 'successfully!') {
                        document.location = currentDomainURL + "/Case/List";
                    }
                    else {
                        alert(result);
                    }
                },
                error: function (xhr, status, err) {
                }
            });
        });
    }
    else {
        confirm('Do you want to activate this case ?', function () {
            $(obj).removeClass('ico-untick').addClass('ico-tick');

            var url = 'EditActive?caseId=' + caseId + '&status=true';

            //todo
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'html',
                cache: false,
                beforeSend: function (xhr) {
                },
                success: function (result) {
                    result = result.toLowerCase();

                    if (result == 'successfully!') {
                        document.location = currentDomainURL + "/Case/List";
                    }
                    else {
                        alert(result);
                    }
                },
                error: function (xhr, status, err) {
                }
            });
        });
    }

};

function deleteCase(caseId, name) {

    confirm('Do you want to delete this case (' + name + ') ?', function () {

        var url = 'Delete?caseId=' + caseId;

        //todo
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'html',
            cache: false,
            beforeSend: function (xhr) {
                //NAP.loadingBox.show();
                //NAP.closePopup();
            },
            success: function (result) {
                //NAP.loadingBox.close();
                result = result.toLowerCase();

                if (result == 'successfully!') {
                    document.location = currentDomainURL + "/Case/List";
                    //NAP.headlineMsgBox.showErr("Unknowned error detected!");
                }
                else {
                    alert(result);
                    //NAP.headlineMsgBox.showInfo("Added '" + username + "'. You will be redirected in 3s.", { closeBtn: false, modal: true });
                    //NAP.redirect('User/Manage?SiteId=0', 3000);
                }
            },
            error: function (xhr, status, err) {
                //NAP.handleAjaxError(xhr, status, err);
            }
        });
    });
}