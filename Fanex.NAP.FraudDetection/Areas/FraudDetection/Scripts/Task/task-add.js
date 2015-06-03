var NextActionIdList = "";
var NextActionTargetIdList = "";
var IsCheckNotScanned = true;
var SQLForNotScanned = "";

$(document).ready(function () {
    OnAccordionInitialize();
    OnInitialize();
});

//=========================================================================
/* ACCORDION INITIALIZE */
function OnAccordionInitialize() {
    $("#accordion").accordion({
        heightStyle: "content",
        collapsible: true,

        beforeActivate: function (event, ui) {
            // The accordion believes a panel is being opened
            if (ui.newHeader[0]) {
                var currHeader = ui.newHeader;
                var currContent = currHeader.next('.ui-accordion-content');
                // The accordion believes a panel is being closed
            } else {
                var currHeader = ui.oldHeader;
                var currContent = currHeader.next('.ui-accordion-content');
            }
            // Since we've changed the default behavior, this detects the actual status
            var isPanelSelected = currHeader.attr('aria-selected') == 'true';

            // Toggle the panel's header
            currHeader.toggleClass('ui-corner-all', isPanelSelected).toggleClass('accordion-header-active ui-state-active ui-corner-top', !isPanelSelected).attr('aria-selected', ((!isPanelSelected).toString()));

            // Toggle the panel's icon
            currHeader.children('.ui-icon').toggleClass('ui-icon-triangle-1-e', isPanelSelected).toggleClass('ui-icon-triangle-1-s', !isPanelSelected);

            // Toggle the panel's content
            currContent.toggleClass('accordion-content-active', !isPanelSelected)
            if (isPanelSelected) { currContent.slideUp(); } else { currContent.slideDown(); }

            return false; // Cancel the default action
        }
    });
}

//=========================================================================
/* INITIALIZE */
function OnInitialize() {
    $('#preconditionConfigControlDatetimePicker').datepicker();
    SQLForNotScanned = $("option[value='Match State']").attr("data-sqlfield");
    
    $("#btn_AddRule").click(function () {
        var currentRowNum = $('#ruleTable tr').length;
        AddingOneMoreRuleToTable("ruleTable", currentRowNum, "ruleConfig");
    });

    $("#btn_AddPrecondition").click(function () {
        var currentRowNum = $('#preconditionTable tr').length;
        AddingOneMoreRuleToTable("preconditionTable", currentRowNum, "preconditionConfig");
    });

    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    SetupCalendar(dateFormat(new Date(year, month, day, 0, 0, 0), 'mmm dd, yyyy HH:MM:ss'), '.txtCalendar');
    $('#preconditionConfigControlDatetimePickerIcon').click(function () {
        $('#preconditionConfigControlDatetimePicker').datepicker("show");
    });

    $('#ruleConfigControlDatetimePickerIcon').click(function () {
        $('#ruleConfigControlDatetimePicker').datetimepicker("show");
    });

    $("#AddTaskForm").submit(function (event) {
        event.preventDefault();
        var formulaIsCorrect = CheckFormula("preconditionTable") && CheckFormula("ruleTable");
        if (formulaIsCorrect) {
            GenerateNextActions();

            var url = 'Task/AddNewTask';
            var param = {
                "CreatorId": $("#onUserid").text(),
                "WorkflowId": $("#workflowid").text(),
                "TaskName": $("#ActionName").find(":selected").text(),
                "TaskDesc": $("#ActionName").find(":selected").attr("data-actiondesc"),
                "ActionId": $("#ActionName").find(":selected").val(),
                "Interval": $("#timeInterval").val(),
                "IntervalType": $("#timeIntervalUnit").find(":selected").val(),
                "TaskPreconditions": $("#preconditionTableFormula").attr("data-formatted-formula"),
                "TaskRules": $("#ruleTableFormula").attr("data-formatted-formula"),
                "NextActionIdList": NextActionIdList,
                "NextActionTargetIdList": NextActionTargetIdList,
                "PreconRelevantTables": $("#preconditionTableFormula").attr("data-tables"),
                "RuleRelevantTables": $("#ruleTableFormula").attr("data-tables"),
                "PreconRelevantReturns": $("#preconditionTableFormula").attr("data-returns"),
                "RuleRelevantReturns": $("#ruleTableFormula").attr("data-returns"),
                "IsCheckNotScanned": IsCheckNotScanned,
                "SQLForNotScanned": SQLForNotScanned
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
                    if (response.ErrCode == 0) {
                        // redirect to workflow detail page
                        var url = "Workflow/WorkflowDetail?workflowId=" + $("#workflowid").text();
                        url += "&workflowName=" + "longluu";
                        window.location.replace(url);
                    }
                    else {
                        // display the error message
                        $("#addTaskResult").text(response.ErrMsg);
                    }
                },
                beforeSend: function () {

                },
                complete: function () {
                }
            });
        }
    });
}

//=========================================================================
/* GENERATE CONFIGURATIONS */
function GenerateConfig(parentName) {
    // Config key
    var keySelectedOption = $('#' + parentName + 'Key').find(":selected");
    var keySelectedValue = $(keySelectedOption).val();
    var controlType = $(keySelectedOption).attr("data-controltype");
    if ($("#" + parentName + "Compare").prop("checked") == true) {
        controlType = "Compare";
    }

    // Config operator
    var selectedOperator = $('#' + parentName + 'Operator').find(":selected").text();

    // Config value
    var valueSelectedValue = "";
    switch (controlType) {
        case "ComboBox":
            valueSelectedValue = $('#' + parentName + 'ControlComboBox' + keySelectedValue.toLowerCase().replace(/ /g, '') + ' option:selected').text();
            break;
        case "DatetimePicker":
            valueSelectedValue = $('#' + parentName + 'ControlDatetimePicker').val();
            break;
        case "Compare":
            valueSelectedValue = $('#' + parentName + 'ControlComboBoxKeyClone option:selected').text();
            break;
        default:
            valueSelectedValue = $('#' + parentName + 'ControlTextbox').val();
    }

    return keySelectedValue + " " + selectedOperator + " " + valueSelectedValue;
}

function GenerateConfigFormatted(parentName) {
    // Config key
    var keySelectedOption = $('#' + parentName + 'Key').find(":selected");
    var keySelectedValue = $(keySelectedOption).val();
    var keySelectedFormattedValue = $(keySelectedOption).attr("data-sqlfield");
    var controlType = $(keySelectedOption).attr("data-controltype");
    if ($("#" + parentName + "Compare").prop("checked") == true) {
        controlType = "Compare";
    }

    // Config operator
    var selectedOperator = $('#' + parentName + 'Operator').find(":selected").text();

    // Config value
    var valueSelectedValue = "";
    switch (controlType) {
        case "ComboBox":
            valueSelectedValue = $('#' + parentName + 'ControlComboBox' + keySelectedValue.toLowerCase().replace(/ /g, '') + ' option:selected').val();
            break;
        case "DatetimePicker":
            valueSelectedValue = '%' + $('#' + parentName + 'ControlDatetimePicker').val() + '%';
            break;
        case "Compare":
            valueSelectedValue = $('#' + parentName + 'ControlComboBoxKeyClone option:selected').attr("data-sqlfield");
            break;
        case "TextBoxNumber":
            valueSelectedValue = $('#' + parentName + 'ControlTextbox').val();
            break;
        default:
            valueSelectedValue = '%' + $('#' + parentName + 'ControlTextbox').val() + '%';
    }

    if (keySelectedValue == "Match State") {
        if(valueSelectedValue == "scanned") {
            IsCheckNotScanned = false;
        }

        return "";
    }

    return keySelectedFormattedValue + " " + selectedOperator + " " + valueSelectedValue;
}

function GenerateRelevantTables(parentName) {
    var keySelectedOption = $('#' + parentName + 'Key').find(":selected");
    var relatedTables = $(keySelectedOption).attr("data-sqltable");
    if ($("#" + parentName + "Compare").prop("checked") == true) {
        relatedTables += "," + $('#' + parentName + 'ControlComboBoxKeyClone').find(":selected").attr("data-sqltable");
    }

    return relatedTables;
}

function GenerateRelevantReturns(parentName) {
    var keySelectedOption = $('#' + parentName + 'Key').find(":selected");
    var relatedReturns = $(keySelectedOption).attr("data-sqlreturns");
    if ($("#" + parentName + "Compare").prop("checked") == true) {
        relatedReturns += "," + $('#' + parentName + 'ControlComboBoxKeyClone').find(":selected").attr("data-sqlreturns");
    }

    return relatedReturns;
}

function GenerateNextActions() {
    NextActionIdList = "";
    NextActionTargetIdList = "";

    $("input:checkbox[id^=nextaction_]").each(function () {
        if ($(this).prop('checked')) {
            var nextAction = $(this).attr('id');
            var nextTargetAction = nextAction + "_value";

            NextActionIdList += $("#" + nextAction).attr("data-actionid") + ",";
            NextActionTargetIdList += $("#" + nextTargetAction).find(":selected").val() + ",";
        }
    });

    NextActionIdList = NextActionIdList.slice(0, -1);
    NextActionTargetIdList = NextActionTargetIdList.slice(0, -1);
}

//=========================================================================
/* TIMEPICKER ADDON */
SetupCalendar = function (strdatetime, txtdate) {
    $(txtdate).datetimepicker({
        showSecond: true,
        dateFormat: 'mm/dd/yy',
        timeFormat: 'HH:mm:ss',
        hourGrid: 3,
        minuteGrid: 5,
        secondGrid: 5,
        separator: ' ',
        showButtonPanel: true
    });

    if (strdatetime != null && strdatetime.toString() !== "") {
        $(txtdate).val(strdatetime).datetimepicker('setDate', (new Date(strdatetime)));
    }
};

//=========================================================================
/* MANAGE RULE */
function AddFormulaElement(isPrecondition, elementString, isPrefix) {
    if (isPrecondition) {
        AddElement("preconditionTable", elementString, isPrefix);
    }
    else {
        AddElement("ruleTable", elementString, isPrefix);
    }
}

function RemoveFormulaElement(isPrecondition, elementString) {
    if (isPrecondition) {
        RemoveElement("preconditionTable", elementString);
    }
    else {
        RemoveElement("ruleTable", elementString);
    }
}

function AddElement(parentName, elementString, isPrefix) {
    $("input:checkbox[id^=cb_" + parentName + "]").each(function () {
        if ($(this).prop('checked')) {
            var checkboxId = $(this).attr('id');
            checkboxId = checkboxId.replace("cb_" + parentName, "");
            var targetObject = "#div_" + parentName + checkboxId;
            var ruleContent = $(targetObject).text();
            var ruleContentFormatted = $(targetObject).attr("data-encodedContent");
            var ruleRawContent = $(targetObject).attr("data-rawContent");
            if (elementString == "AND#" || elementString == "OR#") {
                ruleContent = ruleContent.replace(/AND#/g, "").replace(/OR#/g, "");
                ruleContentFormatted = ruleContentFormatted.replace(/AND#/g, "").replace(/OR#/g, "");
                ruleRawContent = ruleRawContent.replace(/AND#/g, "").replace(/OR#/g, "");
            }

            if (ruleContent.indexOf("Match State") >= 0) {
                ruleContentFormatted = "";
            }
            else {
                ruleContentFormatted = isPrefix ? elementString + ruleContentFormatted : ruleContentFormatted + elementString;
            }

            ruleRawContent = isPrefix ? elementString + ruleRawContent : ruleRawContent + elementString;
            ruleContent = ruleRawContent;

            WorkWithLogicOperator(ruleContent);
            WorkWithLogicOperator(ruleContentFormatted);
            WorkWithLogicOperator(ruleRawContent);

            $(targetObject).attr("data-encodedContent", ruleContentFormatted);
            $(targetObject).attr("data-rawContent", ruleRawContent);
            $(targetObject).html(ruleContent.replace(/#/g, " "));
        }
    });

    UpdateFormula(parentName);
}

function WorkWithLogicOperator(targetString) {
    if (targetString.indexOf("AND#") >= 0) {
        targetString = targetString.replace(/AND#/g, "")
        targetString = "AND#" + targetString;
    }
    else if (targetString.indexOf("OR#") >= 0) {
        targetString = targetString.replace(/OR#/g, "")
        targetString = "OR#" + targetString;
    }
}

function RemoveElement(parentName, elementString) {
    $("input:checkbox[id^=cb_" + parentName + "]").each(function () {
        if ($(this).prop('checked')) {
            var checkboxId = $(this).attr('id');
            checkboxId = checkboxId.replace("cb_" + parentName, "");
            var targetObject = "#div_" + parentName + checkboxId;
            var ruleContent = $(targetObject).attr("data-encodedContent");
            ruleContent = ruleContent.replace(elementString, "");
            $(targetObject).attr("data-encodedContent", ruleContent);
            $(targetObject).html(ruleContent.replace(/#/g, " "));
        }
    });

    UpdateFormula(parentName);
}

function AddingOneMoreRuleToTable(tableName, rowNumber, parentName) {
    var ruleString = GenerateConfig(parentName);
    var ruleStringFormatted = GenerateConfigFormatted(parentName);
    var relevantTables = GenerateRelevantTables(parentName);
    var returns = GenerateRelevantReturns(parentName);

    var blockOfTableRow = "<tr id='" + tableName + rowNumber + "'><td><input type='checkbox' id='cb_" + tableName + rowNumber + "' /></td>";
    blockOfTableRow += "<td style='width: 510px;'><div id='div_" + tableName + rowNumber + "' data-returns='" + returns + "' data-tables='" + relevantTables + "' data-encodedContent='" + ruleStringFormatted + "' data-rawContent='" + ruleString + "'>" + ruleString + "</div></td>";
    blockOfTableRow += "<td><img style='cursor: pointer; cursor: hand;' src='/Areas/FraudDetection/App_Themes/Images/Delete.gif' onclick='RemoveOneRuleFromTable(@" + tableName + "@," + rowNumber + ")' /></td></tr>";
    blockOfTableRow = blockOfTableRow.replace(/@/g, '"'); 

    var targetObject = "#" + tableName + " tr:last";
    $(targetObject).after(blockOfTableRow);
    UpdateFormula(tableName);
}

function RemoveOneRuleFromTable(tableName, rowNumber) {
    var targetObject = "#" + tableName + rowNumber;
    $(targetObject).remove();
    UpdateFormula(tableName);
}

//=========================================================================
/* MANAGE ACTION SELECTION CHANGE */
function changeActionSelection(currentObj) {
    var selectedAction = $(currentObj).find(":selected");
    var actionDesc = $(selectedAction).attr("data-actiondesc");

    $('#selectedActionDesc').text(actionDesc);
}

//=========================================================================
/* MANAGE CONFIG SELECTION CHANGE */
function changeConfigSelection(currentObj, isPrecondition) {
    var selectedOption = $(currentObj).find(":selected");
    var controlType = $(selectedOption).attr("data-controltype");
    var selectedValue = $(selectedOption).val();
    selectedValue = selectedValue.toLowerCase().replace(/ /g, '');

    if (isPrecondition) {
        if ($("#preconditionConfigCompare").prop("checked") == false) {
            renderConfigControl("preconditionConfigControl", selectedValue, controlType);
        }
    }
    else {
        if ($("#ruleConfigCompare").prop("checked") == false) {
            renderConfigControl("ruleConfigControl", selectedValue, controlType);
        }
    }
}

function renderConfigControl(parentName, selectedValue, controlType) {
    var relevantObjects = '[id^="' + parentName + '"]';
    $(relevantObjects).css("display", "none");

    switch (controlType) {
        case "ComboBox":
            $('[id^="' + parentName + 'ComboBox' + selectedValue + '"]').css("display", "inline-block");
            break;
        case "DatetimePicker":
            $('[id^="' + parentName + 'DatetimePicker"]').css("display", "inline-block");
            $('[id^="' + parentName + 'DatetimePickerIcon"]').css("display", "inline-block");
            break;
        default:
            $('[id^="' + parentName + 'Textbox"]').css("display", "inline-block");
            $('[id^="' + parentName + 'Textbox"]').val("");
    }
}

//=========================================================================
/* GET/UPDATE/CHECK FORMULA */ 
function UpdateFormula(parentName) {
    var formula = GetFormula(parentName);

    $('#' + parentName + 'Formula').attr('data-formatted-formula', GetFormattedFormula(parentName));
    $('#' + parentName + 'Formula').attr('data-rawcontent', GetRawFormula(parentName));
    $('#' + parentName + 'Formula').attr('data-tables', GetRelevantTables(parentName));
    $('#' + parentName + 'Formula').attr('data-returns', GetReturns(parentName));
    $('#' + parentName + 'Formula').text(formula.replace(/#/g, " "));
}

function GetFormula(parentName) {
    var formula = "";
    $('div[id^="div_' + parentName + '"]').each(function () {
        formula += $(this).text() + "#";
    });

    formula = formula.slice(0, -1);
    return formula;
}

function GetRawFormula(parentName) {
    var formula = "";
    $('div[id^="div_' + parentName + '"]').each(function () {
        formula += $(this).attr("data-rawcontent") + "#";
    });

    formula = formula.slice(0, -1);
    return formula;
}

function GetFormattedFormula(parentName) {
    var formula = "";
    $('div[id^="div_' + parentName + '"]').each(function () {
        formula += $(this).attr("data-encodedContent") + "#";
    });

    formula = formula.slice(0, -1);
    return formula;
}

function GetRelevantTables(parentName) {
    var tables = "";
    $('div[id^="div_' + parentName + '"]').each(function () {
        var newTables = $(this).attr("data-tables").split(',');
        for (var i = 0; i < newTables.length; i++) {
            if (tables.indexOf(newTables[i]) == -1) {
                tables += newTables[i] + ",";
            }
        }
    });

    tables = tables.slice(0, -1);
    return tables;
}

function GetReturns(parentName) {
    var sqlReturns = "";
    $('div[id^="div_' + parentName + '"]').each(function () {
        var newReturns = $(this).attr("data-returns").split(',');
        for (var i = 0; i < newReturns.length; i++) {
            if (sqlReturns.indexOf(newReturns[i]) == -1) {
                sqlReturns += newReturns[i] + ",";
            }
        }
    });

    sqlReturns = sqlReturns.slice(0, -1);
    return sqlReturns;
}

function CheckFormula(parentName) {
    var formula = GetRawFormula(parentName);
    var formulaCheckResults = expVal.validateLogicExpession(formula, "#").split(",");
    
    if (formulaCheckResults[0] == "") {
        return true;
    }
    else {
        $('#' + parentName + 'Formula').html(formulaCheckResults[formulaCheckResults.length - 1]);
        return false;
    }
}

//=========================================================================
/* COMPARE WITH ANOTHER FIELD */
function onCompareWithOtherField(currentObj, isPrecondition) {
    var parentName = isPrecondition ? "preconditionConfig" : "ruleConfig";

    if ($(currentObj).prop("checked") == true) {
        var relevantObjects = '[id^="' + parentName + 'Control"]';
        $(relevantObjects).css("display", "none");
        $("#" + parentName + "ControlComboBoxKeyClone").css("display", "inline-block");
    }
    else {
        var selectedOption = $("#" + parentName + "Key").find(":selected");
        var controlType = $(selectedOption).attr("data-controltype");
        var selectedValue = $(selectedOption).val();
        selectedValue = selectedValue.toLowerCase().replace(/ /g, '');
        renderConfigControl(parentName + "Control", selectedValue, controlType);
    }
}

//=========================================================================
/* ULTILITIES */
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}