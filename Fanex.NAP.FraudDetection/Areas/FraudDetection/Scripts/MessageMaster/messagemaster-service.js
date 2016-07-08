var messMasterService = (function ($) {
    "use strict";
    var messMasterService = {};

    messMasterService.mailUlr = '';

    messMasterService.isHostPermission = false;

    messMasterService.getAllMail = function () {
        messMasterFactory.getMessages().success(function (result) {
            renderMessageTable(result);
        });
    };

    messMasterService.editMailStatus = function (obj, messageId) {
        if (messMasterService.isHostPermission) {
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
                text: "Are you sure you really want to " + active + " this message?",
                confirm: function () {
                    messMasterFactory.editMailStatus(messageId, !isActive).success(function (result) {
                        isActive = !isActive;
                        AlertService.showAlert(result);

                        $(".confirmation-modal").modal("hide");
                    });
                },
                cancel: function () {
                },
                confirmButton: "OK",
                cancelButton: "Cancel"
            });

            $(document).on('hidden.bs.modal', function () {
                if (!isActive) {
                    $(obj).removeClass('ico-tick').addClass('ico-untick');
                } else {
                    $(obj).removeClass('ico-untick').addClass('ico-tick');
                }

                $(document).off('hidden.bs.modal');
            });
        }
    };

    messMasterService.deleteMessage = function (mailId) {
        $.confirm({
            confirmButtonClass: 'btn-green btn-customConfirm',
            cancelButtonClass: 'btn-green btn-customCancel',
            title: "Delete confirmation",
            text: "Are you sure you really want to delete this message?",
            confirm: function () {
                $(".confirmation-modal").modal("hide");

                messMasterFactory.deleteMessage(mailId).success(function (result) {
                    if (result.IsSuccessful) {
                        messMasterService.getAllMail();
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

    messMasterService.updateMessage = function (mailId) {
        window.location.href = window.location.href.toString() + '/EditMail?mailId=' + mailId;
    };

    messMasterService.showAction = function (messageId) {
        if (!messMasterService.isHostPermission) {
            $.contextMenu({
                selector: '#edit' + messageId,
                items: {
                    editMessage: {
                        name: "Show message",
                        height: 25,
                        className: "iconEditInfo",
                        callback: function () {
                            messMasterService.updateMail(messageId);
                        }
                    }
                },
                trigger: "left",
                ignoreRightClick: true,
                autoHide: true
            });
        } else {
            $.contextMenu({
                selector: '#edit' + messageId,
                items: {
                    deleteMessage: {
                        name: "Delete this message",
                        height: 25,
                        className: "iconDelAff",
                        callback: function () {
                            messMasterService.deleteMessage(messageId);
                        }
                    },
                    editMessage: {
                        name: "Edit message",
                        height: 25,
                        className: "iconEditInfo",
                        callback: function () {
                            messMasterService.updateMessage(messageId);
                        }
                    }
                },
                trigger: "left",
                ignoreRightClick: true,
                autoHide: true
            });
        }

    };

    //messMasterService.addMail = function (mail) {
    //    mailMasterFactory.addMail(mail).success(function (result) {
    //        if (result.IsSuccessful) {
    //            window.location.href = window.location.href.split('/AddMail', 1)[0].toString();
    //        } else {
    //            AlertService.showAlert(result);
    //        }
    //    });
    //};

    //messMasterService.editMail = function (mail) {
    //    mailMasterFactory.editMail(mail).success(function (result) {
    //        if (result.IsSuccessful) {
    //            window.location.href = window.location.href.split('/EditMail', 1)[0].toString();
    //        } else {
    //            AlertService.showAlert(result);
    //        }
    //    });
    //};

    /*
    * Render mails.
    */
    function renderMessageTable(messageDatas) {
        var gridOptions = {
            columns:
                [
                    { HeaderText: "#", Width: 20, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "Message Code", Width: 300, Name: "MessCode", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Description", Width: 500, Name: "Description", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Active", Width: 50, Name: "Active", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "Edit", Width: 50, Name: "Edit", HeaderAlign: "center", CellAlign: "center" }
                ],
            bodyRows: createMessageTable(messageDatas),
            gridExpandHeight: 180,
            showPager: true,
            enableHiddenColumns: false,
            pagerOption:
            {
                itemsPerPage: 50,
                currentPage: 0,
                itemsPerPageArray: [10, 20, 50, 100, 500],
                showDetail: true
            }
        };

        $("#messageMasterId").fanexGrid(gridOptions);
    }

    /*
    * Create the data for rendering.
    */
    function createMessageTable(messageDatas) {
        var rows = [];

        for (var index = 0; index < messageDatas.length; index++) {
            rows.push({
                Columns: [
                    { Name: "Row", Value: index + 1 },
                    { Name: "MessCode", Value: messageDatas[index].MessageCode },
                    { Name: "Description", Value: messageDatas[index].MessageDesc },
                    { Name: "Active", Value: messageDatas[index], CustomCellRender: activeColumn },
                    { Name: "Edit", Value: messageDatas[index].MessageId, CustomCellRender: actionColumn }
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
            return "<img title='Deactivate this email' class='ico-tick' alt='' onclick=\"messMasterService.editMailStatus(this," + cell.Value.MessageId + ");\"/>";
        }
        else {
            return "<img title='Activate this email' class='ico-untick' alt='' onclick=\"messMasterService.editMailStatus(this," + cell.Value.MessageId + ");\"/>";
        }
    }

    /*
    * Action Column template.
    */
    function actionColumn(cell) {
        return "<div id ='edit" + cell.Value + "' class='btn-action' onclick=\"messMasterService.showAction(" + cell.Value + ");\"></div>";
    }

    return messMasterService;

})(jQuery);