var taskService = (function ($) {
    "use strict";

    var taskService = {};

    taskService.NextActionIdList = "";
    taskService.NextActionTargetIdList = "";
    taskService.IsCheckNotScanned = true;

    taskService.initialize = function () {
        taskService.OnAccordionInitialize();
        taskService.OnInitialize();
    };

    taskService.OnAccordionInitialize = function () {
        $("#accordion").accordion({
            heightStyle: "content",
            collapsible: true,

            beforeActivate: function (event, ui) {
                // The accordion believes a panel is being opened
                var currHeader;
                var currContent;
                if (ui.newHeader[0]) {
                    currHeader = ui.newHeader;
                    currContent = currHeader.next('.ui-accordion-content'); // The accordion believes a panel is being closed
                } else {
                    currHeader = ui.oldHeader;
                    currContent = currHeader.next('.ui-accordion-content');
                }
                // Since we've changed the default behavior, this detects the actual status
                var isPanelSelected = currHeader.attr('aria-selected') == 'true';

                // Toggle the panel's header
                currHeader.toggleClass('ui-corner-all', isPanelSelected).toggleClass('accordion-header-active ui-state-active ui-corner-top', !isPanelSelected).attr('aria-selected', ((!isPanelSelected).toString()));

                // Toggle the panel's icon
                currHeader.children('.ui-icon').toggleClass('ui-icon-triangle-1-e', isPanelSelected).toggleClass('ui-icon-triangle-1-s', !isPanelSelected);

                // Toggle the panel's content
                currContent.toggleClass('accordion-content-active', !isPanelSelected);
                if (isPanelSelected) {
                    currContent.slideUp();
                } else {
                    currContent.slideDown();
                }

                return false; // Cancel the default action
            }
        });
    };

    taskService.OnInitialize = function () {
        $('#preconditionConfigControlDatetimePicker').datepicker();

        $("#ruleConfigControlIpAddress").ipAddress();
        $("#ruleConfigControlIpAddressFrom").ipAddress();
        $("#ruleConfigControlIpAddressTo").ipAddress();

        $("#btn_Cancel").click(function () {
            var url = "/Case/GetCaseDetail?caseId=" + $("#caseid").text();
            window.location.href = window.location.href.split('/Task', 1)[0].toString() + url;
        });

        $("#btn_AddRule").click(function () {
            if ($('#ruleConfigKey').val() === "IP") {
                $("#ruleConfigControlIpAddress").css("color", "black");
                $("#ruleConfigControlIpAddressFrom").css("color", "black");
                $("#ruleConfigControlIpAddressTo").css("color", "black");

                if ($('#ruleConfigOperator').val() !== "Between") {
                    if (!isIpAddress($('#ruleConfigControlIpAddress').val())) {
                        $("#ruleConfigControlIpAddress").css("color", "red");
                        return;
                    }
                } else {
                    if (!checkIpRange($('#ruleConfigControlIpAddressFrom').val(), $('#ruleConfigControlIpAddressTo').val())) {
                        $("#ruleConfigControlIpAddressFrom").css("color", "red");
                        $("#ruleConfigControlIpAddressTo").css("color", "red");
                        return;
                    }
                }
            }

            var currentRowNum = $('#ruleTable tr:last').attr('id').replace("ruleTable", "");
            taskService.AddingOneMoreRuleToTable("ruleTable", parseInt(currentRowNum) + 1, "ruleConfig");
        });

        $("#btn_AddPrecondition").click(function () {
            var currentRowNum = $('#preconditionTable tr:last').attr('id').replace("preconditionTable", "");
            taskService.AddingOneMoreRuleToTable("preconditionTable", parseInt(currentRowNum) + 1, "preconditionConfig");
        });

        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        taskService.SetupCalendar(dateFormat(new Date(year, month, day, 0, 0, 0), 'mmm dd, yyyy HH:MM:ss'), '.txtCalendar');
        $('#preconditionConfigControlDatetimePickerIcon').click(function () {
            $('#preconditionConfigControlDatetimePicker').datepicker("show");
        });

        $('#ruleConfigControlDatetimePickerIcon').click(function () {
            $('#ruleConfigControlDatetimePicker').datetimepicker("show");
        });

        $("#btn_AddTask").click(function (event) {
            event.preventDefault();
            var formulaIsCorrect = taskService.CheckFormula("preconditionTable") && taskService.CheckFormula("ruleTable");
            if (formulaIsCorrect) {
                taskService.GenerateNextActions();

                var param = {
                    "CreatorId": $("#onUserid").text(),
                    "CaseId": $("#caseid").text(),
                    "TaskName": $("#taskName").val(),
                    "TaskDesc": $("#taskDesc").val(),
                    "IsActive": $("input:checkbox[id=taskIsActive]").prop('checked'),
                    "EventId": $("#ActionName").find(":selected").val(),
                    "Interval": $("#timeInterval").val(),
                    "IntervalType": $("#timeIntervalUnit").find(":selected").val(),
                    "TaskPreconditions": $("#preconditionTableFormula").attr("data-formattedcontent"),
                    "TaskPreconditionsFormatted": $("#preconditionTableFormula").attr("data-formattedcontent"),
                    "TaskPreconditionsOriginal": $("#preconditionTableFormula").attr("data-rawcontent"),
                    "TaskRules": $("#ruleTableFormula").attr("data-formattedcontent"),
                    "TaskRulesFormatted": $("#ruleTableFormula").attr("data-formattedcontent"),
                    "TaskRulesOriginal": $("#ruleTableFormula").attr("data-rawcontent"),
                    "NextActionIdList": taskService.NextActionIdList,
                    "NextActionTargetIdList": taskService.NextActionTargetIdList,
                    "PreconConfigs": $("#preconditionTableFormula").attr("data-configids"),
                    "RuleConfigs": $("#ruleTableFormula").attr("data-configids"),
                    "IsCheckNotScanned": taskService.IsCheckNotScanned
                };

                taskFactory.addTask(param).success(function (response) {
                    if (response.IsSuccessful) {
                        var url = "/Case/GetCaseDetail?caseId=" + $("#caseid").text();
                        window.location.href = window.location.href.split('/Task', 1)[0].toString() + url;
                    } else {
                        AlertService.showAlert(response);
                    }
                });
            }
        });

        $("#btn_EditTask").click(function (event) {
            event.preventDefault();
            var formulaIsCorrect = taskService.CheckFormula("preconditionTable") && taskService.CheckFormula("ruleTable");
            if (formulaIsCorrect) {
                taskService.GenerateNextActions();

                var param = {
                    "CreatorId": $("#onUserid").text(),
                    "caseId": $("#caseid").text(),
                    "TaskId": $("#taskid").text(),
                    "TaskName": $("#taskName").val(),
                    "TaskDesc": $("#taskDesc").val(),
                    "IsActive": $("input:checkbox[id=taskIsActive]").prop('checked'),
                    "EventId": $("#ActionName").find(":selected").val(),
                    "Interval": $("#timeInterval").val(),
                    "IntervalType": $("#timeIntervalUnit").find(":selected").val(),
                    "TaskPreconditions": $("#preconditionTableFormula").attr("data-formattedcontent"),
                    "TaskPreconditionsFormatted": $("#preconditionTableFormula").attr("data-formattedcontent"),
                    "TaskPreconditionsOriginal": $("#preconditionTableFormula").attr("data-rawcontent"),
                    "TaskRules": $("#ruleTableFormula").attr("data-formattedcontent"),
                    "TaskRulesFormatted": $("#ruleTableFormula").attr("data-formattedcontent"),
                    "TaskRulesOriginal": $("#ruleTableFormula").attr("data-rawcontent"),
                    "NextActionIdList": taskService.NextActionIdList,
                    "NextActionTargetIdList": taskService.NextActionTargetIdList,
                    "PreconConfigs": $("#preconditionTableFormula").attr("data-configids"),
                    "RuleConfigs": $("#ruleTableFormula").attr("data-configids"),
                    "IsCheckNotScanned": taskService.IsCheckNotScanned
                };

                taskFactory.editTask(param).success(function (response) {
                    AlertService.showAlert(response);
                });
            }
        });
    };

    taskService.GenerateConfig = function (parentName) {
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
        var valueSelectedValue;
        switch (controlType) {
            case "ComboBox":
                valueSelectedValue = $('#' + parentName + 'ControlComboBox' + keySelectedValue.toLowerCase().replace(/ /g, '') + ' option:selected').text();
                break;
            case "DatetimePicker":
                valueSelectedValue = $('#' + parentName + 'ControlDatetimePicker').val();
                break;
            case "Compare":
                var additionValue = $('#' + parentName + 'ControlTextbox').val();

                valueSelectedValue = $('#' + parentName + 'ControlComboBoxKeyClone option:selected').text();

                if (parentName === "preconditionConfig")
                    valueSelectedValue += additionValue.length > 0 ? additionValue : "";
                break;
            case "TextBoxNumber":
                valueSelectedValue = $('#' + parentName + 'ControlTextbox').val();
                break;
            case "IpAddress":
                if (selectedOperator === "between") {
                    valueSelectedValue = formatIpAddress($('#' + parentName + 'ControlIpAddressFrom').val())
                        + " and " + formatIpAddress($('#' + parentName + 'ControlIpAddressTo').val());
                } else {
                    valueSelectedValue = formatIpAddress($('#' + parentName + 'ControlIpAddress').val());
                }
                break;
            default:
                valueSelectedValue = $('#' + parentName + 'ControlTextbox').val();
        }

        if (keySelectedValue == "Match State") {
            if (valueSelectedValue.toLowerCase() == "scanned") {
                taskService.IsCheckNotScanned = false;
            };
        }

        if ($("#ruleConfigCompare").prop("checked") == true && keySelectedValue == "Stake") {
            valueSelectedValue = $("#ruleConfigControlTextbox").val() + " " + valueSelectedValue;
        }

        return keySelectedValue + " " + selectedOperator + " " + valueSelectedValue;
    };

    taskService.GetSelectedConfigIds = function (parentName) {
        var keySelectedOption = $('#' + parentName + 'Key').find(":selected");
        var configIds = $(keySelectedOption).attr("data-configid");

        if ($("#" + parentName + "Compare").prop("checked") == true) {
            configIds += "#" + $('#' + parentName + 'ControlComboBoxKeyClone').find(":selected").attr("data-configid");
        }

        return configIds;
    };

    taskService.GenerateFormattedConfig = function (parentName) {
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
        var valueSelectedValue;
        switch (controlType) {
            case "ComboBox":
                valueSelectedValue = $('#' + parentName + 'ControlComboBox' + keySelectedValue.toLowerCase().replace(/ /g, '') + ' option:selected').val();
                break;
            case "DatetimePicker":
                valueSelectedValue = '%' + $('#' + parentName + 'ControlDatetimePicker').val() + '%';
                break;
            case "Compare":
                var additionValue = $('#' + parentName + 'ControlTextbox').val();

                valueSelectedValue = $('#' + parentName + 'ControlComboBoxKeyClone option:selected').text();

                if (parentName === "preconditionConfig")
                    valueSelectedValue += additionValue.length > 0 ? additionValue : "";

                if (valueSelectedValue.toString().indexOf("Today") >= 0)
                    valueSelectedValue = "CONVERT(date," + valueSelectedValue + ")";
                break;
            case "TextBoxNumber":
                valueSelectedValue = $('#' + parentName + 'ControlTextbox').val();
                break;
            case "IpAddress":
                if (selectedOperator === "between") {
                    var ip1 = $('#' + parentName + 'ControlIpAddressFrom').val().split(".");
                    var ip2 = $('#' + parentName + 'ControlIpAddressTo').val().split(".");
                    var searchLike = parseInt(ip1[0]) + "." + parseInt(ip1[1]) + "." + parseInt(ip1[2]) + ".";

                    keySelectedValue += " LIKE %" + searchLike + "$LIKE$%";
                    keySelectedValue += " and CAST(PARSENAME(ans.ip,1) AS TINYINT)";
                    valueSelectedValue = parseInt(ip1[3]) + " and " + parseInt(ip2[3]);

                } else {
                    valueSelectedValue = '%' + formatIpAddress($('#' + parentName + 'ControlIpAddress').val()) + '%';
                }
                break;
            default:
                valueSelectedValue = '%' + $('#' + parentName + 'ControlTextbox').val() + '%';
        }

        if (keySelectedValue == "TransDate" && valueSelectedValue == "In Danger Period")
            return "NEARTHEGOAL";

        if (keySelectedValue == "Arbitrage" && valueSelectedValue == "Yes")
            return "Arbitrage";

        if ($("#ruleConfigCompare").prop("checked") == true && keySelectedValue == "Stake" && valueSelectedValue !== "Has Changed From Original") {
            valueSelectedValue = $("#ruleConfigControlTextbox").val() + "*0.01*" + valueSelectedValue;
        }

        if (keySelectedValue === "Choice" && valueSelectedValue !== "Has Changed From Original") {
            var choice = valueSelectedValue.split(",");
            if (selectedOperator === "=") {
                return "(ans.bettype=" + choice[0] + " and ans.betteam=%" + choice[1] + "%)";
            } else {
                return "(ans.bettype<>" + choice[0] + " and ans.betteam<>%" + choice[1] + "%)";
            }
        }
        else if (valueSelectedValue === "Has Changed From Original") {
            var result = keySelectedValue + " <> ";
            switch (keySelectedValue) {
                case "Choice":
                    result = "(ans.bettype <> b.bettype and ans.betteam <> b.betteam)";
                    break;
                case "Stake":
                    result = "ans.stake <> b.stake";
                    break;
                case "Odds":
                    result += "b.odds";
                    break;
                case "SMA PT":
                    result += "b.tpositiontaking";
                    break;
                default:
                    result = "";
                    break;
            }

            return result;
        }

        if (valueSelectedValue === "Has Changed From Latest Capture") {
            selectedOperator = "<>";
        }

        return keySelectedValue + " " + selectedOperator + " " + valueSelectedValue;
    };

    taskService.GenerateNextActions = function () {
        var nextActionIdList = [],
            nextActionTargetIdList = [];

        taskService.NextActionIdList = "";
        taskService.NextActionTargetIdList = "";

        $("input:checkbox[id^=nextaction_]").each(function () {
            if ($(this).prop('checked')) {
                var nextAction = $(this).attr('id');
                var nextTargetAction = nextAction + "_value";

                if (nextAction === "nextaction_captureData") {
                    $("input:checkbox[id^=captureData_value_]").each(function () {
                        if ($(this).prop('checked')) {
                            nextActionIdList.push($("#" + nextAction).attr("data-actionid"));
                            nextActionTargetIdList.push($(this).val());
                        }
                    });
                }
                else {
                    nextActionIdList.push($("#" + nextAction).attr("data-actionid"));
                    nextActionTargetIdList.push($("#" + nextTargetAction).find(":selected").val());
                }
            }
        });

        taskService.NextActionIdList = nextActionIdList.join(',');
        taskService.NextActionTargetIdList = nextActionTargetIdList.join(',');
    };

    taskService.SetupCalendar = function (strdatetime, txtdate) {
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

    taskService.AddFormulaElement = function (isPrecondition, elementString, isPrefix) {
        if (isPrecondition) {
            taskService.AddElement("preconditionTable", elementString, isPrefix);
        } else {
            taskService.AddElement("ruleTable", elementString, isPrefix);
        }
    };

    taskService.RemoveFormulaElement = function (isPrecondition, elementString) {
        if (isPrecondition) {
            taskService.RemoveElement("preconditionTable", elementString);
        } else {
            taskService.RemoveElement("ruleTable", elementString);
        }
    };

    taskService.AddElement = function (parentName, elementString, isPrefix) {
        $("input:checkbox[id^=cb_" + parentName + "]").each(function () {
            if ($(this).prop('checked')) {
                var checkboxId = $(this).attr('id');
                checkboxId = checkboxId.replace("cb_" + parentName, "");
                var targetObject = "#div_" + parentName + checkboxId;
                var ruleRawContent = $(targetObject).attr("data-rawContent");
                var ruleFormattedContent = $(targetObject).attr("data-formattedcontent");
                if (elementString == "AND#" || elementString == "OR#") {
                    ruleRawContent = ruleRawContent.replace(/AND#/g, "").replace(/OR#/g, "");
                    ruleFormattedContent = ruleFormattedContent.replace(/AND#/g, "").replace(/OR#/g, "");
                }

                ruleRawContent = isPrefix ? elementString + ruleRawContent : ruleRawContent + elementString;
                ruleFormattedContent = isPrefix ? elementString + ruleFormattedContent : ruleFormattedContent + elementString;
                ruleRawContent = taskService.WorkWithLogicOperator(ruleRawContent);
                ruleFormattedContent = taskService.WorkWithLogicOperator(ruleFormattedContent);
                $(targetObject).attr("data-rawcontent", ruleRawContent);
                $(targetObject).attr("data-formattedcontent", ruleFormattedContent);
                $(targetObject).html(ruleRawContent.replace(/#/g, " "));
            }
        });

        taskService.UpdateFormula(parentName);
    };

    taskService.WorkWithLogicOperator = function (targetString) {
        if (targetString.indexOf("AND#") >= 0) {
            targetString = targetString.replace(/AND#/g, "");
            targetString = "AND#" + targetString;
        } else if (targetString.indexOf("OR#") >= 0) {
            targetString = targetString.replace(/OR#/g, "");
            targetString = "OR#" + targetString;
        }

        return targetString;
    };

    taskService.RemoveElement = function (parentName, elementString) {
        $("input:checkbox[id^=cb_" + parentName + "]").each(function () {
            if ($(this).prop('checked')) {
                var checkboxId = $(this).attr('id');
                checkboxId = checkboxId.replace("cb_" + parentName, "");
                var targetObject = "#div_" + parentName + checkboxId;
                var rawContent = $(targetObject).attr("data-rawcontent");
                var formattedContent = $(targetObject).attr("data-formattedcontent");
                rawContent = rawContent.replace(elementString, "");
                formattedContent = formattedContent.replace(elementString, "");
                $(targetObject).attr("data-rawcontent", rawContent);
                $(targetObject).attr("data-formattedcontent", formattedContent);
                $(targetObject).html(rawContent.replace(/#/g, " "));
            }
        });

        taskService.UpdateFormula(parentName);
    };

    taskService.AddingOneMoreRuleToTable = function (tableName, rowNumber, parentName) {
        var ruleString = taskService.GenerateConfig(parentName);
        var formattedRuleString = taskService.GenerateFormattedConfig(parentName);
        var configIds = taskService.GetSelectedConfigIds(parentName);

        var blockOfTableRow = "<tr id='" + tableName + rowNumber + "'><td><input type='checkbox' id='cb_" + tableName + rowNumber + "' /></td>";
        blockOfTableRow += "<td style='width: 690px;'><div id='div_" + tableName + rowNumber + "' data-configid='" + configIds + "' data-rawcontent='" + ruleString + "' data-formattedcontent='" + formattedRuleString + "'>" + ruleString + "</div></td>";
        var url = SPU.getAbsoluteUrl('Areas/FraudDetection/App_Themes/Images/Delete.gif');
        blockOfTableRow += "<td><img style='cursor: pointer; cursor: hand;' src='" + url + "' onclick='taskService.RemoveOneRuleFromTable(@" + tableName + "@," + rowNumber + ")' /></td></tr>";
        blockOfTableRow = blockOfTableRow.replace(/@/g, '"');

        var targetObject = "#" + tableName + " tr:last";
        $(targetObject).after(blockOfTableRow);
        taskService.UpdateFormula(tableName);
    };

    taskService.RemoveOneRuleFromTable = function (tableName, rowNumber) {
        var targetObject = "#" + tableName + rowNumber;
        $(targetObject).remove();
        taskService.UpdateFormula(tableName);
    };

    taskService.changeActionSelection = function (currentObj) {
        var selectedAction = $(currentObj).find(":selected");
        var actionDesc = $(selectedAction).attr("data-actiondesc");

        $('#selectedActionDesc').text(actionDesc);
    };

    taskService.changeruleConfigOperator = function (currentObj, isPrecondition) {
        var selectedOption = $(currentObj).find(":selected");
        var selectedValue = $(selectedOption).val();

        if (isPrecondition) {
            //
        } else {
            var configKey = $('#ruleConfigKey').val();
            switch (selectedValue) {
                case "Between":
                    if (configKey === "IP") {
                        $("#ruleConfigControlIpAddress").css("display", "none");
                        $("#ruleConfigControlIpAddressFrom").css("display", "inline-block");
                        $("#ruleConfigControlIpAddressTo").css("display", "inline-block");
                    }
                    break;
                default:
                    if (configKey === "IP") {
                        $("#ruleConfigControlIpAddress").css("display", "inline-block");
                        $("#ruleConfigControlIpAddressFrom").css("display", "none");
                        $("#ruleConfigControlIpAddressTo").css("display", "none");
                    }
                    break;
            }
        }
    };

    taskService.changeConfigSelection = function (currentObj, isPrecondition) {
        var selectedOption = $(currentObj).find(":selected");
        var controlType = $(selectedOption).attr("data-controltype");
        var selectedValue = $(selectedOption).val();
        selectedValue = selectedValue.toLowerCase().replace(/ /g, '');

        if (isPrecondition) {
            if ($("#preconditionConfigCompare").prop("checked") == false) {
                taskService.renderConfigControl("preconditionConfigControl", selectedValue, controlType);
            }
        } else {
            if ($("#ruleConfigCompare").prop("checked") == false) {
                taskService.renderConfigControl("ruleConfigControl", selectedValue, controlType);
            } else {
                var selectingRuleKey = $('#ruleConfigKey').val();
                if (selectingRuleKey == "Stake") {
                    $("#ruleConfigControlTextbox").css("display", "inline-block");
                } else {
                    $("#ruleConfigControlTextbox").css("display", "none");
                }
            }
        }
    };

    taskService.renderConfigControl = function (parentName, selectedValue, controlType) {
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
            case "IpAddress":
                if ($('#ruleConfigOperator').val() === "Between") {
                    $('#ruleConfigControlIpAddress').css("display", "none");
                    $('#ruleConfigControlIpAddressFrom').css("display", "inline-block");
                    $('#ruleConfigControlIpAddressTo').css("display", "inline-block");
                } else {
                    $('#ruleConfigControlIpAddress').css("display", "inline-block");
                    $('#ruleConfigControlIpAddressFrom').css("display", "none");
                    $('#ruleConfigControlIpAddressTo').css("display", "none");
                }
                break;
            default:
                $('[id^="' + parentName + 'Textbox"]').css("display", "inline-block");
                $('[id^="' + parentName + 'Textbox"]').val("");
        }
    };

    taskService.UpdateFormula = function (parentName) {
        var rawFormula = taskService.GetRawFormula(parentName);
        $('#' + parentName + 'Formula').attr('data-rawcontent', rawFormula);
        $('#' + parentName + 'Formula').attr('data-formattedcontent', taskService.GetFormattedFormula(parentName));
        $('#' + parentName + 'Formula').attr('data-configids', taskService.GetAllConfigIds(parentName));
        $('#' + parentName + 'Formula').text(rawFormula.replace(/#|@/g, " "));
    };

    taskService.GetRawFormula = function (parentName) {
        var rawFormula = "";
        $('div[id^="div_' + parentName + '"]').each(function () {
            rawFormula += $(this).attr("data-rawcontent") + "@";
        });

        rawFormula = rawFormula.slice(0, -1);
        return rawFormula;
    };

    taskService.GetFormattedFormula = function (parentName) {
        var rawFormula = "";
        $('div[id^="div_' + parentName + '"]').each(function () {
            var currentContent = $(this).attr("data-rawcontent");
            var currentRawContent = $(this).attr("data-formattedcontent");
            if (currentContent.indexOf("Match State") >= 0) {
                currentRawContent = currentRawContent.replace("Match State = notscanned", "$MatchState$").replace("Match State = scanned", "$MatchState$");
            }

            rawFormula += currentRawContent + "@";
        });

        rawFormula = rawFormula.slice(0, -1);
        return rawFormula;
    };

    taskService.GetAllConfigIds = function (parentName) {
        var configids = [];
        $('div[id^="div_' + parentName + '"]').each(function () {
            var configs = $(this).attr("data-configid").split("#");
            for (var i = 0; i < configs.length; i++) {
                if (configids.indexOf(configs[i]) < 0) {
                    configids.push(configs[i]);
                }
            }
        });

        return configids.join("#");
    };

    taskService.CheckFormula = function (parentName) {
        var formula = taskService.GetRawFormula(parentName);
        formula = formula.replace(/@/g, "#");
        var formulaCheckResults = expVal.validateLogicExpession(formula, "#").split(",");

        if (formulaCheckResults[0] == "") {
            return true;
        } else {
            $('#' + parentName + 'Formula').html(formulaCheckResults[formulaCheckResults.length - 1]);
            return false;
        }
    };

    taskService.onCompareWithOtherField = function (currentObj, isPrecondition) {
        var parentName = isPrecondition ? "preconditionConfig" : "ruleConfig";

        if ($(currentObj).prop("checked") == true) {
            var relevantObjects = '[id^="' + parentName + 'Control"]';
            $(relevantObjects).css("display", "none");
            var selectingRuleKey = $('#ruleConfigKey').val();

            $("#" + parentName + "ControlComboBoxKeyClone").css("display", "inline-block");
            $("#" + parentName + "ControlTextbox").css("display", "inline-block");

            if (!isPrecondition && selectingRuleKey !== "Stake") {
                $("#" + parentName + "ControlTextbox").css("display", "none");
            }
        } else {
            var selectedOption = $("#" + parentName + "Key").find(":selected");
            var controlType = $(selectedOption).attr("data-controltype");
            var selectedValue = $(selectedOption).val();
            selectedValue = selectedValue.toLowerCase().replace(/ /g, '');
            taskService.renderConfigControl(parentName + "Control", selectedValue, controlType);
        }
    };

    taskService.isNumber = function (evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    };

    function isIpAddress(ipAddress) {
        return ipAddress.isIpv4();
    }

    function checkIpRange(ipAddressFrom, ipAddressTo) {
        if (isIpAddress(ipAddressFrom) && isIpAddress(ipAddressTo)) {
            var from = ipAddressFrom.split("."),
                to = ipAddressTo.split(".");
            for (var i = 0; i < 3; i++) {
                if (parseInt(from[i]) !== parseInt(to[i]))
                    return false;
            }

            return !(parseInt(from[3]) > parseInt(to[3]));
        }

        return false;
    }

    function formatIpAddress(ipAddress) {
        var ip = ipAddress.split(".");

        return parseInt(ip[0]) + "." + parseInt(ip[1]) + "." + parseInt(ip[2]) + "." + parseInt(ip[3]);
    }

    return taskService;
})(jQuery);