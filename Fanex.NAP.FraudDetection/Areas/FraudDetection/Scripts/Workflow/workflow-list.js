var _workflowId = 0;
var _workflowName = "";
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
        url: "Workflow/GetWorkflowList",
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
                    { HeaderText: "WorkflowId", Width: 100, Name: "WorkflowId", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Workflow Name", Width: 200, Name: "WorkflowName", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Description", Width: 300, Name: "WorkflowDesc", HeaderAlign: "center", CellAlign: "left" },
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
                // Modify "Workflow Name" column
                gridOptions.bodyRows[i].Columns[2].Row = i;
                gridOptions.bodyRows[i].Columns[2].CustomCellRender = WorkflowNameColumn;

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
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(xhr);
        },
        complete: function (jqXHR, textStatus) {
        }
    });
}

function ReRenderAfterPaged(pageIndex, itemsPerPage, jq) {
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

function WorkflowNameColumn(cell, cellFormated) {
    var workflowId = gridOptions.bodyRows[cell.Row].Columns[1].Value;
    var workflowName = gridOptions.bodyRows[cell.Row].Columns[2].Value;

    var url = "Workflow/WorkflowDetail?workflowId=" + workflowId;
    return "<a href=" + url + ">" + workflowName + "</a>";
}


function ActiveColumn(cell, cellFormated) {
    var workflowId = gridOptions.bodyRows[cell.Row].Columns[1].Value;

    if (cell.Value == "True") {
        return "<img title='Deactivate this workflow' class='ico-tick' alt='' onclick='editWorkflowStatus(this," + workflowId + ")'/>";
    }
    else {
        return "<img title='Activate this workflow' class='ico-untick' alt='' onclick='editWorkflowStatus(this," + workflowId + ")'/>";
    }
}

function EditColumn(cell, cellFormated) {
    var workflowId = gridOptions.bodyRows[cell.Row].Columns[1].Value;

    return "<img title='Edit Group's Info' class='btn-action' alt='' onclick='editWorkflowInfo(" + workflowId + ")'/>";
}

$("#btn_AddNewWorkflow").click(function () {
    var url = 'Workflow/AddNewWorkflow';
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        dataType: "text",
        cache: false,
        url: url,
        error: function () {
        },
        success: function (response) {
            $('<div id="popup"></div>')
            .appendTo('body')
            .dialog({
                modal: true,
                title: "Add New Workflow",
                zIndex: 10000,
                autoOpen: true,
                width: '500px',
                resizable: false,
                close: function () {
                    $(this).remove();
                }
            })
            .html(response);
        },
        beforeSend: function () {

        },
        complete: function () {
        }
    });
});