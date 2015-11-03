var groupService = (function ($) {
    "use strict";

    var groupService = {};

    groupService._groupId = 0;
    groupService._groupName = '';
    groupService._pageIndex = 0;
    groupService._pageSize = 50;

    groupService.gridOptions = '';

    groupService.isHostPermission = false;

    groupService.Search = function () {
        $('#PageSize').val(groupService._pageSize);
        $('#PageIndex').val(groupService._pageIndex);

        var searchParams = {
            PageSize: groupService._pageSize,
            PageIndex: groupService._pageIndex + 1
        };

        groupFactory.getGroups(searchParams).success(function (result) {
            renderGroupTable(result);
        });
    };

    groupService.openPopupAddGroup = function () {
        groupFactory.getEmptyGroup().success(function (response) {
            DialogService.setDialogId("popup");
            DialogService.openDialogContent(response, "Add Group", {
                width: '500px'
            });
        });
    };

    groupService.addGroup = function (group) {
        groupFactory.addGroup(group).success(function (response) {
            if (response.IsSuccessful) {
                setTimeout(function () {
                    DialogService.closeDialog();
                }, 3000);

                groupService.Search();
            }

            AlertServiceOnPopup.showAlert(response);
        });
    };

    groupService.openPopupEditGroup = function (groupId) {
        groupFactory.getGroupInfo(groupId).success(function (response) {
            DialogService.setDialogId("pop-up");
            DialogService.openDialogContent(response, "Edit Group", {
                width: '500px'
            });
        });
    };

    groupService.editGroup = function (group) {
        groupFactory.editGroup(group).success(function (response) {
            if (response.IsSuccessful) {
                setTimeout(function () {
                    DialogService.closeDialog();
                }, 3000);

                groupService.Search();
            }

            AlertServiceOnPopup.showAlert(response);
        });
    };

    /*
    * Activate/deactivate a group.
    */
    groupService.editGroupStatus = function (obj, groupId) {
        if (groupService.isHostPermission) {
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
                text: "Are you sure you really want to " + active + "this group?",
                confirm: function () {
                    groupFactory.editGroupStatus(groupId, !isActive).success(function (response) {
                        isActive = !isActive;
                        AlertService.showAlert(response);

                        $(".confirmation-modal").modal("hide");
                    });
                },
                cancel: function () {
                },
                confirmButton: "OK",
                cancelButton: "Cancel"
            });

            $(document).on('hidden.bs.modal', function () {
                if (!isActive) {
                    $(obj).removeClass('ico-tick').addClass('ico-untick');
                } else {
                    $(obj).removeClass('ico-untick').addClass('ico-tick');
                }

                $(document).off('hidden.bs.modal');
            });
        }
    };

    function renderGroupTable(groupList) {
        groupService.gridOptions =
            {
                columns: [
                    { HeaderText: "#", Width: 20, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "GroupId", Width: 100, Name: "GroupId", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Group Name", Width: 300, Name: "GroupName", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Description", Width: 500, Name: "GroupDesc", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Active", Width: 50, Name: "Active", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "Edit", Width: 50, Name: "Edit", HeaderAlign: "center", CellAlign: "center" }
                ],
                bodyRows: createGroupTable(groupList.Groups),
                hideYBackGroundScroller: true,
                gridExpandHeight: 180,
                allowTruncate: true,
                enableHiddenColumns: false,
                hiddenColumns: [1],
                showPager: true,
                customPager: true,
                pagerOption: {
                    itemsPerPage: groupService._pageSize,
                    currentPage: groupService._pageIndex,
                    totalItem: groupList.TotalItem,
                    itemsPerPageArray: [10, 20, 50, 100, 500],
                    pagerSelectCallBack: reRenderAfterPaged
                }
            };

        if (!groupService.isHostPermission) {
            groupService.gridOptions.hiddenColumns = [1, 5];
        }

        $("#SearchResult").fanexGrid(groupService.gridOptions);
    }

    /*
    * Create the data for rendering.
    */
    function createGroupTable(groups) {
        var rows = [];

        for (var index = 0; index < groups.length; index++) {
            var group = groups[index];
            rows.push({
                Columns: [
                    { Name: "Row", Value: group.Row },
                    { Name: "GroupName", Value: group.GroupName },
                    { Name: "GroupDesc", Value: group.GroupDesc },
                    { Name: "Active", Value: group, CustomCellRender: activeColumn },
                    { Name: "Edit", Value: group.GroupId, CustomCellRender: editColumn }
                ]
            });
        }

        return rows;
    }

    function reRenderAfterPaged(pageIndex, itemsPerPage) {
        if (itemsPerPage != $('#PageSize').val()) {
            $('#PageIndex').val(0);
            groupService._pageIndex = 0;
        } else {
            $('#PageIndex').val(pageIndex);
            groupService._pageIndex = pageIndex;
        }

        $('#PageSize').val(itemsPerPage);
        groupService._pageSize = itemsPerPage;

        groupService.gridOptions.pagerOption.currentPage = pageIndex;
        groupService.Search();

        return false;
    }

    function activeColumn(cell) {
        var groupId = cell.Value.GroupId;

        if (cell.Value.IsActive) {
            return "<img title='Deactivate this Group' class='ico-tick' alt='' onclick='groupService.editGroupStatus(this," + groupId + ")'/>";
        }
        else {
            return "<img title='Activate this Group' class='ico-untick' alt='' onclick='groupService.editGroupStatus(this," + groupId + ")'/>";
        }
    }

    function editColumn(cell) {
        var groupId = cell.Value;

        return "<img title='Edit Group's Info' class='btn-action' alt='' onclick='groupService.openPopupEditGroup(" + groupId + ")'/>";
    }

    return groupService;
})(jQuery);