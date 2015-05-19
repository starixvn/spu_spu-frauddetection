var cssClassForDeactiveTab = "ui-accordion-header ui-state-default ui-corner-all ui-accordion-icons";

$(document).ready(function () {
    OnAccordionInitialize();
    OnInitialize();
});

//=========================================================================
/* INITIALIZE */
function OnInitialize() {
    $('#preconditionConfigControlDatetimePicker').datepicker();
    
    $("#btn_AddRule").click(function () {
        var currentRowNum = $('#ruleTable tr').length;
        var newConfig = generateConfig("ruleConfig");
        AddingOneMoreRuleToTable("ruleTable", currentRowNum, newConfig);
    });

    $("#btn_AddPrecondition").click(function () {
        var currentRowNum = $('#preconditionTable tr').length;
        var newConfig = generateConfig("preconditionConfig");
        AddingOneMoreRuleToTable("preconditionTable", currentRowNum, newConfig);
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
        checkFormula("preconditionTable");
        checkFormula("ruleTable");
        /*
        var url = 'Group/AddNewGroup';
        var param = {
        "GroupName": $("#GroupName").val(),
        "GroupDesc": $("#GroupDesc").val(),
        "IsActive": $('#IsActive').is(':checked')
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
        $("#addResult").attr('class', 'result-text-success');
        response.ErrMsg = "Add new group successfully!";
        }
        else {
        $("#addResult").attr('class', 'result-text-fail');
        }

        $("#addResult").html(response.ErrMsg);
        Search();
        },
        beforeSend: function () {

        },
        complete: function () {
        }
        });*/
    });
}

//=========================================================================
/* GENERATE CONFIGURATION RULE */
function generateConfig(parentName) {
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
            var ruleContent = $(targetObject).attr("data-encodedContent");
            if (elementString == "AND#" || elementString == "OR#") {
                ruleContent = ruleContent.replace(/AND#/g, "").replace(/OR#/g, "");
            }

            ruleContent = isPrefix ? elementString + ruleContent : ruleContent + elementString;

            if (ruleContent.indexOf("AND#") >= 0) {
                ruleContent = ruleContent.replace(/AND#/g, "")
                ruleContent = "AND#" + ruleContent;
            }
            else if (ruleContent.indexOf("OR#") >= 0) {
                ruleContent = ruleContent.replace(/OR#/g, "")
                ruleContent = "OR#" + ruleContent;
            }

            $(targetObject).attr("data-encodedContent", ruleContent);
            $(targetObject).html(ruleContent.replace(/#/g, " "));
        }
    });

    updateFormula(parentName);
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

    updateFormula(parentName);
}

function AddingOneMoreRuleToTable(tableName, rowNumber, ruleString) {
    var blockOfTableRow = "<tr id='" + tableName + rowNumber + "'><td><input type='checkbox' id='cb_" + tableName + rowNumber + "' /></td>";
    blockOfTableRow += "<td style='width: 510px;'><div id='div_" + tableName + rowNumber + "' data-encodedContent='" + ruleString + "'>" + ruleString + "</div></td>";
    blockOfTableRow += "<td><img style='cursor: pointer; cursor: hand;' src='/Areas/FraudDetection/App_Themes/Images/Delete.gif' onclick='RemoveOneRuleFromTable(@" + tableName + "@," + rowNumber + ")' /></td></tr>";
    blockOfTableRow = blockOfTableRow.replace(/@/g, '"'); 

    var targetObject = "#" + tableName + " tr:last";
    $(targetObject).after(blockOfTableRow);
    updateFormula(tableName);
}

function RemoveOneRuleFromTable(tableName, rowNumber) {
    var targetObject = "#" + tableName + rowNumber;
    $(targetObject).remove();
    updateFormula(tableName);
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
function updateFormula(parentName) {
    var formula = getFormula(parentName);

    $('#' + parentName + 'Formula').attr('data-formatted-formula', formula);
    $('#' + parentName + 'Formula').text(formula.replace(/#/g, " "));
}

function getFormula(parentName) {
    var formula = "";
    $('div[id^="div_' + parentName + '"]').each(function () {
        formula += $(this).attr("data-encodedContent") + "#";
    });

    return formula;
}

function checkFormula(parentName) {
    var formula = getFormula(parentName);
    var formulaCheckResults = expVal.validateLogicExpession(formula, "#").split(",");
    
    if (formulaCheckResults[0] == "") {
        //alert("formula is correct");
    }
    else {
        $('#' + parentName + 'Formula').html(formulaCheckResults[formulaCheckResults.length-1]);
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