'use strict';
/*global taskModule*/

taskModule.factory('taskModel',
['taskFactory',
function (taskFactory) {
    var taskModel = {};

    taskModel.Model = [];

    taskModel.Model.General = {
        TaskName: '',
        TaskDesc: '',
        IsActive: true
    };

    taskModel.Model.Event = {
        EventId: 1,
        Timer: '',
        TimerUnit: 'Second',
        BackGroundTaskId: 1
    };

    taskModel.Model.Activity = {
        InputId: '',
        ActivityId: 1,
        OutputId: ''
    };

    taskModel.Model.Rule = {
        PreconditionTable: [],
        RuleTable: [],
        ActionTable: []
    };

    taskModel.nextActionAssignGroup = {
        ActionId: 1,
        IsTicked: false,
        ActionTargetId: 0
    };
    taskModel.nextActionSendMail = {
        ActionId: 2,
        IsTicked: false,
        ActionTargetId: 0
    };
    taskModel.nextActionCaptureData = {
        ActionId: 3,
        IsTicked: false,
        ActionTargetId: 0
    };

    taskModel.Task = [];
    taskModel.Events = [];
    taskModel.Activities = [];
    taskModel.Configs = [];
    taskModel.Sports = [];
    taskModel.CustomerGroups = [];
    taskModel.BackGroundTasks = [];
    taskModel.BetTypes = [];
    taskModel.Currencies = [];
    taskModel.DataTypes = [];
    taskModel.Mails = [];
    taskModel.Timers = [
        { Id: 1, Value: "Second", Name: "Second(s)" },
        { Id: 2, Value: "Minute", Name: "Minute(s)" },
        { Id: 3, Value: "Hour", Name: "Hour(s)" },
        { Id: 4, Value: "Day", Name: "Day(s)" }
    ];
    taskModel.Operators = [
        { Id: 1, Value: "Equal", Name: "=" },
        { Id: 2, Value: "Unequal", Name: "<>" },
        { Id: 3, Value: "LargerThan", Name: ">" },
        { Id: 4, Value: "LargerThanOrEqual", Name: ">=" },
        { Id: 5, Value: "LessThan", Name: "<" },
        { Id: 6, Value: "LessThanOrEqual", Name: "<=" },
        { Id: 7, Value: "Between", Name: "between" }
    ];
    taskModel.MatchStatuses = [
        { Id: 1, Value: "%completed%", Name: "Completed" },
        { Id: 2, Value: "%closed%", Name: "Closed" },
        { Id: 3, Value: "%running%", Name: "Running" }
    ];
    taskModel.MatchStates = [
        { Id: 1, Value: "notscanned", Name: "Not Scanned" },
        { Id: 2, Value: "scanned", Name: "Scanned" }
    ];
    taskModel.LeagueTypes = [
        { Id: 1, Value: "gue.IsMainMarket", Name: "Main Markets" },
        { Id: 2, Value: "gue.IsMainMarket", Name: "Other Markets" }
    ];
    taskModel.FormulaElements = [
        { Id: 1, Value: "(#", Name: "(+", IsPrefix: true },
        { Id: 2, Value: "(#", Name: "(-", IsPrefix: true },
        { Id: 3, Value: "#)", Name: ")+", IsPrefix: false },
        { Id: 4, Value: "#)", Name: ")-", IsPrefix: false },
        { Id: 5, Value: "AND#", Name: "AND+", IsPrefix: true },
        { Id: 6, Value: "AND#", Name: "AND-", IsPrefix: true },
        { Id: 7, Value: "OR#", Name: "OR+", IsPrefix: true },
        { Id: 8, Value: "OR#", Name: "OR-", IsPrefix: true }
    ];
    taskModel.TicketStatuses = [
        { Id: 1, Value: "112", Name: "Won" },
        { Id: 2, Value: "113", Name: "Lose" },
        { Id: 3, Value: "111", Name: "Draw" },
        { Id: 4, Value: "102", Name: "Void" },
        { Id: 5, Value: "103", Name: "Refund" },
        { Id: 6, Value: "101", Name: "Reject" },
        { Id: 7, Value: "0", Name: "Running" }
    ];
    taskModel.Choices = [
        { Id: 1, Value: "1,a", Name: "HDP: Away" },
        { Id: 2, Value: "3,h", Name: "OU: Over" },
        { Id: 3, Value: "3,a", Name: "OU: Under" },
        { Id: 4, Value: "5,1", Name: "1X2: 1" },
        { Id: 5, Value: "5,x", Name: "1X2: X" },
        { Id: 6, Value: "5,2", Name: "1X2: 2" }
    ];
    taskModel.Arbitrages = [
        { Id: 1, Value: "Yes", Name: "Yes" },
        { Id: 2, Value: "No", Name: "No" }
    ];
    taskModel.NextActions = [
        { Id: 1, Value: 1, Name: "Assign Group" },
        { Id: 2, Value: 2, Name: "Send Email" },
        { Id: 3, Value: 3, Name: "Capture Data" }
    ];

    taskModel.addTask = function (criteria) {
        return taskFactory.addTask(criteria).success(function (response) {
            if (response.IsSuccessful) {
                var url = "/Case/GetCaseDetail?caseId=" + $("#caseid").text();
                window.location.href = window.location.href.split('/Task', 1)[0].toString() + url;
            } else {
                AlertService.showAlert(response);
            }
        });
    };

    taskModel.editTask = function (criteria) {
        return taskFactory.editTask(criteria).success(function (response) {
            if (response.IsSuccessful) {
                var url = "/Case/GetCaseDetail?caseId=" + $("#caseid").text();
                window.location.href = window.location.href.split('/Task', 1)[0].toString() + url;
            } else {
                AlertService.showAlert(response);
            }
        });
    };

    taskModel.getTaskInfo = function (taskId) {
        return taskFactory.getTaskInfo(taskId).success(function (task) {
            taskModel.Task = task;
        });
    };

    taskModel.getEvents = function () {
        return taskFactory.getEvents().success(function (events) {
            taskModel.Events = events;
        });
    };

    taskModel.getMails = function () {
        return taskFactory.getMails().success(function (mails) {
            taskModel.Mails = mails;
        });
    };

    taskModel.getDataTypes = function () {
        return taskFactory.getDataTypes().success(function (dataTypes) {
            angular.forEach(dataTypes, function (dataType) {
                var data = {
                    IsChecked: false,
                    DataName: dataType.DataName,
                    DataId: dataType.DataId
                };

                taskModel.DataTypes.push(data);
            });
        });
    };

    taskModel.getActivities = function () {
        return taskFactory.getActivities().success(function (activities) {
            taskModel.Activities = activities;
        });
    };

    taskModel.getConfigsByActivity = function (activityId) {
        return taskFactory.getConfigsByActivity(activityId).success(function (configs) {
            taskModel.Configs = configs;
        });
    };

    taskModel.getSports = function () {
        return taskFactory.getSports().success(function (sports) {
            taskModel.Sports = sports;
        });
    };

    taskModel.getCustomerGroupByCase = function (caseId) {
        return taskFactory.getCustomerGroupByCase(caseId).success(function (customerGroups) {
            taskModel.CustomerGroups = customerGroups;
        });
    };

    taskModel.getBackGroundTasksByCase = function (caseId) {
        return taskFactory.getBackGroundTasksByCase(caseId).success(function (tasks) {
            taskModel.BackGroundTasks = tasks;
        });
    };

    taskModel.getBetTypes = function () {
        return taskFactory.getBetTypes().success(function (types) {
            taskModel.BetTypes = types;
        });
    };

    taskModel.getCurrencies = function () {
        return taskFactory.getCurrencies().success(function (currencies) {
            taskModel.Currencies = currencies;
        });
    };

    taskModel.checkGeneralTab = function (general) {
        if (general.TaskName.length <= 0) {
            return false;
        }

        return true;
    };

    taskModel.checkEventTab = function (event) {
        if (event.EventId === 1) {
            if (!$.isNumeric(event.Timer)) {
                return false;
            }
        }

        return true;
    };

    taskModel.getParam = function (config) {
        var result = {
            Name: config.ConfigName,
            Value: config.ConfigId,
            Type: config.ConfigControlType,
            Id: config.ConfigId
        };

        return result;
    };

    taskModel.getParamValue = function (configRow) {
        var result = {
            Name: '',
            Value: '',
            Id: ''
        };

        if (configRow.IsCompare) {
            result.Name = configRow.Value.ConfigName;
            result.Value = configRow.Value.ConfigId;
            result.Id = configRow.Value.ConfigId;
        } else {
            switch (configRow.Param.ConfigName) {
                case "Customer Group":
                    result.Name = configRow.Value.GroupName;
                    result.Value = configRow.Value.GroupId;
                    result.Id = configRow.Value.GroupId;
                    break;
                case "Match Status":
                    result = configRow.Value;
                    break;
                case "Match State":
                    result = configRow.Value;
                    break;
                case "League Type":
                    result = configRow.Value;
                    break;
                case "Sport":
                    result.Name = configRow.Value.SportName;
                    result.Value = configRow.Value.SportId;
                    result.Id = configRow.Value.SportId;
                    break;
                case "Ticket Status":
                    result = configRow.Value;
                    break;
                case "Bet Type":
                    result.Name = configRow.Value.BettypeName;
                    result.Value = configRow.Value.BettypeId;
                    result.Id = configRow.Value.BettypeId;
                    break;
                case "Currency":
                    result.Name = configRow.Value.CurrencyName;
                    result.Value = configRow.Value.CurrencyId;
                    result.Id = configRow.Value.CurrencyId;
                    break;
                case "Arbitrage":
                    result = configRow.Value;
                    break;
                case "Choice":
                    result = configRow.Value;
                    break;
                case "IP":
                    result.Name = $('#IpAddress').val();
                    result.Value = $('#IpAddress').val();
                    result.Id = $('#IpAddress').val();
                    break;
                default:
                    result.Name = configRow.Value;
                    result.Value = configRow.Value;
                    result.Id = configRow.Value;
                    break;
            }
        }

        return result;
    };

    taskModel.onAccordionInitialize = function () {
        $('#preconditionDateTimePicker').datepicker();
        $('#preconditionDateTimePicker').datetimepicker({
            showSecond: true,
            dateFormat: 'mm/dd/yy',
            timeFormat: 'HH:mm:ss',
            hourGrid: 3,
            minuteGrid: 5,
            secondGrid: 5,
            separator: ' ',
            showButtonPanel: true
        });

        $('#preconditionDateTimePicker').datetimepicker('setDate', (new Date()));

        $('#ruleDateTimePicker').datepicker();
        $('#ruleDateTimePicker').datetimepicker({
            showSecond: true,
            dateFormat: 'mm/dd/yy',
            timeFormat: 'HH:mm:ss',
            hourGrid: 3,
            minuteGrid: 5,
            secondGrid: 5,
            separator: ' ',
            showButtonPanel: true
        });
        //dateFormat(new Date(year, month, day, 0, 0, 0), 'mmm dd, yyyy HH:MM:ss')
        $('#ruleDateTimePicker').datetimepicker('setDate', (new Date()));

        $("#IpAddress").ipAddress();
        $("#IpAddressFrom").ipAddress();
        $("#IpAddressTo").ipAddress();

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

    taskModel.generateFormattedConfig = function (table) {
        var result = [];
        angular.forEach(table, function (row) {
            result.push(taskModel.getFormattedRowFormula(row));
        });

        return result.join("@");
    };

    taskModel.getFormattedRowFormula = function (row) {
        var result,
            prefixFormula = '',
            postfixFormula = '';

        angular.forEach(row.FormulaElements, function (formulaElement) {
            if (formulaElement.IsPrefix) {
                prefixFormula += formulaElement.Value;
            } else {
                postfixFormula += formulaElement.Value;
            }
        });

        if (prefixFormula.length > 0)
            prefixFormula += " ";
        if (postfixFormula.length > 0)
            postfixFormula = " " + postfixFormula;

        var key = row.Param.Name, operator = row.Operator.Name, value = row.Value.Name;

        switch (row.Param.Type) {
            case 'DatetimePicker':
                if (row.IsCompare) {
                    if (value.indexOf("Today") >= 0)
                        value = "CONVERT(date," + value + row.AdditionalValue + ")";
                } else {
                    value = '%' + value + '%';
                }

                break;
            case 'ComboBox':
                value = row.Value.Value;
                break;
            case 'TextBox':
                value = '%' + value + '%';
                break;
            case 'IpAddress':
                value = '%' + formatIpAddress(value) + '%';
                break;
            default:
                break;
        }

        if (row.Value.Name === "Has Changed From Latest Capture") {
            operator = "<>";
        }

        var data = key + " " + operator + " " + value;

        if (row.Param.Name == "TransDate" && row.Value.Name == "In Danger Period")
            data = "NEARTHEGOAL";

        if (row.Param.Name == "Arbitrage" && row.Value.Name == "Yes")
            data = "Arbitrage";

        if (row.Param.Name == "Stake" && row.Value.Name !== "Has Changed From Original") {
            value = value + "*0.01*" + row.Value.Value;
        }

        if (row.Param.Name === "Choice" && row.Value.Name !== "Has Changed From Original") {
            var choice = value.split(",");
            if (operator === "=") {
                data = "(ans.bettype=" + choice[0] + " and ans.betteam=%" + choice[1] + "%)";
            } else {
                data = "(ans.bettype<>" + choice[0] + " and ans.betteam<>%" + choice[1] + "%)";
            }
        } else if (row.Value.Name === "Has Changed From Original") {
            data = key + " <> ";
            switch (key) {
                case "Choice":
                    data = "(ans.bettype <> b.bettype and ans.betteam <> b.betteam)";
                    break;
                case "Stake":
                    data = "ans.stake <> b.stake";
                    break;
                case "Odds":
                    data += "b.odds";
                    break;
                case "SMA PT":
                    data += "b.tpositiontaking";
                    break;
                default:
                    data = "";
                    break;
            }
        }

        result = prefixFormula + data + postfixFormula;

        return result;
    };

    taskModel.addRemoveFormulaElement = function (table, formulaElement) {
        if (formulaElement.Name.indexOf("-") > -1) {
            angular.forEach(table, function (row) {
                if (row.IsChecked) {
                    var index = row.FormulaElements.map(function (e) {
                        return e.Value;
                    }).indexOf(formulaElement.Value);

                    if (index > -1) {
                        row.FormulaElements.splice(index, 1);
                    }
                }
            });
        } else {
            angular.forEach(table, function (row) {
                if (row.IsChecked) {
                    if (row.FormulaElements.length > 0) {
                        if (row.FormulaElements[0].Value.indexOf("OR") > -1 || row.FormulaElements[0].Value.indexOf("AND") > -1) {
                            if (formulaElement.Value.indexOf("OR") > -1 || formulaElement.Value.indexOf("AND") > -1) {
                                row.FormulaElements.splice(0, 1);
                                row.FormulaElements.unshift(formulaElement);
                            } else {
                                row.FormulaElements.push(formulaElement);
                            }
                        } else {
                            row.FormulaElements.unshift(formulaElement);
                        }
                    } else {
                        row.FormulaElements.push(formulaElement);
                    }
                }
            });
        }
    };

    taskModel.checkFormula = function (table, tableId) {
        var formula = taskModel.getRawFormula(table);
        formula = formula.replace(/@/g, "#");
        var formulaCheckResults = expVal.validateLogicExpession(formula, "#").split(",");

        if (formulaCheckResults[0] == "") {
            return true;
        } else {
            $(tableId).html(formulaCheckResults[formulaCheckResults.length - 1]);
            return false;
        }
    };

    taskModel.getRawFormula = function (table) {
        var result = [];
        angular.forEach(table, function (row) {
            result.push(taskModel.getRowRawFormula(row));
        });

        return result.join("@");
    };

    taskModel.getRowRawFormula = function (row) {
        var result,
            prefixFormula = '',
            postfixFormula = '';

        angular.forEach(row.FormulaElements, function (formulaElement) {
            if (formulaElement.IsPrefix) {
                prefixFormula += formulaElement.Value;
            } else {
                postfixFormula += formulaElement.Value;
            }
        });

        if (prefixFormula.length > 0)
            prefixFormula += " ";
        if (postfixFormula.length > 0)
            postfixFormula = " " + postfixFormula;

        result = prefixFormula + row.Param.Name + " " + row.Operator.Name + " " + row.Value.Name + " " + row.AdditionalValue + postfixFormula;

        return result;
    };

    taskModel.getRowFormula = function (row) {
        var result = [],
            prefix = [],
            keyId,
            operatorId,
            value = [],
            compare = 0;

        angular.forEach(row.FormulaElements, function (formulaElement) {
            prefix.push(formulaElement.Id);
        });

        keyId = row.Param.Id;
        operatorId = row.Operator.Id;
        value.push(row.Value.Id);
        value.push(row.AdditionalValue);
        if (row.IsCompare)
            compare = 1;

        result.push(prefix.join(","));
        result.push(keyId);
        result.push(operatorId);
        result.push(value.join(","));
        result.push(compare);

        return result.join("#");
    };

    taskModel.getFormula = function (table) {
        var result = [];
        angular.forEach(table, function (row) {
            result.push(taskModel.getRowFormula(row));
        });

        return result.join("@");
    };

    taskModel.makeFormula = function (stringData) {
        var table = [];
        angular.forEach(stringData.split("@"), function (data) {
            table.push(taskModel.makeRow(data));
        });

        return table;
    };

    taskModel.makeRow = function (stringData) {
        var row = {
            FormulaElements: [],
            IsChecked: false,
            Param: '',
            Operator: '',
            Value: '',
            AdditionalValue: '',
            IsCompare: false
        };

        var data = stringData.split("#");
        var index = 0;
        angular.forEach(data[0].split(","), function (id) {//formula
            index = taskModel.FormulaElements.map(function (e) {
                return e.Id;
            }).indexOf(parseInt(id));
            if (index >= 0)
                row.FormulaElements.push(taskModel.FormulaElements[index]);
        });

        index = taskModel.Configs.map(function (e) {
            return e.ConfigId;
        }).indexOf(parseInt(data[1]));
        row.Param = taskModel.Configs[index];

        index = taskModel.Operators.map(function (e) {
            return e.Id;
        }).indexOf(parseInt(data[2]));
        row.Operator = taskModel.Operators[index];

        row.IsCompare = parseInt(data[4]) === 1;

        row.Value = getParamValue(row, data[3].split(",")[0]);
        row.Value = taskModel.getParamValue(row);

        row.Param = taskModel.getParam(row.Param);
        row.AdditionalValue = data[3].split(",")[1] !== null ? data[3].split(",")[1] : "";

        return row;
    };

    taskModel.getConfigIds = function (table) {
        var result = [];

        angular.forEach(table, function (row) {
            result.push(row.Param.Id);
            if (row.IsCompare)
                result.push(row.Value.Id);
        });

        return result.join("#");
    };

    taskModel.getNextActionIdList = function (assignGroup, sendMail, captureData) {
        var result = [];
        if (assignGroup.IsTicked) {
            result.push(assignGroup.ActionId);
        }

        if (sendMail.IsTicked) {
            result.push(sendMail.ActionId);
        }

        if (captureData.IsTicked) {
            angular.forEach(taskModel.DataTypes, function (dataType) {
                if (dataType.IsChecked)
                    result.push(captureData.ActionId);
            });
        }

        return result.join(",");
    };

    taskModel.getNextActionTargetIdList = function (assignGroup, sendMail, captureData) {
        var result = [];
        if (assignGroup.IsTicked) {
            result.push(assignGroup.ActionTargetId);
        }

        if (sendMail.IsTicked) {
            result.push(sendMail.ActionTargetId);
        }

        if (captureData.IsTicked) {
            angular.forEach(taskModel.DataTypes, function (dataType) {
                if (dataType.IsChecked)
                    result.push(dataType.DataId);
            });
        }

        return result.join(",");
    };

    taskModel.makeNextActions = function (assignGroup, sendMail, captureData, nextActionList, targetList) {
        var actions = nextActionList.split(",");
        var targets = targetList.split(",");

        angular.forEach(taskModel.DataTypes, function (dataType) {
            dataType.IsChecked = false;
        });

        for (var i = 0; i < actions.length; i++) {
            if (assignGroup.ActionId === parseInt(actions[i])) {
                assignGroup.IsTicked = true;
                assignGroup.ActionTargetId = parseInt(targets[i]);
            }

            if (sendMail.ActionId === parseInt(actions[i])) {
                sendMail.IsTicked = true;
                sendMail.ActionTargetId = parseInt(targets[i]);
            }

            if (captureData.ActionId === parseInt(actions[i])) {
                captureData.IsTicked = true;
                var index = taskModel.DataTypes.map(function (e) {
                    return e.DataId;
                }).indexOf(parseInt(parseInt(targets[i])));

                taskModel.DataTypes[index].IsChecked = true;
            }
        }
    };

    var formatIpAddress = function (ipAddress) {
        var ip = ipAddress.split(".");

        return parseInt(ip[0]) + "." + parseInt(ip[1]) + "." + parseInt(ip[2]) + "." + parseInt(ip[3]);
    };

    var getParamValue = function (configRow, value) {
        var result = '', index;

        if (configRow.IsCompare) {
            index = taskModel.Configs.map(function (e) {
                return e.ConfigId;
            }).indexOf(parseInt(value));
            if (index >= 0)
                result = taskModel.Configs[index];
        } else {
            switch (configRow.Param.ConfigName) {
                case "Customer Group":
                    index = taskModel.CustomerGroups.map(function (e) {
                        return e.GroupId;
                    }).indexOf(parseInt(value));
                    if (index >= 0)
                        result = taskModel.CustomerGroups[index];
                    break;
                case "Match Status":
                    index = taskModel.MatchStatuses.map(function (e) {
                        return e.Id;
                    }).indexOf(parseInt(value));
                    if (index >= 0)
                        result = taskModel.MatchStatuses[index];
                    break;
                case "Match State":
                    index = taskModel.MatchStates.map(function (e) {
                        return e.Id;
                    }).indexOf(parseInt(value));
                    if (index >= 0)
                        result = taskModel.MatchStates[index];
                    break;
                case "League Type":
                    index = taskModel.LeagueTypes.map(function (e) {
                        return e.Id;
                    }).indexOf(parseInt(value));
                    if (index >= 0)
                        result = taskModel.LeagueTypes[index];
                    break;
                case "Sport":
                    index = taskModel.Sports.map(function (e) {
                        return e.SportId;
                    }).indexOf(parseInt(value));
                    if (index >= 0)
                        result = taskModel.Sports[index];
                    break;
                case "Ticket Status":
                    index = taskModel.TicketStatuses.map(function (e) {
                        return e.Id;
                    }).indexOf(parseInt(value));
                    if (index >= 0)
                        result = taskModel.TicketStatuses[index];
                    break;
                case "Bet Type":
                    index = taskModel.BetTypes.map(function (e) {
                        return e.BettypeId;
                    }).indexOf(parseInt(value));
                    if (index >= 0)
                        result = taskModel.BetTypes[index];
                    break;
                case "Currency":
                    index = taskModel.Currencies.map(function (e) {
                        return e.CurrencyId;
                    }).indexOf(parseInt(value));
                    if (index >= 0)
                        result = taskModel.Currencies[index];
                    break;
                case "Arbitrage":
                    index = taskModel.Arbitrages.map(function (e) {
                        return e.Id;
                    }).indexOf(parseInt(value));
                    if (index >= 0)
                        result = taskModel.Arbitrages[index];
                    break;
                case "Choice":
                    index = taskModel.Choices.map(function (e) {
                        return e.Id;
                    }).indexOf(parseInt(value));
                    if (index >= 0)
                        result = taskModel.Choices[index];
                    break;
                default:
                    result = value;
                    break;
            }
        }

        return result;
    };

    return taskModel;
} ]);