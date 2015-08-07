var caseDetailService = (function ($) {
    "use strict";
    var caseDetailService = {};

    caseDetailService._taskId = 0;
    caseDetailService.taskName = "";
    caseDetailService._caseId = 0;
    caseDetailService.gridOptions = "";
    caseDetailService._pageIndex = 0;
    caseDetailService._pageSize = 50;

    caseDetailService.Search = function () {
        $('#PageSize').val(caseDetailService._pageSize);
        $('#PageIndex').val(caseDetailService._pageIndex);

        var searchParams = {
            CaseId: caseDetailService._caseId,
            PageSize: caseDetailService._pageSize,
            PageIndex: caseDetailService._pageIndex
        };

        caseFactory.getCaseDetail(searchParams).success(function (result) {
            renderCaseDetailTable(result);
        });

        caseDetailService.getCustomerGroupByCase();
    };

    caseDetailService.editTask = function (taskId) {
        window.location.href = "/Task/EditTask" + "?taskId=" + taskId;
    };

    /*
    * Activate/deactivate a task.
    */
    caseDetailService.editTaskStatus = function (obj, taskId) {
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
            text: "Are you sure you really want to " + active + "this Task?",
            confirm: function () {
                var criteria = {
                    "TaskId": taskId,
                    "IsActive": !isActive
                };

                caseFactory.editTaskStatus(criteria).success(function (response) {
                    if (response.IsSuccessful) {
                        caseDetailService.Search();
                    }

                    AlertService.showAlert(response);
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

    function renderCaseDetailTable(result) {
        result = result.replace(/\n/g, "<\/br>");
        result = FraudDetectionScripts.formatFanexGridStringResult(result);
        caseDetailService.gridOptions =
            {
                columns: [
                    { HeaderText: "#", Width: 30, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "TaskId", Width: 100, Name: "TaskId", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Task Name", Width: 300, Name: "TaskName", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Description", Width: 500, Name: "TaskDesc", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Type", Width: 250, Name: "Type", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Active", Width: 50, Name: "Active", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "Edit", Width: 50, Name: "Edit", HeaderAlign: "center", CellAlign: "center" }
                ],
                bodyRows: result[0].data,
                hideYBackGroundScroller: true,
                gridExpandHeight: 180,
                allowTruncate: true,
                enableHiddenColumns: false,
                hiddenColumns: [1],
                showPager: true,
                customPager: true,
                pagerOption: {
                    itemsPerPage: caseDetailService._pageSize,
                    currentPage: caseDetailService._pageIndex,
                    totalItem: result[1].totalItem,
                    itemsPerPageArray: [10, 20, 50, 100, 500],
                    pagerSelectCallBack: reRenderAfterPaged
                }
            };

        for (var i = 0; i < caseDetailService.gridOptions.bodyRows.length; i++) {
            // Modify "Active" column
            caseDetailService.gridOptions.bodyRows[i].Columns[5].Row = i;
            caseDetailService.gridOptions.bodyRows[i].Columns[5].CustomCellRender = activeColumn;

            // Modify "Action" column
            caseDetailService.gridOptions.bodyRows[i].Columns = FraudDetectionScripts.insertAtIndex(
                    caseDetailService.gridOptions.bodyRows[i].Columns,
                    6,
                    { Name: "Edit", Row: i });
            caseDetailService.gridOptions.bodyRows[i].Columns[6].CustomCellRender = actionColumn;
        }

        $("#SearchResult").fanexGrid(caseDetailService.gridOptions);

    }

    function reRenderAfterPaged(pageIndex, itemsPerPage) {
        if (itemsPerPage != $('#PageSize').val()) {
            $('#PageIndex').val(0);
            caseDetailService._pageIndex = 0;
        } else {
            $('#PageIndex').val(pageIndex);
            caseDetailService._pageIndex = pageIndex;
        }

        $('#PageSize').val(itemsPerPage);
        caseDetailService._pageSize = itemsPerPage;

        caseDetailService.gridOptions.pagerOption.currentPage = pageIndex;

        caseDetailService.Search();

        return false;
    }

    function activeColumn(cell) {
        var taskId = caseDetailService.gridOptions.bodyRows[cell.Row].Columns[1].Value;

        if (cell.Value == "True") {
            return "<img title='Deactivate this task' class='ico-tick' alt='' onclick='caseDetailService.editTaskStatus(this," + taskId + ")'/>";
        }
        else {
            return "<img title='Activate this task' class='ico-untick' alt='' onclick='caseDetailService.editTaskStatus(this," + taskId + ")'/>";
        }
    }

    function actionColumn(cell) {
        var taskId = caseDetailService.gridOptions.bodyRows[cell.Row].Columns[1].Value;
        return "<div class='btn-action' onclick=\"caseDetailService.editTask(" + taskId + ");\"></div>";
    }

    /*
     * Case Group Grid Service
     */

    //private methods

    var caseId = $("#CaseId").val();

    var getBodyRowsForCaseGroupTable = function (data) {
        var bodyRows = [];

        $.each(data, function (index, element) {
            var removeValue = "<span class='glyphicon glyphicon-trash' onclick='caseDetailService.removeCustomerGroupFromCase({0}, {1});' style='cursor: pointer'>".format(element.CaseId, element.GroupId);
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

    var getGridOptionForCaseGroupTable = function (data) {

        var gridOptions = {
            columns: [
                { HeaderText: "#", Width: 30, Name: "No", HeaderAlign: "center", CellAlign: "center", CustomAttr: "title='demo title'" },
                { HeaderText: "Name", Width: 200, Name: "GroupName", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Description", Width: 300, Name: "GroupDescription", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Remove", Width: 50, Name: "Remove", HeaderAlign: "center", CellAlign: "center" }],
            bodyRows: getBodyRowsForCaseGroupTable(data),
            showNumberColumn: true,
            showTitle: true,
            allowTruncate: true,
            titleInfo:
            {
                text: "Customer Groups In This Case",
                showButtonsWhenNoData: true,
                customButtons: "<span class='glyphicon glyphicon-plus' onclick='caseDetailService.addCustomerGroupToCase({0});' style='cursor: pointer'/>&nbsp;".format(caseId)
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

    caseDetailService.getCustomerGroupByCase = function () {
        caseFactory.getCustomerGroupByCase(caseId).success(function (data) {
            var gridOptions = getGridOptionForCaseGroupTable(data);
            $("#CaseGroupResult").fanexGrid(gridOptions);
        }).error(function (error) {
            alert(error);
        });        
    };

    caseDetailService.addCustomerGroupToCase = function (caseId) {
        caseFactory.addCustomerGroupToCase(caseId).success(function (response) {
            DialogService.openDialogContent(response, "Add Customer Group To Case", {
                width: 580,
                maxHeight: 450
            });
        });
    };

    caseDetailService.removeCustomerGroupFromCase = function (caseId, groupId) {
        AlertService.hideAlert();

        $.confirm({
            confirmButtonClass: 'btn-green btn-customConfirm',
            cancelButtonClass: 'btn-green btn-customCancel',
            title: "Delete confirmation",
            text: "Are you sure you really want to remove this group from the fraud case?",
            confirm: function () {
                caseFactory.removeCustomerGroupFromCase(caseId, groupId).success(function (data) {
                    if (data.IsSuccessful) {
                        caseDetailService.getCustomerGroupByCase(caseId);
                    }

                    AlertService.showAlert(data);
                });
            },
            cancel: function () {
            },
            confirmButton: "Delete",
            cancelButton: "Cancel"
        });

    };

    return caseDetailService;

})(jQuery);