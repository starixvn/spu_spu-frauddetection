var _groupId = 0;
var _groupName = "";
var gridOptions
        , _pageIndex = 0
        , _pageSize = 10;

$(document).ready(function () {    
    OnSearch();
    OnInitialize();
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
        PageSize: _pageSize,
        PageIndex: _pageIndex
    };

    $.ajax({
        url: "Group/GetGroupList",
        type: 'POST',
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(searchParams),
        cache: false,
        success: function (results) {
            results = results.replace(/\n/g, "<\/br>");
            results = FraudDetectionScripts.formatFanexGridStringResult(results);
            gridOptions =
            {
                columns: [
                    { HeaderText: "#", Width: 20, Name: "Row", HeaderAlign: "center", CellAlign: "center" },                    
                    { HeaderText: "GroupId", Width: 100, Name: "GroupId", HeaderAlign: "center", CellAlign: "left" },                    
                    { HeaderText: "Group Name", Width: 200, Name: "GroupName", HeaderAlign: "center", CellAlign: "left" },                    
                    { HeaderText: "Description", Width: 300, Name: "GroupDesc", HeaderAlign: "center", CellAlign: "left" }, 
                    { HeaderText: "Active", Width: 50, Name: "Active", HeaderAlign: "center", CellAlign: "center" },                  
                    { HeaderText: "Action", Width: 50, Name: "Action", HeaderAlign: "center", CellAlign: "center" }        
                ],
                bodyRows: results[0].data,
                hideYBackGroundScroller: true,
                gridExpandHeight: 150,
                allowTruncate: true,
                enableHiddenColumns: false,
                hiddenColumns: [1], 
                //numberOfFrozenColumn: 2,
                showPager: true,
                customPager: true,
                pagerOption: {
                    itemsPerPage: _pageSize,
                    currentPage: _pageIndex,
                    totalItem: results[1].totalItem,
                    itemsPerPageArray: [10, 20, 50, 100, 500],
                    pagerSelectCallBack: ReRenderAfterPaged
                }
            };

            for (var i = 0; i < gridOptions.bodyRows.length; i++) {
                // Modify "Active" column                
                gridOptions.bodyRows[i].Columns[4].Row = i;
                gridOptions.bodyRows[i].Columns[4].CustomCellRender = ActiveColumn;               

                // Modify "Action" column
                gridOptions.bodyRows[i].Columns =  FraudDetectionScripts.insertAtIndex(
                    gridOptions.bodyRows[i].Columns,
                    5,
                    { Name: "Action", Row: i });
                gridOptions.bodyRows[i].Columns[5].CustomCellRender = ActionColumn;                
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
    var groupId = gridOptions.bodyRows[cell.Row].Columns[1].Value;

    if (cell.Value == "True") {
            return "<img title='Deactivate this Group' class='ico-tick' alt='' onclick='editGroupStatus(this," + groupId + ")'/>";
        }
        else {
            return "<img title='Activate this Group' class='ico-untick' alt='' onclick='editGroupStatus(this," + groupId + ")'/>";
        }
}

function ActionColumn(cell, cellFormated) {
    return "<div class='btn-action' onclick=\"javascript:ShowAction('" + cell.Row + "');\"></div>";
}

function ShowAction(cellRow) {
    var groupId = gridOptions.bodyRows[cellRow].Columns[1].Value;
    var groupName = gridOptions.bodyRows[cellRow].Columns[2].Value;    

    _groupId = groupId;
    _groupName = groupName;

    //$.contextMenu('destroy'); -- using if items of menu are updated
    $.contextMenu({
        selector: '.btn-action',
        items: {
            deleteGroup: {
                name: "Delete",
                height: 25,
                className: "iconDelAff",
                callback: function (key, opt) {
                    deleteGroup(_groupId, _groupName);
                }
            },            
            editInfo: {
                name: "Edit Information",
                height: 25,
                className: "iconEditInfo",
                callback: function (key, opt) {
                    var updateParam = $.param({
                        GroupName: _groupName,
                    });

                    window.location.href = "/Group/EditGroupInfo/" + _groupId+ "?" + updateParam;
                }
            }           
        },
        trigger: "left",
        ignoreRightClick: true,
        autoHide: true
    });
}