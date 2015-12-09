'use strict';
/*global suspiciousCustomerReportModule*/

suspiciousCustomerReportModule.directive('fanexGridSuspiciousCustomerReport', ['$timeout', 'suspiciousCustomerReportModel', function ($timeout, suspiciousCustomerReportModel) {
    var generateColumnHeaders = function () {
        var columnHeaders =
        [
            { HeaderText: "#", Width: 70, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "", Width: 60, Name: "Delinquent", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "", Width: 60, Name: "Note", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "", Width: 60, Name: "Verified", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "Member", Width: 150, Name: "Member", HeaderAlign: "center", CellAlign: "left" },
            { HeaderText: "Total Violations", Width: 80, Name: "TotalViolations", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "New Violations", Width: 80, Name: "NewViolations", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "Violated Cases", Width: 80, Name: "ViolatedCases", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "Assignees", Width: 200, Name: "Assignees", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "Last Verified Date", Width: 150, Name: "LastVerifiedDate", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "Last Verified By", Width: 80, Name: "LastVerifiedBy", HeaderAlign: "center", CellAlign: "center" }
        ];

        return columnHeaders;
    };

    var generateBodyRows = function (suspiciousCustomers) {
        var rows = [];

        for (var i = 0; i < suspiciousCustomers.length; i++) {
            var suspiciousCustomer = suspiciousCustomers[i];
            var currentRow = {
                Columns:
                [
                    { Name: "Row", Value: suspiciousCustomer.Row },
                    { Name: "Delinquent", Value: suspiciousCustomer.IsDelinquent, CustomCellRender: delinquencyColumn },
                    { Name: "Note", Value: suspiciousCustomer, CustomCellRender: noteColumn },
                    { Name: "Verified", Value: suspiciousCustomer.IsVerified, CustomCellRender: verifiedColumn },
                    { Name: "Member", Value: suspiciousCustomer.Customer, CustomCellRender: memberNameColumn },
                    { Name: "TotalViolations", Value: suspiciousCustomer.TotalViolations },
                    { Name: "NewViolations", Value: suspiciousCustomer.NewViolations },
                    { Name: "ViolatedCases", Value: suspiciousCustomer.ViolatedCases },
                    { Name: "Assignees", Value: suspiciousCustomer.Assignees !== null ? suspiciousCustomer.Assignees : "-" },
                    { Name: "LastVerifiedDate", Value: suspiciousCustomer.LastVerifiedDate !== null ? suspiciousCustomer.LastVerifiedDateString : "-" },
                    { Name: "LastVerifiedBy", Value: suspiciousCustomer.LastVerifiedBy !== null ? suspiciousCustomer.LastVerifiedBy : "-" }
                ]
            };

            rows.push(currentRow);
        }

        return rows;
    };

    function delinquencyColumn(cell) {
        var result = "";
        if (cell.Value) {
            result = "<div class='glyphicon glyphicon-alert' style='color:red;'></div>";
        }

        return result;
    }

    function noteColumn(cell) {
        var result = "";
        var custId = cell.Value.Customer.CustId;
        if (cell.Value.HasNote) {
            result = "<div class='glyphicon glyphicon-list-alt' style='cursor: pointer;' " +
                "data-custid='" + custId + "'></div>";
        }

        return result;
    }

    function verifiedColumn(cell) {
        var result = "<input type='checkbox' DISABLED>";
        if (cell.Value) {
            result = "<input type='checkbox' checked DISABLED>";
        }

        return result;
    }

    function memberNameColumn(cell) {
        var custId = cell.Value.CustId;
        var custName = cell.Value.CustName;

        var url = "SuspiciousCustomer/SuspiciousCustomerDetail?custId=" + custId;
        return "<a href=" + url + ">" + custName + "</a>";
    }

    var registerViewNoteEvent = function () {
        var noteElement = $(".freegrid .table-cell .glyphicon-list-alt");

        noteElement.off("click");
        noteElement.on("click", function (event) {
            event.preventDefault();

            var custId = $(this).data("custid");

            $(this).attr('title', 'tooltip');
            $(this).tooltip({
                content: "<div id='note-grid' class='freegrid  content-grid'></div>",
                position: {
                    my: "left bottom",
                    at: "left+30 top+16"
                }
            }).click(function () {
                if ($(this).tooltip('option', 'disabled')) {
                    $(this).tooltip('option', { disabled: false }).tooltip('open');
                }
            }).on('mouseout focusout mouseover mouseenter mouseleave', function (eventTooltip) {
                eventTooltip.stopImmediatePropagation();

                $(this).tooltip('option', { disabled: true }).tooltip('close');
                $(this).tooltip("destroy");
            });

            $(this).tooltip("open");

            suspiciousCustomerReportModel.getNotes(custId);
        });
    };

    return {
        restrict: "A",
        scope: {
            gridData: "=",
            pageOption: '=',
            onPageChanging: '='
        },
        link: function ($scope, iElement) {
            $scope.$watch('gridData', function (gridData) {
                $timeout(function () {
                    if (gridData) {
                        var bodyRows = generateBodyRows(gridData.SuspiciousCustomers);
                        var columnHeaders = generateColumnHeaders();

                        var gridOptions = {
                            gridExpandHeight: 300,
                            marginRight: 0,
                            showTree: true,
                            showPager: true,
                            customPager: true,
                            allowTruncate: true,
                            pagerOption: {
                                itemsPerPage: $scope.pageOption.PageSize,
                                currentPage: $scope.pageOption.PageIndex,
                                totalItem: gridData.TotalItem,
                                itemsPerPageArray: [10, 20, 50, 100, 500],
                                pagerSelectCallBack: function (pageIndex, itemsPerPage) {
                                    $scope.onPageChanging(pageIndex, itemsPerPage);
                                }
                            }
                        };

                        gridOptions.columns = columnHeaders;
                        gridOptions.bodyRows = bodyRows;

                        $(iElement).fanexGrid(gridOptions);

                        registerViewNoteEvent();

                        $("#report-header").width($(iElement).width());
                        $("#report-header").removeClass("hidden");
                    }
                });
            });
        }
    };
} ]);