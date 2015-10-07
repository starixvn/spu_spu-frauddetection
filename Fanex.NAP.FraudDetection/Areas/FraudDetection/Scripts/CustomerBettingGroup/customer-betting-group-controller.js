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
                        $("#customers-in-betting-group").hide();
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
  
    var currentGroup = 0;

    customerBettingGroupController.openPopupEditCustomer = function (groupId) {
        currentGroup = groupId;
        customerBettingGroupModel.getGroupById(groupId).then(function () {
            var group = customerBettingGroupModel.group;
            renderCustomerTable(group.Customers, groupId);
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

    customerBettingGroupController.getAssociationCustomers = function (custid) {
        waitingDialog.show("Please wait...", { dialogSize: 'sm' });

        customerBettingGroupFactory.getAssociationCustomers(custid).success(function (response) {
            DialogService.openDialogContent(response, "Sum Win Loss Of Association Members", {
                width: 800,
                maxHeight: 450
            });

            waitingDialog.hide();
        });
    };

    /*
    * Render customer betting group.
    */
    var renderCustomerBettingGroupTable = function (groups) {
        var gridOptions = {
            columns:
            [
                { HeaderText: "Group Id", Width: 60, Name: "GroupId", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Currency", Width: 300, Name: "Currency", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "# Customer", Width: 100, Name: "Customers", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Remove", Width: 60, Name: "Remove", HeaderAlign: "center", CellAlign: "center" }
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
            },
            showHighlightRow: true,
            showTitle: true,
            titleInfo:
                {
                    text: "Customer Betting Group List"
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
                    { Name: "GroupId", Value: groups[index].GroupId },
                    { Name: "Currency", Value: groups[index].Currencies },
                    { Name: "Customers", Value: groups[index].Customers.length },
                    { Name: "Remove", Value: groups[index].GroupId, CustomCellRender: actionColumn }
                ],
                CssClass: "betting-group-row",
                CustomAttr: "data-groupid=" + groups[index].GroupId
            });
        }

        return rows;
    };

    /*
    * Action Column template.
    */
    var actionColumn = function (cell) {
        return "<div style='cursor: pointer;' class='glyphicon glyphicon-trash' onclick=\"customerBettingGroupController.deleteGroup(" + cell.Value + ");\"></div>";
    };
 
    /*
    * Render customer.
    */
    var renderCustomerTable = function (customers, groupId) {
        var gridOptions = {
            columns:
            [
                { HeaderText: "#", Width: 30, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Member", Width: 300, Name: "Member", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Currency", Width: 150, Name: "Currency", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Remove", Width: 60, Name: "Remove", HeaderAlign: "center", CellAlign: "center" }
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
            },
            showTitle: true,
            titleInfo:
                {
                    text: "Member List - Group " + groupId
                }
        };

        $("#customers-in-betting-group").fanexGrid(gridOptions);
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
                    { Name: "Member", Value: customers[index], CustomCellRender: memberColumn},
                    { Name: "Currency", Value: customers[index].Currency.CurrencyName },
                    { Name: "Remove", Value: customers[index], CustomCellRender: deleteColumn }
                ]
            });
        }

        return rows;
    };

    var memberColumn = function (cell) {
        return "<div ><a style='cursor: pointer;' onclick='customerBettingGroupController.getAssociationCustomers(" + cell.Value.CustId + ")'>" + cell.Value.CustName + "</a></div>";
    };

    /*
    * Delete Column.
    */
    var deleteColumn = function (cell) {
        var groupId = currentGroup;
        return "<div style='cursor: pointer;' class='glyphicon glyphicon-trash' onclick=\"customerBettingGroupController.deleteCustomer(" + cell.Value.CustId + "," + groupId + ");\"></div>";
    };

    return customerBettingGroupController;

})(jQuery);