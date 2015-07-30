var caseService = (function ($) {
    "use strict";
    var caseService = {};

    caseService._caseId = 0;
    caseService._caseName = "";
    caseService.gridOptions = "";
    caseService._pageIndex = 0;
    caseService._pageSize = 50;

    caseService.Search = function () {
        debugger;
        $('#PageSize').val(caseService._pageSize);
        $('#PageIndex').val(caseService._pageIndex);

        var searchParams = {
            PageSize: caseService._pageSize,
            PageIndex: caseService._pageIndex + 1
        };

        caseFactory.getCases(searchParams).success(function (result) {
            renderCaseTable(result);
        });
    };

    caseService.getEmptyCase = function () {
        caseFactory.getEmptyCase().success(function (response) {
            DialogService.setDialogId("popup");
            DialogService.openDialogContent(response, "Add Case", {
                width: '500px'
            });
        });
    };

    caseService.addCase = function (fraudCase) {
        caseFactory.addCase(fraudCase).success(function (response) {
            if (response.IsSuccessful) {
                setTimeout(function () {
                    DialogService.closeDialog();
                }, 3000);

                caseService.Search();
            }

            AlertServiceOnPopup.showAlert(response);
        });
    };

    caseService.editCase = function (fraudCase) {
        caseFactory.editCase(fraudCase).success(function (response) {
            if (response.IsSuccessful) {
                setTimeout(function () {
                    DialogService.closeDialog();
                }, 3000);

                caseService.Search();
            }

            AlertServiceOnPopup.showAlert(response);
        });
    };

    /*
    * Edit a case.
    */
    caseService.editCaseInfo = function (caseId) {
        $.get('Case/EditCaseInfo', { caseId: caseId }, function (response) {
            DialogService.setDialogId("popup");
            DialogService.openDialogContent(response, "Edit Case", {
                width: '500px'
            });
        });
    };

    /*
    * Activate/deactivate a case.
    */
    caseService.editCaseStatus = function (obj, caseId) {
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
            text: "Are you sure you really want to " + active + "this Case?",
            confirm: function () {
                caseFactory.editCaseStatus(caseId, !isActive).success(function (response) {
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

    function renderCaseTable(caseList) {
        caseService.gridOptions =
            {
                columns: [
                    { HeaderText: "#", Width: 20, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "CaseId", Width: 100, Name: "CaseId", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Case Name", Width: 300, Name: "CaseName", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Description", Width: 500, Name: "CaseDesc", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Active", Width: 50, Name: "Active", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "Edit", Width: 50, Name: "Edit", HeaderAlign: "center", CellAlign: "center" }
                ],
                bodyRows: createCaseTable(caseList.Cases),
                hideYBackGroundScroller: true,
                gridExpandHeight: 180,
                allowTruncate: true,
                enableHiddenColumns: false,
                hiddenColumns: [1],
                showPager: true,
                customPager: true,
                pagerOption: {
                    itemsPerPage: caseService._pageSize,
                    currentPage: caseService._pageIndex,
                    totalItem: caseList.TotalItem,
                    itemsPerPageArray: [10, 20, 50, 100, 500],
                    pagerSelectCallBack: reRenderAfterPaged
                }
            };

        $("#SearchResult").fanexGrid(caseService.gridOptions);
    };

    /*
    * Create the data for rendering.
    */
    function createCaseTable(cases) {
        var rows = [];

        for (var index = 0; index < cases.length; index++) {
            var fraudCase = cases[index];
            rows.push({
                Columns: [
                    { Name: "Row", Value: fraudCase.Row },
                    { Name: "CaseName", Value: fraudCase, CustomCellRender: caseNameColumn },
                    { Name: "CaseDesc", Value: fraudCase.CaseDesc },
                    { Name: "Active", Value: fraudCase, CustomCellRender: activeColumn },
                    { Name: "Edit", Value: fraudCase.CaseId, CustomCellRender: editColumn }
                ]
            });
        }

        return rows;
    }

    function reRenderAfterPaged(pageIndex, itemsPerPage) {
        if (itemsPerPage != $('#PageSize').val()) {
            $('#PageIndex').val(0);
            caseService._pageIndex = 0;
        } else {
            $('#PageIndex').val(pageIndex);
            caseService._pageIndex = pageIndex;
        }

        $('#PageSize').val(itemsPerPage);
        caseService._pageSize = itemsPerPage;

        caseService.gridOptions.pagerOption.currentPage = pageIndex;
        caseService.Search();

        return false;
    }

    function caseNameColumn(cell) {
        var caseId = cell.Value.CaseId;
        var caseName = cell.Value.CaseName;

        var url = "Case/GetCaseDetail?caseId=" + caseId;
        return "<a href=" + url + ">" + caseName + "</a>";
    }

    function activeColumn(cell) {
        var caseId = cell.Value.CaseId;

        if (cell.Value.IsActive) {
            return "<img title='Deactivate this case' class='ico-tick' alt='' onclick='caseService.editCaseStatus(this," + caseId + ")'/>";
        }
        else {
            return "<img title='Activate this case' class='ico-untick' alt='' onclick='caseService.editCaseStatus(this," + caseId + ")'/>";
        }
    }

    function editColumn(cell) {
        var caseId = cell.Value;

        return "<img title='Edit Group's Info' class='btn-action' alt='' onclick='caseService.editCaseInfo(" + caseId + ")'/>";
    }

    /*
     * Case Group Grid Service
     */

    // private methods

    //var caseId = $("#CaseId").val();

    //var getBodyRowsForCaseGroupTable = function (data) {
    //    var bodyRows = [];

    //    $.each(data, function (index, element) {
    //        var removeValue = "<span class='glyphicon glyphicon-trash' onclick='CaseGroupGridService.removeCustomerGroupFromCase({0}, {1});' style='cursor: pointer'>".format(element.CaseId, element.GroupId);
    //        bodyRows.push({
    //            Columns: [
    //                { Name: "No", Value: index + 1 },
    //                { Name: "GroupName", Value: element.GroupName },
    //                { Name: "GroupDescription", Value: element.GroupDescription },
    //                { Name: "Remove", Value: removeValue }
    //            ]
    //        });
    //    });

    //    return bodyRows;
    //};

    //var getGridOptionForCaseGroupTable = function (data) {

    //    var gridOptions = {
    //        columns: [
    //            { HeaderText: "#", Width: 30, Name: "No", HeaderAlign: "center", CellAlign: "center", CustomAttr: "title='demo title'" },
    //            { HeaderText: "Name", Width: 200, Name: "GroupName", HeaderAlign: "center", CellAlign: "left" },
    //            { HeaderText: "Description", Width: 300, Name: "GroupDescription", HeaderAlign: "center", CellAlign: "left" },
    //            { HeaderText: "Remove", Width: 50, Name: "Remove", HeaderAlign: "center", CellAlign: "center" }],
    //        bodyRows: getBodyRowsForCaseGroupTable(data),
    //        showNumberColumn: true,
    //        showTitle: true,
    //        allowTruncate: true,
    //        titleInfo:
    //        {
    //            text: "Customer Groups In This Case",
    //            showButtonsWhenNoData: true,
    //            customButtons: "<span class='glyphicon glyphicon-plus' onclick='CaseGroupGridService.addCustomerGroupToCase({0});' style='cursor: pointer'/>&nbsp;".format(caseId)
    //        },
    //        showPager: true,
    //        pagerOption: {
    //            itemsPerPage: 10,
    //            currentPage: 0,
    //            itemsPerPageArray: [10, 20, 50, 100, 500],
    //            showDetail: true
    //        }
    //    };

    //    return gridOptions;
    //};

    //// public methods

    //caseService.getCustomerGroupByCase = function () {
    //    var url = SPU.getAbsoluteUrl("CaseGroup/GetCustomerGroupsInCase");
    //    var param = { caseId: caseId };

    //    $.ajax({
    //        type: "POST",
    //        contentType: 'application/json',
    //        dataType: "json",
    //        data: JSON.stringify(param),
    //        cache: false,
    //        url: url,
    //        error: function (error) {
    //            alert(error);
    //        },
    //        success: function (data) {
    //            var gridOptions = getGridOptionForCaseGroupTable(data);
    //            $("#CaseGroupResult").fanexGrid(gridOptions);
    //        }
    //    });
    //};

    //caseService.addCustomerGroupToCase = function (caseId) {
    //    var url = SPU.getAbsoluteUrl("CaseGroup/AddCustomerGroupToCase?caseId={0}".format(caseId));
    //    $.ajax({
    //        type: "GET",
    //        contentType: 'application/json',
    //        dataType: "text",
    //        cache: false,
    //        url: url,
    //        error: function () {
    //        },
    //        success: function (response) {
    //            DialogService.openDialogContent(response, "Add Customer Group To Case", {
    //                width: 580,
    //                height: 400
    //            });
    //        },
    //        beforeSend: function () {

    //        },
    //        complete: function () {
    //        }
    //    });
    //};

    //caseService.removeCustomerGroupFromCase = function (caseId, groupId) {
    //    AlertService.hideAlert();

    //    $.confirm({
    //        confirmButtonClass: 'btn-green btn-customConfirm',
    //        cancelButtonClass: 'btn-green btn-customCancel',
    //        title: "Delete confirmation",
    //        text: "Are you sure you really want to remove this group from the fraud case?",
    //        confirm: function () {
    //            var url = SPU.getAbsoluteUrl("CaseGroup/RemoveCustomerGroupFromCase");
    //            var param = {
    //                caseId: caseId,
    //                groupId: groupId
    //            };

    //            $.ajax({
    //                type: "POST",
    //                contentType: 'application/json',
    //                dataType: "json",
    //                data: JSON.stringify(param),
    //                cache: false,
    //                url: url,
    //                error: function (error) {
    //                    alert(error);
    //                },
    //                success: function (data) {
    //                    if (data.IsSuccessful) {
    //                        service.getCustomerGroupByCase();
    //                    }

    //                    AlertService.showAlert(data);
    //                }
    //            });
    //        },
    //        cancel: function () {
    //        },
    //        confirmButton: "Delete",
    //        cancelButton: "Cancel"
    //    });

    //};

    return caseService;

})(jQuery);