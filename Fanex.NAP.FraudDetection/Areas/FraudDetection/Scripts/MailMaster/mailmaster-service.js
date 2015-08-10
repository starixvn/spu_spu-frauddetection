var mailMasterService = (function ($) {
    "use strict";
    var mailMasterService = {};

    mailMasterService.mailUlr = '';

    mailMasterService.queryMail = function () {
        mailMasterFactory.getMails().success(function (result) {
            renderMailTable(result);
        });
    };

    mailMasterService.editMailStatus = function (obj, mailId) {
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
            text: "Are you sure you really want to " + active + " this mail template?",
            confirm: function () {
                mailMasterFactory.editMailStatus(mailId, !isActive).success(function (result) {
                    if (result.IsSuccessful) {
                        mailMasterService.queryMail();
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
    };

    mailMasterService.deleteMail = function (mailId) {
        $.confirm({
            confirmButtonClass: 'btn-green btn-customConfirm',
            cancelButtonClass: 'btn-green btn-customCancel',
            title: "Delete confirmation",
            text: "Are you sure you really want to delete this mail?",
            confirm: function () {
                mailMasterFactory.deleteMail(mailId).success(function (result) {
                    if (result.IsSuccessful) {
                        mailMasterService.queryMail();
                    }

                    AlertService.showAlert(result);
                });
            },
            cancel: function () {
            },
            confirmButton: "Delete",
            cancelButton: "Cancel"
        });
    };

    mailMasterService.updateMail = function (mailId) {
        window.location.href = window.location.href.toString() + '/EditMail?mailId=' + mailId;
    };

    mailMasterService.showAction = function (mailId) {
        $.contextMenu({
            selector: '#edit' + mailId,
            items: {
                deleteMail: {
                    name: "Delete this mail",
                    height: 25,
                    className: "iconDelAff",
                    callback: function () {
                        mailMasterService.deleteMail(mailId);
                    }
                },
                editInfo: {
                    name: "Edit information",
                    height: 25,
                    className: "iconEditInfo",
                    callback: function () {
                        mailMasterService.updateMail(mailId);
                    }
                }
            },
            trigger: "left",
            ignoreRightClick: true,
            autoHide: true
        });
    };

    mailMasterService.addMail = function (mail) {
        mailMasterFactory.addMail(mail).success(function (result) {
            if (result.IsSuccessful) {
                window.location.href = window.location.href.split('/AddMail', 1)[0].toString();
            } else {
                AlertService.showAlert(result);
            }
        });
    };

    mailMasterService.editMail = function (mail) {
        mailMasterFactory.editMail(mail).success(function (result) {
            if (result.IsSuccessful) {
                window.location.href = window.location.href.split('/EditMail', 1)[0].toString();
            } else {
                AlertService.showAlert(result);
            }
        });
    };

    /*
    * Render mails.
    */
    function renderMailTable(mailTemplates) {
        var gridOptions = {
            columns:
                [
                    { HeaderText: "#", Width: 20, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "Mail Code", Width: 300, Name: "MailCode", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Description", Width: 500, Name: "Description", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Active", Width: 50, Name: "Active", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "Edit", Width: 50, Name: "Edit", HeaderAlign: "center", CellAlign: "center" }
                ],
            bodyRows: createMailTable(mailTemplates),
            gridExpandHeight: 180,
            showPager: true,
            pagerOption:
            {
                itemsPerPage: 50,
                currentPage: 0,
                itemsPerPageArray: [10, 20, 50, 100, 500],
                showDetail: true
            }
        };

        $("#mailMasterId").fanexGrid(gridOptions);
    }

    /*
    * Create the data for rendering.
    */
    function createMailTable(mailTemplates) {
        var rows = [];

        for (var index = 0; index < mailTemplates.length; index++) {
            rows.push({
                Columns: [
                    { Name: "Row", Value: index + 1 },
                    { Name: "MailCode", Value: mailTemplates[index].MailCode },
                    { Name: "Description", Value: mailTemplates[index].MailDesc },
                    { Name: "Active", Value: mailTemplates[index], CustomCellRender: activeColumn },
                    { Name: "Edit", Value: mailTemplates[index].MailId, CustomCellRender: actionColumn }
                ]
            });
        }

        return rows;
    }

    /*
    * Active Column template.
    */
    function activeColumn(cell) {
        if (cell.Value.IsActive) {
            return "<img title='Deactivate this email' class='ico-tick' alt='' onclick=\"mailMasterService.editMailStatus(this," + cell.Value.MailId + ");\"/>";
        }
        else {
            return "<img title='Activate this email' class='ico-untick' alt='' onclick=\"mailMasterService.editMailStatus(this," + cell.Value.MailId + ");\"/>";
        }
    }

    /*
    * Action Column template.
    */
    function actionColumn(cell) {
        return "<div id ='edit" + cell.Value + "' class='btn-action' onclick=\"mailMasterService.showAction(" + cell.Value + ");\"></div>";
    }

    return mailMasterService;

})(jQuery);