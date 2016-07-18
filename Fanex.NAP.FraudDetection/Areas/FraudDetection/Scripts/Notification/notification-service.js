var notificationService = (function ($) {
    "use strict";
    var notificationService = {};

    notificationService._userId = 0;
    notificationService.gridOptions = "";
    notificationService._pageIndex = 0;
    notificationService._pageSize = 50;
    
    notificationService.GetAllMessages = function () {

        $('#PageSize').val(notificationService._pageSize);
        $('#PageIndex').val(notificationService._pageIndex);

        var searchParams = {
            //PageSize: notificationService._pageSize,
            //PageIndex: notificationService._pageIndex + 1
        };

        notificationFactory.getMessages(searchParams).success(function (result) {
            renderMessageTable(result);
        });
    };

    function renderMessageTable(messageList) {
        notificationService.gridOptions =
            {
                columns: [
                    { HeaderText: "#", Width: 50, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "Event", Width: 500, Name: "Event", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Message", Width: 500, Name: "Message", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Fraud Case", Width: 150, Name: "FraudCase", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Posted Time", Width: 150, Name: "PostedTime", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "Details", Width: 50, Name: "Details", HeaderAlign: "center", CellAlign: "center" }
                ],
                bodyRows: createMessageTable(messageList),
                hideYBackGroundScroller: true,
                gridExpandHeight: 180,
                allowTruncate: true,
                showPager: true,
                customPager: false,
                enableHiddenColumns: false,
                hiddenColumns: [5],
                pagerOption: {
                    itemsPerPage: notificationService._pageSize,
                    currentPage: notificationService._pageIndex,
                    totalItem: messageList.length,
                    itemsPerPageArray: [10, 20, 50, 100, 500],
                    pagerSelectCallBack: reRenderAfterPaged
                }
            };

        notificationService.gridOptions.hiddenColumns = [5];
        $("#SearchResult").fanexGrid(notificationService.gridOptions);
    };

    function createMessageTable(messages) {
        var rows = [];

        for (var index = 0; index < messages.length; index++) {
            var message = messages[index];
            rows.push({
                Columns: [
                    { Name: "Row", Value: (index + 1).toString() },
                    { Name: "Event", Value: message.Event },
                    { Name: "Message", Value: message.MessageContent },
                    { Name: "FraudCase", Value: message.CaseName },
                    { Name: "PostedTime", Value: message.PostedDate },
                    { Name: "Details", Value: "view" }
                ]
            });
        }

        return rows;
    }

    function reRenderAfterPaged(pageIndex, itemsPerPage) {
        if (itemsPerPage !== $('#PageSize').val()) {
            $('#PageIndex').val(0);
            notificationService._pageIndex = 0;
        } else {
            $('#PageIndex').val(pageIndex);
            notificationService._pageIndex = pageIndex;
        }

        $('#PageSize').val(itemsPerPage);
        notificationService._pageSize = itemsPerPage;

        notificationService.gridOptions.pagerOption.currentPage = pageIndex;
        notificationService.GetAllMessages();

        return false;
    }

    function editColumn(cell) {
        var caseId = cell.Value;

        return "<img title='Edit Group's Info' class='btn-action' alt='' onclick='notificationService.editCaseInfo(" + caseId + ")'/>";
    }


    return notificationService;

})(jQuery);