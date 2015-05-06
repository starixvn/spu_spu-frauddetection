function editGroupStatus(obj, groupId) {

    if ($(obj).hasClass('ico-tick')) {

        confirm('Do you want to deactivate this group ?', function () {
            $(obj).removeClass('ico-tick').addClass('ico-untick');

            var url = 'Group/EditGroupStatus?groupId=' + groupId + '&status=false';

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
                        document.location = currentDomainURL + "/Group/List";
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
        confirm('Do you want to activate this group ?', function () {
            $(obj).removeClass('ico-untick').addClass('ico-tick');

            var url = 'Group/EditGroupStatus?groupId=' + groupId + '&status=true';

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
                        document.location = currentDomainURL + "/Group/List";
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

function deleteGroup(groupId, groupName) {

    confirm('Do you want to delete this group (' + groupName + ') ?', function () {
        var url = 'Group/DeleteGroup?groupId=' + groupId

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
                    document.location = currentDomainURL + "/Group/List";
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
