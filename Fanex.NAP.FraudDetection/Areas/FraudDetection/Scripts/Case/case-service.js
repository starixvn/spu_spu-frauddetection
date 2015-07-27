var caseService = (function ($) {
    "use strict";
    var caseService = {};

    caseService._caseId = 0;
    caseService._caseName = "";
    caseService.gridOptions = "";
    caseService._pageIndex = 0;
    caseService._pageSize = 50;

    caseService.Search = function () {
        $('#PageSize').val(caseService._pageSize);
        $('#PageIndex').val(caseService._pageIndex);

        var searchParams = {
            PageSize: caseService._pageSize,
            PageIndex: caseService._pageIndex
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

    function renderCaseTable(result) {
        result = result.replace(/\n/g, "<\/br>");
        result = FraudDetectionScripts.formatFanexGridStringResult(result);
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
                bodyRows: result[0].data,
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
                    totalItem: result[1].totalItem,
                    itemsPerPageArray: [10, 20, 50, 100, 500],
                    pagerSelectCallBack: reRenderAfterPaged
                }
            };

        for (var i = 0; i < caseService.gridOptions.bodyRows.length; i++) {
            // Modify "Case Name" column
            caseService.gridOptions.bodyRows[i].Columns[2].Row = i;
            caseService.gridOptions.bodyRows[i].Columns[2].CustomCellRender = caseNameColumn;

            // Modify "Active" column
            caseService.gridOptions.bodyRows[i].Columns[4].Row = i;
            caseService.gridOptions.bodyRows[i].Columns[4].CustomCellRender = activeColumn;

            // Modify "Action" column
            caseService.gridOptions.bodyRows[i].Columns = FraudDetectionScripts.insertAtIndex(
                    caseService.gridOptions.bodyRows[i].Columns,
                    5,
                    { Name: "Edit", Row: i });
            caseService.gridOptions.bodyRows[i].Columns[5].CustomCellRender = editColumn;
        }

        $("#SearchResult").fanexGrid(caseService.gridOptions);
    };

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
        var caseId = caseService.gridOptions.bodyRows[cell.Row].Columns[1].Value;
        var caseName = caseService.gridOptions.bodyRows[cell.Row].Columns[2].Value;

        var url = "Case/GetCaseDetail?caseId=" + caseId;
        return "<a href=" + url + ">" + caseName + "</a>";
    }

    function activeColumn(cell) {
        var caseId = caseService.gridOptions.bodyRows[cell.Row].Columns[1].Value;

        if (cell.Value == "True") {
            return "<img title='Deactivate this case' class='ico-tick' alt='' onclick='caseService.editCaseStatus(this," + caseId + ")'/>";
        }
        else {
            return "<img title='Activate this case' class='ico-untick' alt='' onclick='caseService.editCaseStatus(this," + caseId + ")'/>";
        }
    }

    function editColumn(cell) {
        var caseId = caseService.gridOptions.bodyRows[cell.Row].Columns[1].Value;

        return "<img title='Edit Group's Info' class='btn-action' alt='' onclick='caseService.editCaseInfo(" + caseId + ")'/>";
    }

    return caseService;

})(jQuery);