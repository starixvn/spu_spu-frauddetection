var CaseGroupGridService = (function ($) {
    var service = {};

    // private methods

    var caseId = $("#CaseId").val();

    var getBodyRows = function (data) {
        var bodyRows = [];

        $.each(data, function (index, element) {
            var removeValue = "<span class='glyphicon glyphicon-trash' onclick='CaseGroupGridService.removeCustomerGroupFromCase({0}, {1});' style='cursor: pointer'>".format(element.CaseId, element.GroupId);
            bodyRows.push({
                Columns: [
                    { Name: "No", Value: index + 1 },
                    { Name: "GroupName", Value: element.GroupName },
                    { Name: "GroupDescription", Value: element.GroupDescription },
                    { Name: "Remove", Value: removeValue }
                ]
            });
        });

        return bodyRows;
    };

    var getGridOption = function (data) {

        var gridOptions = {
            columns: [
                { HeaderText: "#", Width: 30, Name: "No", HeaderAlign: "center", CellAlign: "center", CustomAttr: "title='demo title'" },
                { HeaderText: "Name", Width: 200, Name: "GroupName", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Description", Width: 300, Name: "GroupDescription", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Remove", Width: 50, Name: "Remove", HeaderAlign: "center", CellAlign: "center"}],
            bodyRows: getBodyRows(data),
            showNumberColumn: true,
            showTitle: true,
            allowTruncate: true,
            titleInfo:
            {
                text: "Customer Groups In This Case",
                showButtonsWhenNoData: true,
                customButtons: "<span class='glyphicon glyphicon-plus' onclick='CaseGroupGridService.addCustomerGroupToCase({0});' style='cursor: pointer'/>&nbsp;".format(caseId)
            },
            showPager: true,
            pagerOption: {
                itemsPerPage: 10,
                currentPage: 0,
                itemsPerPageArray: [10, 20, 50, 100, 500],
                showDetail: true
            }
        };

        return gridOptions;
    };

    // public methods

    service.init = function () {


    };

    service.getCustomerGroupByCase = function () {
        var url = SPU.getAbsoluteUrl("CaseGroup/GetCustomerGroupsInCase");
        var param = { caseId: caseId };

        $.ajax({
            type: "POST",
            contentType: 'application/json',
            dataType: "json",
            data: JSON.stringify(param),
            cache: false,
            url: url,
            error: function (error) {
                alert(error);
            },
            success: function (data) {
                var gridOptions = getGridOption(data);
                $("#CaseGroupResult").fanexGrid(gridOptions);
            }
        });
    };

    service.addCustomerGroupToCase = function (caseId) {
        var url = SPU.getAbsoluteUrl("CaseGroup/AddCustomerGroupToCase?caseId={0}".format(caseId));
        $.ajax({
            type: "GET",
            contentType: 'application/json',
            dataType: "text",
            cache: false,
            url: url,
            error: function () {
            },
            success: function (response) {
                DialogService.openDialogContent(response, "Add Customer Group To Case", {
                    width: 580,
                    height: 400
                });
            },
            beforeSend: function () {

            },
            complete: function () {
            }
        });
    };

    service.removeCustomerGroupFromCase = function (caseId, groupId) {
        AlertService.hideAlert();

        $.confirm({
            confirmButtonClass: 'btn-green btn-customConfirm',
            cancelButtonClass: 'btn-green btn-customCancel',
            title: "Delete confirmation",
            text: "Are you sure you really want to remove this group from the fraud case?",
            confirm: function () {
                var url = SPU.getAbsoluteUrl("CaseGroup/RemoveCustomerGroupFromCase");
                var param = {
                    caseId: caseId,
                    groupId: groupId
                };

                $.ajax({
                    type: "POST",
                    contentType: 'application/json',
                    dataType: "json",
                    data: JSON.stringify(param),
                    cache: false,
                    url: url,
                    error: function (error) {
                        alert(error);
                    },
                    success: function (data) {
                        if (data.IsSuccessful) {
                            service.getCustomerGroupByCase();
                        }

                        AlertService.showAlert(data);
                    }
                });
            },
            cancel: function () {
            },
            confirmButton: "Delete",
            cancelButton: "Cancel"
        });


    };

    return service;
})(jQuery);