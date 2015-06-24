var _taskId = 0;
var _taskName = "";
var _workflowId = 0;
var gridOptions
        , _pageIndex = 0
        , _pageSize = 10;

$(document).ready(function () {    
    _workflowId = $("#WorkFlowId").val();
    Search();
});
//--------------------------------------------------------------------------------------------------------------------

function OnSearch() {
    _pageIndex = 0;
    _pageSize = 10;

    Search();
};

function Search() {
    $('#PageSize').val(_pageSize);
    $('#PageIndex').val(_pageIndex);
    
    var searchParams = {              
        WorkflowId:  _workflowId,
        PageSize: _pageSize,
        PageIndex: _pageIndex
    };

    $.ajax({
        url: "GetWorkflowDetail",
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
                    { HeaderText: "TaskId", Width: 100, Name: "TaskId", HeaderAlign: "center", CellAlign: "left" },                    
                    { HeaderText: "Task Name", Width: 200, Name: "TaskName", HeaderAlign: "center", CellAlign: "left" },                    
                    { HeaderText: "Description", Width: 300, Name: "TaskDesc", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Type", Width: 250, Name: "Type", HeaderAlign: "center", CellAlign: "left" },                    
                    { HeaderText: "Active", Width: 50, Name: "Active", HeaderAlign: "center", CellAlign: "center" },                    
                    { HeaderText: "Edit", Width: 50, Name: "Edit", HeaderAlign: "center", CellAlign: "center" }                                        
                ],
                bodyRows: result[0].data,
                hideYBackGroundScroller: true,
                gridExpandHeight: 150,
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
                // Modify "Active" column                
                gridOptions.bodyRows[i].Columns[5].Row = i;
                gridOptions.bodyRows[i].Columns[5].CustomCellRender = ActiveColumn;
                                
                // Modify "Action" column
                gridOptions.bodyRows[i].Columns =  FraudDetectionScripts.insertAtIndex(
                    gridOptions.bodyRows[i].Columns,
                    6,
                    { Name: "Edit", Row: i });
                gridOptions.bodyRows[i].Columns[6].CustomCellRender = ActionColumn;
            }

            $("#SearchResult").fanexGrid(gridOptions);
        }
    });
}

function ReRenderAfterPaged(page_index, itemsPerPage, jq) {
    if (itemsPerPage != $('#PageSize').val()) {
        $('#PageIndex').val(0);
        _pageIndex = 0;
    } else {
        $('#PageIndex').val(page_index);
        _pageIndex = page_index
    }

    $('#PageSize').val(itemsPerPage);
    _pageSize = itemsPerPage;

    gridOptions.pagerOption.currentPage = page_index;
    Search();

    return false;
}

function ActiveColumn(cell, cellFormated) {
    var taskId = gridOptions.bodyRows[cell.Row].Columns[1].Value;

    if (cell.Value == "True") {
            return "<img title='Deactivate this task' class='ico-tick' alt='' onclick='editActive(this," + taskId + ")'/>";
        }
        else {
            return "<img title='Activate this task' class='ico-untick' alt='' onclick='editActive(this," + taskId + ")'/>";
        }
}

function ActionColumn(cell, cellFormated) {
    var taskId = gridOptions.bodyRows[cell.Row].Columns[1].Value;
    return "<div class='btn-action' onclick=\"EditTask(" + taskId + ");\"></div>";
}

function EditTask(taskId) {
    window.location.href = "/Task/TaskEditInfo" + "?taskId=" + taskId;
}

$("#btn_AddNewTask").click(function () {    
     window.location.href = "/Task" + "?workflowId=" + _workflowId;    
});