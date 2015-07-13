var CaseGroupController = (function ($) {

    var service = {};

    var getBodyRows = function (data) {
        var bodyRows = [];

        $.each(data, function (index, element) {
            bodyRows.push({
                Columns: [
                    { Name: "No", Value: index + 1 },
                    { Name: "Selection", Value: "<input type='checkbox' class='checkItem' data-groupid='" + element.GroupId + "' />" },
                    { Name: "GroupName", Value: element.GroupName },
                    { Name: "GroupDesc", Value: element.GroupDescription }
                ]
            });
        });

        return bodyRows;
    };

    var getGridOption = function (data) {

        var gridOptions = {
            columns: [
                { HeaderText: "#", Width: 30, Name: "No", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "<input type='checkbox' id='checkAll' />", Width: 30, Name: "Selection", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Name", Width: 120, Name: "GroupName", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Description", Width: 250, Name: "GroupDesc", HeaderAlign: "center", CellAlign: "left" }
            ],
            bodyRows: getBodyRows(data),
            showNumberColumn: true,
            showPager: true,
            fullHeight: false,
            gridHeight: 320,
            pagerOption: {
                itemsPerPage: 10,
                currentPage: 0,
                itemsPerPageArray: [10, 20, 50, 100, 500],
                showDetail: true
            }
        };

        return gridOptions;
    };

    var getAvailableCustomerGroups = function (data) {
        var gridOptions = getGridOption(data);
        $("#AvailableGroups").fanexGrid(gridOptions);
    };

    var bindEventOnElements = function() {
        $("#spu-dialog-frame #btn_addGroup").on("click", function (event) {
            event.preventDefault();
            CaseGroupController.addCustomerGroupToCase();
        });

        $("#spu-dialog-frame #btn_Cancel").on("click", function () {
            DialogService.closeDialog();
        });

        $("#checkAll").on('click', function() {
            var checked = $(this).prop('checked');
            $(".checkItem").prop('checked', checked);
        });

        $(".checkItem").on('click', function() {
            var itemCount = $(".checkItem").length;
            var checkedItemCount = $(".checkItem:checked").length;

            if (itemCount === checkedItemCount) {
                $("#checkAll").prop('checked', true);
            } else {
                $("#checkAll").prop('checked', false);
            }
        });
    };

    var collectSelectedCustomerGroups = function () {
        var checkedElements = $(".checkItem:checked");
        var selectedGroups = [];
        $.each(checkedElements, function (idx, ele) {
            var groupId = $(ele).data('groupid');
            selectedGroups.push(groupId);
        });

        return selectedGroups;
    };

    var validateCustomerGroup = function () {
        return $(".checkItem:checked").length > 0 ? true : false;
    };

    service.addCustomerGroupToCase = function() {
        var url = SPU.getAbsoluteUrl("CaseGroup/AddCustomerGroupToCase");

        if (validateCustomerGroup() === false) {
            AlertService.setAlertId('sentAlertOnPopup');
            AlertService.showAlert('Please select at least one customer group');
            return;
        };

        var param = {
            caseId: caseId,
            groupIds: collectSelectedCustomerGroups().join(',')
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
                    setTimeout(function () {
                        DialogService.closeDialog();
                    }, 3000);

                    CaseGroupGridService.getCustomerGroupByCase();
                }

                AlertService.setAlertId('sentAlertOnPopup');
                AlertService.showAlert(data);
                AlertService.setAlertId('sentAlert');
            }
        });
    };

    service.init = function () {
        getAvailableCustomerGroups(groups);

        bindEventOnElements();
    };

    return service;

})(jQuery);

(function ($) {
    CaseGroupController.init();
})(jQuery);