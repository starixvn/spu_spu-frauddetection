var fraudCaseDetailService = (function ($) {

    var service = {};
    var balanceUpDay = "";

    var getBodyRows = function (data) {
        var bodyRows = [];
        var liveBallCss = 'live-ball';

        $.each(data, function (index, element) {
            bodyRows.push({
                Columns: [
                    { Name: "No", Value: index + 1, TdClass: element.IsLive ? liveBallCss : "" },
                    { Name: "CustName", Value: element.CustName, TdClass: element.IsLive ? liveBallCss : "" },
                    { Name: "TransDate", Value: element.TransDate, TdClass: element.IsLive ? liveBallCss : "" },
                    { Name: "TransId", Value: element.TransId, TdClass: element.IsLive ? liveBallCss : "" },
                    { Name: "Choice", CustomCellRender: function () { return element.Choice; }, TdClass: element.IsLive ? liveBallCss : "" },
                    { Name: "Score", Value: element.Score, TdClass: element.IsLive ? liveBallCss : "" },
                    { Name: "Odds", CustomCellRender: function () { return element.Odds; }, TdClass: element.IsLive ? liveBallCss : "" },
                    { Name: "Stake", CustomCellRender: function () { return element.Stake; }, TdClass: element.IsLive ? liveBallCss : "" },
                    { Name: "WinLoss", Value: element.WinLoss, TdClass: element.IsLive ? liveBallCss : "" },
                    { Name: "Status", Value: element.Status, TdClass: element.IsLive ? liveBallCss : "" },
                    { Name: "IP", CustomCellRender: function () { return element.DisplayIP; }, TdClass: element.IsLive ? liveBallCss : "" }
                ]
            });
        });

        return bodyRows;
    };

    var getGridOption = function (data) {
        var formatNumber = '0,0.00';

        var gridOptions = {
            columns: [
                { HeaderText: "#", Width: 30, Name: "No", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Member", Width: 130, Name: "CustName", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Trans Date", Width: 150, Name: "TransDate", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Bet ID", Width: 90, Name: "TransId", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Choice", Width: 220, Name: "Choice", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Score", Width: 70, Name: "Score", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Odds", Width: 70, Name: "Odds", HeaderAlign: "center", CellAlign: "right" },
                { HeaderText: "Stake", Width: 100, Name: "Stake", HeaderAlign: "center", CellAlign: "right" },
                {
                    HeaderText: "Win Loss", Width: 100, Name: "WinLoss", HeaderAlign: "center", CellAlign: "right",
                    IsCurrency: true,
                    FormatNumber: formatNumber,
                    FormatNegative: '-$',
                    IsAbs: true
                },
                { HeaderText: "Status", Width: 50, Name: "Status", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "IP", Width: 120, Name: "IP", HeaderAlign: "center", CellAlign: "center" }
            ],
            bodyRows: getBodyRows(data.FraudCaseDetailList),
            showNumberColumn: true,
            showPager: true,
            fullHeight: true,
            gridExpandHeight: 300,
            allowTruncate: true,
            pagerOption: {
                itemsPerPage: 10,
                currentPage: 0,
                itemsPerPageArray: [10, 20, 50, 100, 500],
                showDetail: true,
                afterPagedFunction: function () {
                    registerEventForIpButton();
                }
            },
            showTitle: true,
            titleInfo:
            {
                text: data.Bettype,
                showExcelButton: true,
                exportExcelFunction: function (event) {
                    event.preventDefault();
                    var bettype = this.parentElement.parentElement.textContent;

                    waitingDialog.show("Please wait...", { dialogSize: 'sm' });
                    var param = {
                        "MatchId": $("#MatchId").text(),
                        "CaseId": $("#CaseId").text(),
                        "EventDate": $("#EventDate").text(),
                        "Bettype": bettype
                    };

                    FraudDetectionScripts.downloadFile("ExportExcel", param);
                    waitingDialog.hide();
                }
            }
        };

        return gridOptions;
    };

    service.getFraudCaseDetails = function () {
        for (var i = 0; i < data.length; i++) {
            var gridOptions = getGridOption(data[i]);
            var grid = '#fraudCaseDetailReport-' + i;

            $(grid).fanexGrid(gridOptions);
        }
    };

    var getDataAllTicketRows = function (ip) {
        var bodyRows = [];
        $.ajax({
            url: SPU.getAbsoluteUrl("FraudCaseDetail/GetAllTicketsByIp?ip=" + ip),
            type: 'GET',
            async: true,
            dataType: 'json',
            beforeSend: function () {
                waitingDialog.show("Please wait...", { dialogSize: 'sm' });
            },
            success: function (data) {
                balanceUpDay = moment(data.BalanceUpDay).format("DD/MM/YYYY");
                $.each(data.BetList, function (index, element) {
                    bodyRows.push({
                        Columns: [
                            { Name: "No" },
                            { Name: "CustName", Value: element.CustName },
                            { Name: "TransDate", Value: element.TransDate },
                            { Name: "TransId", Value: element.TransId },
                            { Name: "Bettype", Value: element.BetType },
                            { Name: "Choice", CustomCellRender: function () { return element.Choice; } },
                            { Name: "Score", Value: element.Score },
                            { Name: "Odds", CustomCellRender: function () { return element.Odds; } },
                            { Name: "Stake", CustomCellRender: function () { return element.Stake; } },
                            { Name: "WinLoss", Value: element.WinLoss },
                            { Name: "Status", Value: element.Status },
                        ]
                    });
                });

                showIpPopup(ip, bodyRows);
            },
            complete: function (data) {
                waitingDialog.hide();
                //$('#popup .match').addClass('clearfix');
            }
        });
    };

    var showIpPopup = function (ip, bodyData) {
        var formatNumber = '0,0.00';
        var gridOptions = {
            columns: [
                { HeaderText: "#", Width: 30, Name: "No", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Member", Width: 130, Name: "CustName", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Trans Date", Width: 150, Name: "TransDate", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Bet ID", Width: 90, Name: "TransId", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Bet Type", Width: 90, Name: "Bettype", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Choice", Width: 220, Name: "Choice", HeaderAlign: "center", CellAlign: "right" },
                { HeaderText: "Result", Width: 70, Name: "Score", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Odds", Width: 70, Name: "Odds", HeaderAlign: "center", CellAlign: "right" },
                { HeaderText: "Stake", Width: 100, Name: "Stake", HeaderAlign: "center", CellAlign: "right" },
                {
                    HeaderText: "Win Loss", Width: 100, Name: "WinLoss", HeaderAlign: "center", CellAlign: "right",
                    IsCurrency: true,
                    FormatNumber: formatNumber,
                    FormatNegative: '-$',
                    IsAbs: true
                },
                { HeaderText: "Status", Width: 50, Name: "Status", HeaderAlign: "center", CellAlign: "center" },
            ],
            bodyRows: bodyData,
            showNumberColumn: true,
            showPager: true,
            fullHeight: true,
            gridExpandHeight: 300,
            allowTruncate: true,
            pagerOption: {
                itemsPerPage: 10,
                currentPage: 0,
                itemsPerPageArray: [10, 20, 50, 100, 500],
                showDetail: true,
            }
        };

        $('<div id="popup" class="tickets"></div>')
            .dialog({
                modal: true,
                title: "Tickets of IP: " + ip + " from " + balanceUpDay,
                zIndex: 10000,
                appendTo: "body",
                open: function () {
                    var container = this.appendChild(document.createElement('div'));
                    container.id = 'container';
                    container.className = 'freegrid content-grid';
                    $('#container').fanexGrid(gridOptions);
                    $("#popup")
                        .dialog("option", "position",
                        {
                            my: "center",
                            at: "center",
                            of: window
                        });
                },
                autoOpen: true,
                width: '1230px',
                resizable: false,
                close: function () {
                    $(this).remove();
                }
            });
    };

    var registerEventForIpButton = function () {
        $(".all-ticketsip").unbind("click");
        $(".all-ticketsip").click(function () {
            var displayIp = this.textContent;
            getDataAllTicketRows(displayIp);
        })
    };

    service.init = function () {
        service.getFraudCaseDetails();

        $("#btnExportExcel").click(function (event) {
            event.preventDefault();

            waitingDialog.show("Please wait...", { dialogSize: 'sm' });
            var param = {
                "MatchId": $("#MatchId").text(),
                "CaseId": $("#CaseId").text(),
                "EventDate": $("#EventDate").text()
            };

            FraudDetectionScripts.downloadFile("ExportExcel", param);
            waitingDialog.hide();
        });

        registerEventForIpButton();
    };

    return service;

})(jQuery);

(function ($) {
    fraudCaseDetailService.init();
})(jQuery);