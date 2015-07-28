$(function () {
    "use strict";

    /*
    * Search form.
    */
    var formSearch = $('#formSearch').submit(function (event) {
        event.preventDefault();

        var memberName = $("#memberName").val();
        var groupId = $("#groupId").val();

        waitingDialog.show("Please wait...", { dialogSize: 'sm' });

        $.get(this.action, { memberName: memberName, groupId: groupId }, function (result) {
            renderCustomerReportTable(result);

            waitingDialog.hide();
        });
    });

    formSearch.submit();

    /*
    * Grid options.
    */
    var gridOptions = {
        customizeHeader: true,
        gridExpandHeight: 180,
        showTree: true,
        showPager: true,
        showColumnsShowHide: false,
        sortOption: {},
        pagerOption: {
            itemsPerPage: 50,
            currentPage: 0,
            itemsPerPageArray: [10, 20, 50, 100, 500]
        }
    };

    /*
    * Render customer report.
    */
    var renderCustomerReportTable = function (data) {
        var suspiciousCustomers = data.SuspiciousCustomers;
        var months = data.Months;
        var columnHeaders = generateColumnHeaders(months);
        var customHeader = generateCustomColumnHeaders(months);
        var bodyRows = generateBodyRows(months, suspiciousCustomers);

        gridOptions.bodyRows = bodyRows;
        gridOptions.groupHeaderRows = customHeader;
        gridOptions.columns = columnHeaders;
        gridOptions.sortOption = {
            afterGridSorted: reRenderBodyAfterSort
        };
        gridOptions.pagerOption = {
            itemsPerPage: 50,
            currentPage: 0,
            itemsPerPageArray: [10, 20, 50, 100, 500]
        };

        $("#customerReportId").fanexGrid(gridOptions);
    };

    /*
    * Re-render customer report.
    */
    function reRenderBodyAfterSort(rows) {
        $.each(rows, function (index, item) {
            item.Columns[0].Value = index + 1;
        });

        gridOptions.bodyRows = rows;

        $('#customerReportId').fanexGrid(gridOptions);

        return rows;
    }

    /*
    * Create the body for rendering.
    */
    var generateBodyRows = function (months, suspiciousCustomers) {
        var rows = [];
        var month1 = months[0];
        var month2 = months[1];
        var month3 = months[2];

        for (var i = 0; i < suspiciousCustomers.length; i++) {
            var suspiciousCustomer = suspiciousCustomers[i];
            var currentRow = {
                Columns: [
                        { Name: "Row", Value: i + 1 },
                        { Name: "Member", Value: suspiciousCustomer.Customer.CustName },
                        { Name: "Group", Value: suspiciousCustomer.Group.GroupName },
                        { Name: "SuspiciousTime", Value: suspiciousCustomer.SuspiciousTime },
                        { Name: month1 + "WinLoss", Value: suspiciousCustomer.WinLoss[0] !== null ? suspiciousCustomer.WinLoss[0] : "N/A" },
                        { Name: month2 + "WinLoss", Value: suspiciousCustomer.WinLoss[1] !== null ? suspiciousCustomer.WinLoss[1] : "N/A" },
                        { Name: month3 + "WinLoss", Value: suspiciousCustomer.WinLoss[2] !== null ? suspiciousCustomer.WinLoss[2] : "N/A" },
                        { Name: month1 + "Margin", Value: suspiciousCustomer.Margins[0] !== null ? suspiciousCustomer.Margins[0] : "N/A" },
                        { Name: month2 + "Margin", Value: suspiciousCustomer.Margins[1] !== null ? suspiciousCustomer.Margins[1] : "N/A" },
                        { Name: month3 + "Margin", Value: suspiciousCustomer.Margins[2] !== null ? suspiciousCustomer.Margins[2] : "N/A" }
                    ]
            };

            rows.push(currentRow);
        }

        return rows;
    };

    /*
    * Create the header for rendering.
    */
    var generateColumnHeaders = function (months) {
        var month1 = months[0];
        var month2 = months[1];
        var month3 = months[2];
        var columnHeaders = [
            { HeaderText: "#", Width: 50, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
            { HeaderText: "Member", Width: 120, Name: "Member", HeaderAlign: "center", CellAlign: "left" },
            { HeaderText: "Group", Width: 250, Name: "Group", HeaderAlign: "center", CellAlign: "left" },
            { HeaderText: "Suspicious Time", Width: 125, Name: "SuspiciousTime", HeaderAlign: "center", CellAlign: "right",
                Sort: true, SortType: 'number'
            },
            { HeaderText: month1, Width: 110, Name: month1 + "WinLoss", HeaderAlign: "center", CellAlign: "right",
                FormatNumber: formatConstant.TWO_DECIMAL_NUMBER, IsAbs: false, FormatNegative: '$'
            },
            { HeaderText: month2, Width: 110, Name: month2 + "WinLoss", HeaderAlign: "center", CellAlign: "right",
                FormatNumber: formatConstant.TWO_DECIMAL_NUMBER, IsAbs: false, FormatNegative: '$'
            },
            { HeaderText: month3, Width: 110, Name: month3 + "WinLoss", HeaderAlign: "center", CellAlign: "right",
                FormatNumber: formatConstant.TWO_DECIMAL_NUMBER, IsAbs: false, FormatNegative: '$'
            },
            { HeaderText: month1, Width: 85, Name: month1 + "Margin", HeaderAlign: "center", CellAlign: "right",
                FormatNumber: formatConstant.TWO_DECIMAL_PERCENT_NUMBER, IsAbs: false, FormatNegative: '$'
            },
            { HeaderText: month2, Width: 85, Name: month2 + "Margin", HeaderAlign: "center", CellAlign: "right",
                FormatNumber: formatConstant.TWO_DECIMAL_PERCENT_NUMBER, IsAbs: false, FormatNegative: '$'
            },
            { HeaderText: month3, Width: 85, Name: month3 + "Margin", HeaderAlign: "center", CellAlign: "right",
                FormatNumber: formatConstant.TWO_DECIMAL_PERCENT_NUMBER, IsAbs: false, FormatNegative: '$'
            }
        ];

        return columnHeaders;
    };

    /*
    * Create the custom header for rendering.
    */
    var generateCustomColumnHeaders = function (months) {
        var customColumnHeaders = [
            {
                Columns: [
                    { HeaderText: "#", Name: "Row", HeaderAlign: "center", MergeRowNumber: 2 },
                    { HeaderText: "Member", Name: "Member", HeaderAlign: "center", MergeRowNumber: 2 },
                    { HeaderText: "Group", Name: "Group", HeaderAlign: "center", MergeRowNumber: 2 },
                    { HeaderText: "Suspicious Time", Name: "SuspiciousTime", HeaderAlign: "center", MergeRowNumber: 2 },
                    { HeaderText: "Win Loss", Name: months[0] + "WinLoss", HeaderAlign: "center", MergeColNumber: 3 },
                    { HeaderText: "Margin %", Name: months[0] + "Margin", HeaderAlign: "center", MergeColNumber: 3 }
                ]
            }
        ];

        return customColumnHeaders;
    };

    /*
    * Format.
    */
    var formatConstant = {
        INT_NUMBER: '0,0',
        TWO_DECIMAL_NUMBER: '-0,0.00',
        FOUR_DECIMAL_NUMBER: '0,0.0000',
        TWO_DECIMAL_PERCENT_NUMBER: '0,0.00%',
        MMM_DD_YYYY_STRING: 'MMM DD, YYYY',
        M_DD_YY_STRING: 'M dd, yy',
        MM_DD_YYYY_WITH_SLASH_STRING: 'MM/dd/yyyy',
        MMM_YY_STRING: 'MMM YY',
        MMM_YY_STRING_MONTH_PICKER: 'MMM yyyy',
        MMM_DD_YY_STRING_MONTH_PICKER: 'MMM dd, yyyy',
        MM_DD_YYYY_WITH_SLASH_STRING_MOMENT: 'M/D/YYYY',
        MMM_DD_YYYY_STRING_MOMENT: 'MMM D, YYYY',
        MMM_DD_YYYY_H_M_STRING: 'MMM DD, YYYY HH:mm'
    };
});

var waitingDialog = waitingDialog || (function ($) {
    'use strict';

    // Creating modal dialog's DOM
    var $dialog = $(
        '<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
        '<div class="modal-dialog modal-m">' +
        '<div class="modal-content">' +
        '<div class="modal-header"><h4 style="margin:0;"></h4></div>' +
        '<div class="modal-body">' +
        '<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
        '</div>' +
        '</div></div></div>');

    return {
        /**
        * Opens our dialog
        * @param message Custom message
        * @param options Custom options:
        options.dialogSize - bootstrap postfix for dialog size, e.g. "sm", "m";
        options.progressType - bootstrap postfix for progress bar type, e.g. "success", "warning".
        */
        show: function (message, options) {
            // Assigning defaults
            if (typeof options === 'undefined') {
                options = {};
            }
            if (typeof message === 'undefined') {
                message = 'Loading';
            }
            var settings = $.extend({
                dialogSize: 'm',
                progressType: '',
                onHide: null // This callback runs after the dialog was hidden
            }, options);

            // Configuring dialog
            $dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
            $dialog.find('.progress-bar').attr('class', 'progress-bar');
            if (settings.progressType) {
                $dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
            }
            $dialog.find('h4').text(message);
            // Adding callbacks
            if (typeof settings.onHide === 'function') {
                $dialog.off('hidden.bs.modal').on('hidden.bs.modal', function () {
                    settings.onHide.call($dialog);
                });
            }
            // Opening dialog
            $dialog.modal();
        },
        /**
        * Closes dialog
        */
        hide: function () {
            $dialog.modal('hide');
        }
    };

})(jQuery);