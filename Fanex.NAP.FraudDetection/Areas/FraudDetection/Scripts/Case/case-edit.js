$(document).ready(function () {
    $("#btn_editCase").click(function () {
        editCaseForm.submit();
    });

    $("#btn_Cancel").click(function () {
        DialogService.closeDialog();
    });

    var editCaseForm = $('#EditCaseForm').submit(function (event) {
        event.preventDefault();

        $.post(this.action, $(this).serialize(), function (response) {
            if (response.IsSuccessful) {
                setTimeout(function () {
                    DialogService.closeDialog();
                }, 3000);
                Search();
            }

            AlertService.setAlertId('sentAlertOnPopup');
            AlertService.showAlert(response);
        });
    });
});

/*
* Edit a case.
*/
function editCaseInfo(caseId) {
    $.get('Case/EditCaseInfo', { caseId: caseId }, function (response) {
        DialogService.setDialogId("popup");
        DialogService.openDialogContent(response, "Edit Case", {
            width: '500px'
        });
    });
}

/*
* Activate/deactivate a case.
*/
function editCaseStatus(obj, caseId) {
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
        text: "Are you sure to " + active + "this Case?",
        confirm: function () {
            $.post('Case/EditCaseStatus', { caseId: caseId, isActive: !isActive }, function (result) {
                if (result.IsSuccessful) {
                    Search();
                }

                AlertService.showAlert(result);
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