var _taskId = 0;
var _taskName = "";
var _caseId = 0;
var gridOptions
        , _pageIndex = 0
        , _pageSize = 50;

$(document).ready(function () {
    _caseId = $("#CaseId").val();
    Search();
    CaseGroupGridService.getCustomerGroupByCase();
});
//--------------------------------------------------------------------------------------------------------------------

function OnSearch() {
    _pageIndex = 0;
    _pageSize = 50;

    Search();
};

function Search() {
    $('#PageSize').val(_pageSize);
    $('#PageIndex').val(_pageIndex);
    
    var searchParams = {
        CaseId:  _caseId,
        PageSize: _pageSize,
        PageIndex: _pageIndex
    };

    $.ajax({
        url: "GetCaseDetail",
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
                    { HeaderText: "#", Width: 30, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "TaskId", Width: 100, Name: "TaskId", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Task Name", Width: 200, Name: "TaskName", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Description", Width: 300, Name: "TaskDesc", HeaderAlign: "center", CellAlign: "left" },
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

function ActiveColumn(cell) {
    var taskId = gridOptions.bodyRows[cell.Row].Columns[1].Value;

    if (cell.Value == "True") {
        return "<img title='Deactivate this task' class='ico-tick' alt='' onclick='editTaskStatus(this," + taskId + ")'/>";
        }
        else {
            return "<img title='Activate this task' class='ico-untick' alt='' onclick='editTaskStatus(this," + taskId + ")'/>";
        }
}

function ActionColumn(cell) {
    var taskId = gridOptions.bodyRows[cell.Row].Columns[1].Value;
    return "<div class='btn-action' onclick=\"EditTask(" + taskId + ");\"></div>";
}

function EditTask(taskId) {
    window.location.href = "/Task/TaskEditInfo" + "?taskId=" + taskId;
}

$("#btn_AddNewTask").click(function () {
     window.location.href = "/Task" + "?caseId=" + _caseId;
 });

 /*
 * Activate/deactivate a task.
 */
 function editTaskStatus(obj, taskId) {
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
         text: "Are you sure to " + active + "this Task?",
         confirm: function () {
             var url = 'EditTaskStatus';
             var param = {
                 "TaskId": taskId,
                 "IsActive": !isActive
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
                     if (response.IsSuccessful) {
                         Search();
                     }
                     
                     AlertService.showAlert(response);
                 }
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
 }

var CaseGroupGridService = (function($) {
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
                { HeaderText: "Remove", Width: 50, Name: "Remove", HeaderAlign: "center", CellAlign: "center" }],
            bodyRows: getBodyRows(data),
            showNumberColumn: true,
            showTitle: true,
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

    service.init = function() {
        

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
                //DialogService.setDialogId("popup");
                DialogService.openDialogContent(response, "Add Customer Group To Case", {
                    width: 500,
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
            text: "This is very dangerous, you shouldn't do it! Are you really really sure?",
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