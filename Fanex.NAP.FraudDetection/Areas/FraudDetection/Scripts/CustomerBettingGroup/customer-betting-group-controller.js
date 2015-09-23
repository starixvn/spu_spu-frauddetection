var customerBettingGroupController = (function ($) {
    "use strict";

    var customerBettingGroupController = {};

    customerBettingGroupController.queryGroup = function () {
        customerBettingGroupModel.getGroups().then(function () {
            renderCustomerBettingGroupTable(customerBettingGroupModel.groups);
        });
    };

    customerBettingGroupController.queryCustomer = function (groupId) {
        customerBettingGroupModel.getGroupById(groupId).then(function () {
            renderCustomerTable(customerBettingGroupModel.group.Customers);
        });
    };

    customerBettingGroupController.openPopupAddGroup = function () {
        customerBettingGroupModel.getEmptyGroup().then(function () {
            var groupModel = customerBettingGroupModel.serverResult;

            DialogService.setDialogId("popup");
            DialogService.openDialogContent(groupModel, "Add Betting Group", {
                width: '500px'
            });
        });
    };

    customerBettingGroupController.addGroup = function (group) {
        customerBettingGroupModel.addGroup(group).then(function () {
            var result = customerBettingGroupModel.serverResult;

            if (result.IsSuccessful) {
                setTimeout(function () {
                    DialogService.closeDialog();
                }, 3000);

                customerBettingGroupController.queryGroup();
            }

            AlertServiceOnPopup.showAlert(result);
        });
    };

    customerBettingGroupController.editGroup = function (group) {
        customerBettingGroupModel.editGroup(group).then(function () {
            var result = customerBettingGroupModel.serverResult;

            if (result.IsSuccessful) {
                setTimeout(function () {
                    DialogService.closeDialog();
                }, 3000);

                customerBettingGroupController.queryGroup();
            }

            AlertServiceOnPopup.showAlert(result);
        });
    };

    customerBettingGroupController.addCustomer = function (customer) {
        customerBettingGroupModel.addCustomer(customer).then(function () {
            var result = customerBettingGroupModel.serverResult;

            if (result.IsSuccessful) {
                setTimeout(function () {
                    //DialogService.closeDialog();
                }, 3000);

                customerBettingGroupController.queryCustomer(customer.GroupId);
                customerBettingGroupController.queryGroup();
            }

            AlertServiceOnPopup.showAlert(result);
        });
    };

    customerBettingGroupController.editCustomerBettingGroup = function (groupId) {
        $.contextMenu({
            selector: '#edit' + groupId,
            items: {
                deleteGroup: {
                    name: "Delete this group",
                    height: 25,
                    className: "iconDelAff",
                    callback: function () {
                        customerBettingGroupController.deleteGroup(groupId);
                    }
                },
                editInfo: {
                    name: "Edit information",
                    height: 25,
                    className: "iconEditInfo",
                    callback: function () {
                        customerBettingGroupController.editGroupInfo(groupId);
                    }
                }
            },
            trigger: "left",
            ignoreRightClick: true,
            autoHide: true
        });
    };

    customerBettingGroupController.deleteGroup = function (groupId) {
        $.confirm({
            confirmButtonClass: 'btn-green btn-customConfirm',
            cancelButtonClass: 'btn-green btn-customCancel',
            title: "Delete confirmation",
            text: "Are you sure you really want to delete this betting group?",
            confirm: function () {
                $(".confirmation-modal").modal("hide");

                customerBettingGroupModel.deleteGroup(groupId).then(function () {
                    var result = customerBettingGroupModel.serverResult;

                    if (result.IsSuccessful) {
                        customerBettingGroupController.queryGroup();
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

    customerBettingGroupController.editGroupInfo = function (groupId) {
        customerBettingGroupModel.getGroupInfo(groupId).then(function () {
            var groupModal = customerBettingGroupModel.group;

            DialogService.setDialogId("popup");
            DialogService.openDialogContent(groupModal, "Edit Group", {
                width: '500px'
            });
        });
    };

    customerBettingGroupController.openPopupEditCustomer = function (groupId) {
        customerBettingGroupModel.getEmptyCustomer(groupId).then(function () {
            var customerModal = customerBettingGroupModel.customer;

            customerBettingGroupModel.getGroupById(groupId).then(function () {
                var group = customerBettingGroupModel.group;

                var groupName = group.Name;
                var title = "Add Customer: " + groupName;

                DialogService.setDialogId("popup");
                DialogService.openDialogContent(customerModal, title, {
                    position: { my: "top+63%", at: "center top", of: window },
                    width: '500px'
                });

                renderCustomerTable(group.Customers);
            });
        });
    };

    customerBettingGroupController.deleteCustomer = function (custId, groupId) {
        $.confirm({
            confirmButtonClass: 'btn-green btn-customConfirm',
            cancelButtonClass: 'btn-green btn-customCancel',
            title: "Delete confirmation",
            text: "Are you sure you really want to delete this customer from betting group?",
            confirm: function () {
                $(".confirmation-modal").modal("hide");

                customerBettingGroupModel.deleteCustomer(custId, groupId).then(function () {
                    var result = customerBettingGroupModel.serverResult;

                    if (result.IsSuccessful) {
                        customerBettingGroupController.queryCustomer(groupId);

                        customerBettingGroupController.queryGroup();
                    }

                    AlertServiceOnPopup.showAlert(result);
                });
            },
            cancel: function () {
            },
            confirmButton: "Delete",
            cancelButton: "Cancel"
        });
    };

    /*
    * Render customer betting group.
    */
    var renderCustomerBettingGroupTable = function (groups) {
        var gridOptions = {
            columns:
            [
                { HeaderText: "#", Width: 20, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Name", Width: 300, Name: "Name", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Description", Width: 500, Name: "Description", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Currency", Width: 150, Name: "Currency", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "# Customer", Width: 100, Name: "Customers", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Edit", Width: 50, Name: "Edit", HeaderAlign: "center", CellAlign: "center" }
            ],
            bodyRows: createCustomerBettingGroupTable(groups),
            gridExpandHeight: 180,
            showPager: true,
            allowTruncate: true,
            pagerOption:
            {
                itemsPerPage: 50,
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
        return "<div id ='edit" + cell.Value + "' class='btn-action' onclick=\"customerBettingGroupController.editCustomerBettingGroup(" + cell.Value + ");\"></div>";
    };

    /*
    * Customer Column template.
    */
    var customerColumn = function (cell) {
        return "<a style='cursor: pointer;' onclick=\"customerBettingGroupController.openPopupEditCustomer(" + cell.Value.GroupId + ");\">" + cell.Value.Customers.length + "</a>";
    };

    /*
    * Render customer.
    */
    var renderCustomerTable = function (customers) {
        var gridOptions = {
            columns:
            [
                { HeaderText: "#", Width: 20, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Member", Width: 210, Name: "Member", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Currency", Width: 150, Name: "Currency", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Delete", Width: 50, Name: "Delete", HeaderAlign: "center", CellAlign: "center" }
            ],
            bodyRows: createCustomerTable(customers),
            gridExpandHeight: 500,
            showPager: true,
            pagerOption:
            {
                itemsPerPage: 50,
                currentPage: 0,
                itemsPerPageArray: [10, 20, 50, 100, 500],
                showDetail: true
            }
        };

        $("#customer-betting-group-customers").fanexGrid(gridOptions);
    };

    /*
    * Generate data.
    */
    var createCustomerTable = function (customers) {
        var rows = [];

        for (var index = 0; index < customers.length; index++) {
            rows.push({
                Columns: [
                    { Name: "Row", Value: index + 1 },
                    { Name: "Member", Value: customers[index].CustName },
                    { Name: "Currency", Value: customers[index].Currency.CurrencyName },
                    { Name: "Delete", Value: customers[index], CustomCellRender: deleteColumn }
                ]
            });
        }

        return rows;
    };

    /*
    * Delete Column.
    */
    var deleteColumn = function (cell) {
        var groupId = $("#GroupId").val();
        return "<div style='cursor: pointer;' class='glyphicon glyphicon-trash' onclick=\"customerBettingGroupController.deleteCustomer(" + cell.Value.CustId + "," + groupId + ");\"></div>";
    };

    return customerBettingGroupController;

})(jQuery);