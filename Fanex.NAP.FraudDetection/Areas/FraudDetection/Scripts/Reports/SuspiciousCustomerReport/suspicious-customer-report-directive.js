'use strict';
/*global suspiciousCustomerReportModule*/

suspiciousCustomerReportModule.directive('fanexGridSuspiciousCustomerReport', ['$timeout', 'suspiciousCustomerReportModel', function ($timeout, suspiciousCustomerReportModel) {
    var generateColumnHeaders = function () {
        var columnHeaders =
        [
            { HeaderText: "#", Width: 70, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "Delq.", Width: 60, Name: "Delinquent", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "Logs Notes", Width: 60, Name: "Note", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "Verified", Width: 60, Name: "Verified", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "Member", Width: 150, Name: "Member", HeaderAlign: "center", CellAlign: "left" },
            { HeaderText: "Total Violations", Width: 80, Name: "TotalViolations", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "New Violations", Width: 80, Name: "NewViolations", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "Violated Cases", Width: 80, Name: "ViolatedCases", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "Assignees", Width: 200, Name: "Assignees", HeaderAlign: "center", CellAlign: "left" }
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
                    { Name: "Row", Value: i + 1 },
                    { Name: "Delinquent", Value: suspiciousCustomer.IsDelinquent, CustomCellRender: delinquencyColumn },
                    { Name: "Note", Value: suspiciousCustomer, CustomCellRender: noteColumn },
                    { Name: "Verified", Value: suspiciousCustomer, CustomCellRender: verifiedColumn },
                    { Name: "Member", Value: suspiciousCustomer.Customer, CustomCellRender: memberNameColumn },
                    { Name: "TotalViolations", Value: suspiciousCustomer.TotalViolations },
                    { Name: "NewViolations", Value: suspiciousCustomer.NewViolations },
                    { Name: "ViolatedCases", Value: suspiciousCustomer.ViolatedCases },
                    {
                        Name: "Assignees", Value: suspiciousCustomer.Assignees !== null ?
                          (suspiciousCustomer.Assignees.length > 0 ? suspiciousCustomer.Assignees : "-") : "-"
                    }
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
            result = "<div class='suspicious-customer-note'" +
                "data-custid='" + custId + "'></div>";
        }

        return result;
    }

    function verifiedColumn(cell) {
        var result = "";
        if (cell.Value.IsHedge) {
            result = "<div class='glyphicon glyphicon-ok' style='color:red;' title='Hedge Account'>";
        }
        else if (cell.Value.IsVerified) {
            result = "<div class='glyphicon glyphicon-ok' style='color:green;'>";
        }

        return result;
    }

    function memberNameColumn(cell) {
        var custId = cell.Value.CustId;
        var custName = cell.Value.CustName;
        var fromDate = suspiciousCustomerReportModel.filter.EventDateFrom;
        var toDate = suspiciousCustomerReportModel.filter.EventDateTo;

        var url = "CustomerDetails/Index?custId=" + custId + "&fromDate=" + fromDate + '&toDate=' + toDate;
        return "<a target='_blank' href=" + url + ">" + custName + "</a>";
    }

    function createNotesTable(notes) {
        var result = "<table class='customer-report-statistic'>" +
            "<tr><th>Date</th><th>Description</th><th>Author</th><th>Type</th></tr>";

        for (var i = 0; i < notes.length; i++) {
            var date = notes[i].DateString;
            var description = notes[i].Description;
            var author = notes[i].Author;
            var type = notes[i].Type;

            result += "<tr><td>" + date +
                "</td><td style='text-align:left;'>" + description +
                "</td><td>" + author +
                "</td><td>" + type +
                "</td></tr>";
        }

        result += "</table>";

        return result;
    }

    var registerViewNoteEvent = function () {
        var noteElement = $(".freegrid .table-cell .suspicious-customer-note");

        noteElement.off("click");
        noteElement.on("click", function (event) {
            event.preventDefault();

            var toolTip = $(this);
            var custId = toolTip.data("custid");
            suspiciousCustomerReportModel.getNotes(custId).then(function () {
                toolTip.attr('title', 'tooltip');
                toolTip.tooltip({
                    content: createNotesTable(suspiciousCustomerReportModel.Notes),
                    position: {
                        my: "left top",
                        at: "left+30 top+20"
                    },
                    track: true,
                    show: {
                        effect: "slideDown"
                    }
                }).on('mouseout focusout mouseover mouseenter mouseleave', function (eventTooltip) {
                    eventTooltip.stopImmediatePropagation();
                });

                toolTip.tooltip("open");

                $(document).on('mousedown', function (e) {
                    var container = $(".ui-tooltip");
                    if (!container.is(e.target) && container.has(e.target).length === 0) {
                        toolTip.tooltip('option', { disabled: true }).tooltip('close');
                        toolTip.tooltip("destroy");
                        $(document).off('mousedown');
                        toolTip.removeAttr('title');
                    }
                });
            });
        });
    };

    return {
        restrict: "A",
        scope: {
            gridData: "="
        },
        link: function ($scope, iElement) {
            $scope.$watch('gridData', function (gridData) {
                $timeout(function () {
                    if (gridData !== undefined) {
                        var bodyRows = generateBodyRows(gridData);
                        var columnHeaders = generateColumnHeaders();

                        var gridOptions = {
                            gridExpandHeight: 300,
                            marginRight: 0,
                            showTree: true,
                            showPager: true,
                            customPager: false,
                            allowTruncate: true,
                            pagerOption: {
                                itemsPerPage: 50,
                                currentPage: 0,
                                totalItem: gridData.length,
                                itemsPerPageArray: [10, 20, 50, 100, 500],
                                afterPagedFunction: function (rows) {
                                    registerViewNoteEvent();

                                    return rows;
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
}]);

suspiciousCustomerReportModule.directive('datetimepicker', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.datetimepicker({
                change: function (date) {
                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(date);
                    });

                }
            });
        }
    };
});