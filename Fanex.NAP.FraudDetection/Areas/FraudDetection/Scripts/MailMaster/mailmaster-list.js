$(function () {
    "use strict";

    formSearch.submit();
});

var formSearch = $('#mailSearch').submit(function () {
    $.get('MailMaster/Search', function (mailTemplates) {
        renderMailTable(mailTemplates);
    });
});

/*
* Render mails.
*/
function renderMailTable(mailTemplates) {
    var gridOptions = {
        columns:
                [
                    { HeaderText: "#", Width: 20, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "Mail Code", Width: 200, Name: "MailCode", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Description", Width: 300, Name: "Description", HeaderAlign: "center", CellAlign: "left" },
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
                    { Name: "Active", Value: mailTemplates[index], CustomCellRender: ActiveColumn },
                    { Name: "Edit", Value: mailTemplates[index].MailId, CustomCellRender: ActionColumn }
                ]
        });
    }

    return rows;
}

/*
* Active Column template.
*/
function ActiveColumn(cell) {
    if (cell.Value.IsActive) {
        return "<img title='Deactivate this email' class='ico-tick' alt='' onclick=\"editActive(this," + cell.Value.MailId + ");\"/>";
    }
    else {
        return "<img title='Activate this email' class='ico-untick' alt='' onclick=\"editActive(this," + cell.Value.MailId + ");\"/>";
    }
}

/*
* Action Column template.
*/
function ActionColumn(cell) {
    return "<div id ='edit" + cell.Value + "' class='btn-action' onclick=\"ShowAction(" + cell.Value + ");\"></div>";
}

/*
* Action.
*/
function ShowAction(mailId) {
    $.contextMenu({
        selector: '#edit' + mailId,
        items: {
            deleteMail: {
                name: "Delete this mail",
                height: 25,
                className: "iconDelAff",
                callback: function () {
                    deleteMail(mailId);
                }
            },
            editInfo: {
                name: "Edit information",
                height: 25,
                className: "iconEditInfo",
                callback: function () {
                    updateMail(mailId);
                }
            }
        },
        trigger: "left",
        ignoreRightClick: true,
        autoHide: true
    });
}

/*
* Delete mail template.
*/
function deleteMail(mailId) {
    $.confirm({
        confirmButtonClass: 'btn-green btn-customConfirm',
        cancelButtonClass: 'btn-green btn-customCancel',
        title: "Delete confirmation",
        text: "This is very dangerous, you shouldn't do it! Are you really really sure?",
        confirm: function () {
            $.post('MailMaster/DeleteMail', { mailId: mailId }, function (result) {
                if (result.ErrCode === 0) {
                    formSearch.submit();
                }
                else {
                    alert(result.ErrMsg);
                }
            });
        },
        cancel: function () {
        },
        confirmButton: "Delete",
        cancelButton: "Cancel"
    });
}

/*
* Delete mail template.
*/
function updateMail(mailId) {
    window.location.href = '/MailMaster/Update?mailId=' + mailId;
}

/*
* Activate/deactivate mail template.
*/
function editActive(obj, mailId) {
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
        text: "Are you sure to " + active + "this mail template?",
        confirm: function () {
            $.post('MailMaster/ActivateMail', { mailId: mailId, isActive: !isActive }, function (result) {
                if (result.ErrCode === 0) {
                    formSearch.submit();
                }
                else {
                    alert(result.ErrMsg);
                }
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