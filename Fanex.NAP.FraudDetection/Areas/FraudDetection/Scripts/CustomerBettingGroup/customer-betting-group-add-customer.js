$(function () {
    "use strict";

    $("#btn_addCustomer").click(function () {
        addCustomer.submit();
    });

    $("#btn_Cancel").click(function () {
        $("div#popup").dialog("destroy").remove();
    });

    var addCustomer = $("#EditCustomerForm").submit(function (event) {
        event.preventDefault();

        var url = 'CustomerBettingGroup/EditCustomers';
        var param = {
            "CustomerName": $("#CustomerName").val(),
            "GroupId": $("#GroupId").val()
        };
        $.ajax({
            type: "POST",
            contentType: 'application/json',
            dataType: "json",
            data: JSON.stringify(param),
            cache: false,
            url: url,
            error: function () {
            },
            success: function (response) {
                if (response.ErrCode == 0) {
                    $("#addResult").attr('class', 'result-text-success');
                    $("#addResult").html("Add new group successfully!");
                    setTimeout(function () {
                        $("div#popup").dialog("destroy").remove();
                    }, 3000);

                    getCustomer.submit();
                }
                else {
                    $("#addResult").attr('class', 'result-text-fail');
                    $("#addResult").html(response.ErrMsg);
                }
            },
            beforeSend: function () {

            },
            complete: function () {
            }
        });
    });
});

var getCustomer = $('#customer-betting-group-search-customers').submit(function () {
    var groupId = $("#GroupId").val();
    $.get('CustomerBettingGroup/GetGroupById', { groupId: groupId }, function (group) {
        renderCustomerTable(group.Customers);
    });
});

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
                    { Name: "Delete", Value: customers[index].CustId }
                ]
        });
    }

    return rows;
};