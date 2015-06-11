$(function () {
    "use strict";

    var formSearch = $('#mailSearch').submit(function (event) {
        $.get('MailMaster/Search', function (mailTemplates) {
            renderMailTable(mailTemplates);
        });
    });

    formSearch.submit();

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
            gridExpandHeight: 150,
            showPager: true,
            pagerOption:
            {
                itemsPerPage: 10,
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
                    { Name: "Description", Value: mailTemplates[index].MailDescription },
                    { Name: "Active", Value: mailTemplates[index].IsActive, CustomCellRender: ActiveColumn },
                    { Name: "Edit", Value: mailTemplates[index].MailId, CustomCellRender: ActionColumn }
                ]
            });
        }

        return rows;
    }

    /*
    * Active Column template.
    */
    function ActiveColumn(cell, cellFormated) {
        if (cell.Value) {
            return "<img title='Deactivate this email' class='ico-tick' alt='' onclick='editActive(true, 1)'/>";
        }
        else {
            return "<img title='Activate this email' class='ico-untick' alt='' onclick='editActive(false, 2)'/>";
        }
    }

    /*
    * Action Column template.
    */
    function ActionColumn(cell, cellFormated) {
        return "<div class='btn-action' onclick=\"ShowAction(" + cell.Value + ");\"></div>";
    }
});

/*
* Action.
*/
function ShowAction(mailId) {
    $.contextMenu({
        selector: '.btn-action',
        items: {
            deleteMail: {
                name: "Delete this mail",
                height: 25,
                className: "iconDelAff",
                callback: function (key, opt) {
                    deleteMail(mailId);
                }
            },
            editInfo: {
                name: "Edit information",
                height: 25,
                className: "iconEditInfo",
                callback: function (key, opt) {
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
        title: "Delete confirmation",
        text: "This is very dangerous, you shouldn't do it! Are you really really sure?",
        confirm: function (button) {
            $.post('MailMaster/DeleteMail', { mailId: mailId }, function (result) {
                if (result.ErrCode === 0) {
                    formSearch.submit();
                }
                else {
                    alert(result.ErrMsg);
                }
            });
        },
        cancel: function (button) {
        },
        confirmButton: "Delete",
        cancelButton: "Cancel"
    });
}

/*
* Delete mail template.
*/
function updateMail(mailId) {
    //alert('Not implement yet!');
    window.location.href = '/MailMaster/Update?mailId=' + mailId;
}

/*
* Activate/deactivate mail template.
*/
function editActive(isActive, mailId) {
    var active = isActive === true ? "deactivate " : "activate ";
    $.confirm({
        title: "Confirmation",
        text: "Are you sure to " + active + mailId + "?",
        confirm: function (button) {
            $.post('MailMaster/DeleteMail', { mailId: mailId }, function (result) {
                if (result.ErrCode === 0) {
                    formSearch.submit();
                }
                else {
                    alert(result.ErrMsg);
                }
            });
        },
        cancel: function (button) {
        },
        confirmButton: "Delete",
        cancelButton: "Cancel"
    });
}