var groupDetailService = (function ($) {
    "use strict";
    var groupDetailService = {};

    groupDetailService._custId = 0;
    groupDetailService.custName = "";
    groupDetailService._groupId = 0;
    groupDetailService.gridOptions = "";

    groupDetailService.isHostPermission = false;

    groupDetailService.Search = function () {

        var searchParams = {
            GroupId: groupDetailService._groupId
        };

        groupFactory.getGroupDetail(searchParams).success(function (result) {

            renderGroupDetailTable(result);
        });
    };

    function renderGroupDetailTable(result) {
        groupDetailService.gridOptions =
            {
                columns: [
                    { HeaderText: "#", Width: 50, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "Member", Width: 200, Name: "Member", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Added By", Width: 200, Name: "AddedBy", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Added Date", Width: 200, Name: "AddedDate", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Remove", Width: 50, Name: "Remove", HeaderAlign: "center", CellAlign: "center" }
                ],
                bodyRows: generateMemberBodyRows(result),
                showNumberColumn: true,
                showPager: true,
                fullHeight: true,
                gridExpandHeight: 160,
                enableHiddenColumns: false,
                allowTruncate: true,
                pagerOption: {
                    itemsPerPage: 50,
                    currentPage: 0,
                    itemsPerPageArray: [10, 20, 50, 100, 500],
                }
            };

        if (!groupDetailService.isHostPermission) {
            groupDetailService.gridOptions.hiddenColumns = [4];
        }

        $("#GroupMemberResult").fanexGrid(groupDetailService.gridOptions);
    }

    var generateMemberBodyRows = function (data) {
        var rows = [];
        $.each(data, function (index, element) {
            rows.push({
                Columns: [
                    { Name: "Row", Value: index + 1 },
                    { Name: "Member", Value: element.Username },
                    { Name: "AddedBy", Value: element.CreatedBy },
                    { Name: "AddedDate", Value: element.CreatedDateString },
                    { Name: "Remove", Value: element, CustomCellRender: removeGroupColumn }
                ]
            });
        });

        return rows;
    };

    function removeGroupColumn(cell) {
        var element = cell.Value;
        var result = "<span title='Remove Group' class='glyphicon glyphicon-trash' onclick='groupDetailService.removeMemberFromGroup(\"{0}\", {1}, {2});' style='cursor: pointer'>".format(element.Username, element.CustId, groupDetailService._groupId);

        return result;
    };

    groupDetailService.removeMemberFromGroup = function (username, custId, groupId) {
        AlertService.hideAlert();

        $.confirm({
            confirmButtonClass: 'btn-green btn-customConfirm',
            cancelButtonClass: 'btn-green btn-customCancel',
            title: "Delete confirmation",
            text: "Are you sure you really want to remove <b>{0}</b> from this group?".format(username),
            confirm: function () {
                $(".confirmation-modal").modal("hide");

                groupFactory.removeMemberFromGroup(custId, groupId).success(function (data) {
                    if (data.IsSuccessful) {
                        groupDetailService.Search();
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

    groupDetailService.addMember = function (username, groupId) {
        groupFactory.addMemberToGroup(username, groupId).success(function (data) {
            if (data.IsSuccessful) {
                groupDetailService.Search();
            }

            AlertService.showAlert(data);
        });
    };

    return groupDetailService;

})(jQuery);