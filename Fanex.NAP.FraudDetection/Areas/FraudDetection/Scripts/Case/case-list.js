var _caseId = 0;
var _caseName = "";
var gridOptions
        , _pageIndex = 0
        , _pageSize = 50;

$(document).ready(function () {
    Search();
});

function OnSearch() {
    _pageIndex = 0;
    _pageSize = 50;

    Search();
};

function Search() {
    $('#PageSize').val(_pageSize);
    $('#PageIndex').val(_pageIndex);

    var searchParams = {
        PageSize: _pageSize,
        PageIndex: _pageIndex
    };

    $.ajax({
        url: "Case/GetCaseList",
        type: 'POST',
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(searchParams),
        cache: false,
        success: function (result) {
            result = result.replace(/\n/g, "<\/br>");
            result = FraudDetectionScripts.formatFanexGridStringResult(result);
            gridOptions =
            {
                columns: [
                    { HeaderText: "#", Width: 20, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "CaseId", Width: 100, Name: "CaseId", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Case Name", Width: 200, Name: "CaseName", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Description", Width: 300, Name: "CaseDesc", HeaderAlign: "center", CellAlign: "left" },
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
                    itemsPerPage: _pageSize,
                    currentPage: _pageIndex,
                    totalItem: result[1].totalItem,
                    itemsPerPageArray: [10, 20, 50, 100, 500],
                    pagerSelectCallBack: ReRenderAfterPaged
                }
            };

            for (var i = 0; i < gridOptions.bodyRows.length; i++) {
                // Modify "Case Name" column
                gridOptions.bodyRows[i].Columns[2].Row = i;
                gridOptions.bodyRows[i].Columns[2].CustomCellRender = CaseNameColumn;

                // Modify "Active" column
                gridOptions.bodyRows[i].Columns[4].Row = i;
                gridOptions.bodyRows[i].Columns[4].CustomCellRender = ActiveColumn;

                // Modify "Action" column
                gridOptions.bodyRows[i].Columns = FraudDetectionScripts.insertAtIndex(
                    gridOptions.bodyRows[i].Columns,
                    5,
                    { Name: "Edit", Row: i });
                gridOptions.bodyRows[i].Columns[5].CustomCellRender = EditColumn;
            }

            $("#SearchResult").fanexGrid(gridOptions);
        },
        error: function () {
            //alert(xhr);
        },
        complete: function () {
        }
    });
}

function ReRenderAfterPaged(pageIndex, itemsPerPage) {
    if (itemsPerPage != $('#PageSize').val()) {
        $('#PageIndex').val(0);
        _pageIndex = 0;
    } else {
        $('#PageIndex').val(pageIndex);
        _pageIndex = pageIndex;
    }

    $('#PageSize').val(itemsPerPage);
    _pageSize = itemsPerPage;

    gridOptions.pagerOption.currentPage = pageIndex;
    Search();

    return false;
}

function CaseNameColumn(cell) {
    var caseId = gridOptions.bodyRows[cell.Row].Columns[1].Value;
    var caseName = gridOptions.bodyRows[cell.Row].Columns[2].Value;

    var url = "Case/CaseDetail?caseId=" + caseId;
    return "<a href=" + url + ">" + caseName + "</a>";
}


function ActiveColumn(cell) {
    var caseId = gridOptions.bodyRows[cell.Row].Columns[1].Value;

    if (cell.Value == "True") {
        return "<img title='Deactivate this case' class='ico-tick' alt='' onclick='editCaseStatus(this," + caseId + ")'/>";
    }
    else {
        return "<img title='Activate this case' class='ico-untick' alt='' onclick='editCaseStatus(this," + caseId + ")'/>";
    }
}

function EditColumn(cell) {
    var caseId = gridOptions.bodyRows[cell.Row].Columns[1].Value;

    return "<img title='Edit Group's Info' class='btn-action' alt='' onclick='editCaseInfo(" + caseId + ")'/>";
}

$("#btn_addNewCase").click(function () {
    var url = 'Case/AddNewCase';
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        dataType: "text",
        cache: false,
        url: url,
        error: function () {
        },
        success: function (response) {
            DialogService.setDialogId("popup");
            DialogService.openDialogContent(response, "Add New Case", {
                width: '500px'
            });
        },
        beforeSend: function () {

        },
        complete: function () {
        }
    });
});