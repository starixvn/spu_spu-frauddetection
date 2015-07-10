$(function () {
    "use strict";

    formSearch.submit();

    /*
    * Add new group.
    */
    $("#btn_addNewCustomerBettingGroup").click(function () {
        $.get('CustomerBettingGroup/AddNewGroup', function (response) {
            DialogService.setDialogId("popup");
            DialogService.openDialogContent(response, "Add New Group", {
                width: '500px'
            });
        });
    });
});

var formSearch = $('#customer-betting-group-search').submit(function () {
    $.get('CustomerBettingGroup/GetAllGroups', function (groups) {
        renderCustomerBettingGroupTable(groups);
    });
});

/*
* Render customer betting group.
*/
var renderCustomerBettingGroupTable = function (groups) {
    var gridOptions = {
        columns:
            [
                { HeaderText: "#", Width: 20, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Name", Width: 200, Name: "Name", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Description", Width: 300, Name: "Description", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Currency", Width: 150, Name: "Currency", HeaderAlign: "center", CellAlign: "left", AllowTruncate: true },
                { HeaderText: "# Customer", Width: 100, Name: "Customers", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Edit", Width: 50, Name: "Edit", HeaderAlign: "center", CellAlign: "center" }
            ],
        bodyRows: createCustomerBettingGroupTable(groups),
        gridExpandHeight: 180,
        showPager: true,
        pagerOption:
            {
                itemsPerPage: 10,
                currentPage: 0,
                itemsPerPageArray: [10, 20, 50, 100, 500],
                showDetail: true
            }
    };

    $("#customer-betting-group").fanexGrid(gridOptions);
};

/*
* Generate data.
*/
var createCustomerBettingGroupTable = function (groups) {
    var rows = [];

    for (var index = 0; index < groups.length; index++) {
        rows.push({
            Columns: [
                    { Name: "Row", Value: index + 1 },
                    { Name: "Name", Value: groups[index].Name },
                    { Name: "Description", Value: groups[index].Description },
                    { Name: "Currency", Value: groups[index].Currencies },
                    { Name: "Customers", Value: groups[index], CustomCellRender: customerColumn },
                    { Name: "Edit", Value: groups[index].GroupId, CustomCellRender: actionColumn }
                ]
        });
    }

    return rows;
};

/*
* Action Column template.
*/
var actionColumn = function (cell) {
    return "<div id ='edit" + cell.Value + "' class='btn-action' onclick=\"editCustomerBettingGroup(" + cell.Value + ");\"></div>";
};

/*
* Customer Column template.
*/
var customerColumn = function (cell) {
    return "<a style='cursor: pointer;' onclick=\"editCustomers(" + cell.Value.GroupId + ");\">" + cell.Value.Customers.length + "</a>";
};

/*
* Action.
*/
function editCustomerBettingGroup(groupId) {
    $.contextMenu({
        selector: '#edit' + groupId,
        items: {
            deleteGroup: {
                name: "Delete this group",
                height: 25,
                className: "iconDelAff",
                callback: function () {
                    deleteGroup(groupId);
                }
            },
            editInfo: {
                name: "Edit information",
                height: 25,
                className: "iconEditInfo",
                callback: function () {
                    editGroupInfo(groupId);
                }
            }
        },
        trigger: "left",
        ignoreRightClick: true,
        autoHide: true
    });
}

/*
* Delete group.
*/
function deleteGroup(groupId) {
    $.confirm({
        confirmButtonClass: 'btn-green btn-customConfirm',
        cancelButtonClass: 'btn-green btn-customCancel',
        title: "Delete confirmation",
        text: "This is very dangerous, you shouldn't do it! Are you really really sure?",
        confirm: function () {
            $.post('CustomerBettingGroup/Delete', { groupId: groupId }, function (result) {
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
* Edit a group.
*/
function editGroupInfo(groupId) {
    $.get('CustomerBettingGroup/EditGroupInfo', { groupId: groupId }, function (response) {
        DialogService.setDialogId("popup");
        DialogService.openDialogContent(response, "Edit Group", {
            width: '500px'
        });
    });
}

/*
* Edit a group.
*/
function editCustomers(groupId) {
    $.get('CustomerBettingGroup/EditCustomers', { groupId: groupId }, function (response) {
        $.get('CustomerBettingGroup/GetGroupById', { groupId: groupId }, function (group) {
            var groupName = group.Name + " - ";
            var groupDesc = group.Description;
            var title = "Add Customer: " + groupName + groupDesc;

            DialogService.setDialogId("popup");
            DialogService.openDialogContent(response, title, {
                position: { my: "top+63%", at: "center top", of: window },
                width: '500px'
            });

            renderCustomerTable(group.Customers);
        });
    });
}