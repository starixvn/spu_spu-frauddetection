var _affId = 0;
var _affName = "";
var gridOptions
        , _pageIndex = 0
        , _pageSize = 10;

$(document).ready(function () {
    //Process redirect to Afiiliate list.
    var successed = $("#successed").val();
    if (successed == "true") {
        confirm('Successfull!\nPress OK to continue', function () {
            document.location =currentDomainURL + "/Affiliate/List";
        });
    }

    $("#Username").Watermark("Username");

    $("#Username").autocomplete({
        source: [],
        minLength: 1
    });

    $("#Username").keyup(function (e) {
        if (e.keyCode == $.ui.keyCode.ENTER) {
            Search();
        }
    });
    
    $("#DomainName").keyup(function (e) {
        if (e.keyCode == $.ui.keyCode.ENTER) {
            Search();
        }
    });

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
        UserName: $("#Username").val(),
        PageSize: _pageSize,
        PageIndex: _pageIndex
    };

    $.ajax({
        url: "GetAffiliateList",
        type: 'POST',
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(searchParams),
        cache: false,
        success: function (result) {
            result = result.replace(/\n/g, "<\/br>");
            result = OddsFeedAdminManager.formatFanexGridStringResult(result);
            gridOptions =
            {
                columns: [
                    { HeaderText: "#", Width: 20, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "PartnerId", Width: 100, Name: "PartnerId", HeaderAlign: "center", CellAlign: "right" },
                    { HeaderText: "Username", Width: 100, Name: "UserName", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Action", Width: 50, Name: "Action", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "Active", Width: 50, Name: "IsAllowed", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "Site", Width: 165, Name: "Site", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Created Date", Width: 120, Name: "CreatedDate", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "Last Update", Width: 120, Name: "LastUpdate", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "Creator", Width: 100, Name: "Creator", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Contact Person", Width: 100, Name: "ContactPerson", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Contact Email", Width: 170, Name: "ContactEmail", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Note", Width: 100, Name: "Remark", HeaderAlign: "center", CellAlign: "center" }
                ],
                bodyRows: result[0].data,
                hideYBackGroundScroller: true,
                gridExpandHeight: 150,
                allowTruncate: true,
                enableHiddenColumns: false,
                hiddenColumns: [1, 11], 
                //numberOfFrozenColumn: 2,
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
                gridOptions.bodyRows[i].Columns[3].Row = i;
                gridOptions.bodyRows[i].Columns[3].CustomCellRender = ActiveColumn;
                                
                // Modify "Action" column
                gridOptions.bodyRows[i].Columns =  OddsFeedAdminManager.insertAtIndex(
                    gridOptions.bodyRows[i].Columns,
                    3,
                    { Name: "Action", Row: i });
//                gridOptions.bodyRows[i].Columns.push({ Name: "Action", Row: i });
                gridOptions.bodyRows[i].Columns[3].CustomCellRender = ActionColumn;
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
    var partnerId = gridOptions.bodyRows[cell.Row].Columns[1].Value;

    if( $("#IsActivateSystem").val() != "")    //system is activated
    {
        if (cell.Value == "True") {
            return "<img title='Deactivate this account' class='ico-tick' alt='' onclick='editActive(this," + partnerId + ")'/>";
        }
        else {
            return "<img title='Activate this account' class='ico-untick' alt='' onclick='editActive(this," + partnerId + ")'/>";
        }
    }
    else{
       return "<img class='ico-untick-deactivate' /> ";
    }
}
function ActionColumn(cell, cellFormated) {
    return "<div class='btn-action' onclick=\"javascript:ShowAction('" + cell.Row + "');\"></div>";
}

function ShowAction(cellRow) {
    var partnerId = gridOptions.bodyRows[cellRow].Columns[1].Value;
    var userName = gridOptions.bodyRows[cellRow].Columns[2].Value;
    var site = gridOptions.bodyRows[cellRow].Columns[4].Value;
    var email = gridOptions.bodyRows[cellRow].Columns[9].Value;
    var note = gridOptions.bodyRows[cellRow].Columns[11].Value;

    _affId = partnerId;
    _affName = userName;

    //$.contextMenu('destroy'); -- using if items of menu are updated
    $.contextMenu({
        selector: '.btn-action',
        items: {
            deleteAffiliate: {
                name: "Delete this affiliate",
                height: 25,
                className: "iconDelAff",
                callback: function (key, opt) {
                    deleteAffiliate(_affId, _affName);
                }
            },
            editSetting: {
                name: "Edit authentication settings",
                height: 25,
                className: "iconEditSetting",
                callback: function (key, opt) {
                    var updateParam = $.param({
                        id: _affId,
                        name: _affName
                    });

                    window.location.href = currentDomainURL + "/Affiliate/EditSetting?" + updateParam;
                }
            },
            editInfo: {
                name: "Edit information",
                height: 25,
                className: "iconEditInfo",
                callback: function (key, opt) {
                    var updateParam = $.param({
                        userName: _affName,
                    });

                    window.location.href = currentDomainURL + "/Affiliate/EditAffiliateInfo/" + _affId+ "?" + updateParam;
                }
            },
            editProfile: {
                name: "Edit odds profile",
                className: "iconOddProfile",
                callback: function (key, opt) {
                    var updateParam = $.param({
                        name: _affName
                    });

                    window.location.href = currentDomainURL + "/Affiliate/EditProfile/" + _affId + "?" + updateParam;
                }
            },
            viewXMLURLs: {
                name: "View XML URLs",
                className: "iconViewXMLURLs",
                callback: function (key, opt) {
                    var updateParam = $.param({
                        name: _affName
                    });

                    window.location.href = currentDomainURL + "/Affiliate/ViewXMLURLs_Edit/" + _affId + "?" + updateParam;
                }
            }
        },
        trigger: "left",
        ignoreRightClick: true,
        autoHide: true
    });
}

function StartAutoSuggesttion() {
    var temp = $("#Username").val()
    var url = 'ListExistedAff?username=' + temp;

    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'html',
        cache: false,
        success: function (result) {
            var sourceAdmin = result.split(',');

            $("#Username").autocomplete({
                source: sourceAdmin,
                minLength: 1
            });
        },
        error: function (xhr, status, err) {
        }
    });
}
