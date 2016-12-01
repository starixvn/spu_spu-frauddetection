'use strict';
/*global taskModule*/

taskModule.controller('taskAddController',
['taskModel',
function (taskModel) {
    taskModel.onAccordionInitialize();

    var vm = this;

    vm.Model = angular.copy(taskModel.Model);

    /*
    Next action model.
    */
    vm.nextActionAssignGroup = angular.copy(taskModel.nextActionAssignGroup);
    vm.nextActionSendMail = angular.copy(taskModel.nextActionSendMail);
    vm.nextActionCaptureData = angular.copy(taskModel.nextActionCaptureData);
    vm.nextActionPostMessage = angular.copy(taskModel.nextActionPostMessage);

    /*
    Old data.
    */
    vm.OldModel = [];
    vm.OldActivityId = angular.copy(vm.Model.Activity.ActivityId);

    /*
    Value on pages.
    */
    vm.IsCheckingPrecondition = true;
    vm.IsCheckingRule = true;
    vm.IsCheckNotScanned = false;

    vm.CaseId = $("#caseid").text();
    vm.OnUserId = $("#onUserid").text();
    vm.Events = taskModel.Events;
    vm.Activities = taskModel.Activities;
    vm.EvidenceTypes = taskModel.EvidenceTypes;
    vm.Configs = taskModel.Configs;
    vm.Configs = taskModel.Sports;
    vm.CustomerGroups = taskModel.CustomerGroups;
    vm.BackGroundTasks = taskModel.BackGroundTasks;
    vm.BetTypes = taskModel.BetTypes;
    vm.Currencies = taskModel.Currencies;
    vm.DataTypes = taskModel.DataTypes;
    vm.Mails = taskModel.Mails;
    vm.Messages = taskModel.Messages;
    vm.Preconditions = [];
    vm.Rules = [];
    vm.ComparePreconditions = angular.copy(vm.Preconditions);
    vm.CompareRules = angular.copy(vm.Rules);
    vm.deleteIcon = window.SPU.getAbsoluteUrl('Areas/FraudDetection/App_Themes/Images/Delete.gif');
    vm.Timers = taskModel.Timers;
    vm.Operators = taskModel.Operators;
    vm.MatchStatuses = taskModel.MatchStatuses;
    vm.MatchStates = taskModel.MatchStates;
    vm.LeagueTypes = taskModel.LeagueTypes;
    vm.FormulaElements = taskModel.FormulaElements;
    vm.TicketStatuses = taskModel.TicketStatuses;
    vm.Choices = taskModel.Choices;
    vm.Arbitrages = taskModel.Arbitrages;
    vm.NextActions = taskModel.NextActions;

    /*
    Show/hide variables.
    */
    vm.CompareWithOtherField = {
        InPrecondition: false,
        InRule: false
    };

    vm.DataInRule = {
        TextBox: true,
        ComboBox: false,
        DateTime: false,
        IpAddress: false
    };

    /*
    Precondition model.
    */
    vm.preconditionRow = {
        FormulaElements: [],
        IsChecked: false,
        Param: vm.Preconditions[0],
        Operator: vm.Operators[0],
        Value: angular.copy($('#preconditionDateTimePicker').val()),
        AdditionalValue: '',
        IsCompare: vm.CompareWithOtherField.InPrecondition
    };

    /*
    Rule model.
    */
    vm.ruleRow = {
        FormulaElements: [],
        IsChecked: false,
        Param: vm.Rules[0],
        Operator: vm.Operators[0],
        Value: '',
        AdditionalValue: '',
        IsCompare: vm.CompareWithOtherField.InRule
    };

    /*
    Tab control.
    */
    vm.tab = {
        general: true,
        event: false,
        activity: false,
        rule: false,
        summary: false
    };

    vm.taskProgress = {
        general: 'active',
        event: '',
        activity: '',
        rule: '',
        summary: ''
    };

    /*
    Methods.
    */
    vm.cancel = function () {
        var url = "/Case/GetCaseDetail?caseId=" + vm.CaseId;
        window.location.href = window.location.href.split('/Task', 1)[0].toString() + url;
    };

    vm.nextToEvent = function () {
        if (taskModel.checkGeneralTab(vm.Model.General)) {
            vm.goToStep(2);
        } else {
            AlertService.showAlert("The task should have a name!");
        }
    };

    vm.nextToActivity = function () {
        if (taskModel.checkEventTab(vm.Model.Event)) {
            vm.goToStep(3);
        } else {
            AlertService.showAlert("Please input the timer value!");
        }
    };

    vm.nextToRule = function () {
        vm.goToStep(4);
    };

    vm.nextToSummary = function () {
        if (taskModel.checkFormula(vm.Model.Rule.PreconditionTable, '#preconditionTableFormula')) {
            if (taskModel.checkFormula(vm.Model.Rule.RuleTable, '#ruleTableFormula')) {
                vm.goToStep(5);
            } else {
                vm.IsCheckingRule = false;
            }
        }
        else {
            vm.IsCheckingPrecondition = false;
        }
    };

    vm.backToGeneral = function () {
        vm.goToStep(1);
    };

    vm.backToEvent = function () {
        vm.goToStep(2);
    };

    vm.backToActivity = function () {
        vm.goToStep(3);
    };

    vm.backToRule = function () {
        vm.goToStep(4);
    };

    vm.goToStep = function (stepNumber) {
        if (stepNumber === 1) {
            taskModel.goToStep(vm.taskProgress, vm.tab, stepNumber);
            return;
        }

        if (!taskModel.checkGeneralTab(vm.Model.General) && stepNumber !== 1) {
            AlertService.showAlert("The task should have a name!");
            taskModel.goToStep(vm.taskProgress, vm.tab, 1);
        } else {
            if (!taskModel.checkEventTab(vm.Model.Event) && stepNumber !== 2) {
                AlertService.showAlert("Please input the timer value!");
                taskModel.goToStep(vm.taskProgress, vm.tab, 2);
            } else {
                if (stepNumber === 5) {
                    if (taskModel.checkFormula(vm.Model.Rule.PreconditionTable, '#preconditionTableFormula')) {
                        if (taskModel.checkFormula(vm.Model.Rule.RuleTable, '#ruleTableFormula')) {
                            taskModel.goToStep(vm.taskProgress, vm.tab, 5);
                        } else {
                            vm.IsCheckingRule = false;
                        }
                    } else {
                        vm.IsCheckingPrecondition = false;
                    }

                    return;
                }

                taskModel.goToStep(vm.taskProgress, vm.tab, stepNumber);
            }
        }
    };

    vm.changeEvent = function () {
        if (vm.Model.Event.EventId === 2) {
            vm.Model.Event.BackGroundTaskId = vm.BackGroundTasks.length > 0 ? vm.BackGroundTasks[0].TaskId : 0;
        }
    };

    vm.changeComparePrecondition = function () {
        vm.preconditionRow.IsCompare = vm.CompareWithOtherField.InPrecondition;

        vm.changePreCondition();
    };

    vm.changeCompareRule = function () {
        vm.ruleRow.IsCompare = vm.CompareWithOtherField.InRule;

        vm.changeRule();
    };

    vm.changeActivity = function () {
        var index = vm.OldModel.map(function (e) {
            return e.ActivityId;
        }).indexOf(vm.OldActivityId);

        var backupModel = {
            ActivityId: vm.OldActivityId,
            Rule: vm.Model.Rule,
            NexActions: [vm.nextActionAssignGroup, vm.nextActionSendMail, vm.nextActionCaptureData, vm.nextActionPostMessage]
        };

        if (index > -1) {
            vm.OldModel.splice(index, 1);
        }

        vm.OldModel.push(angular.copy(backupModel));

        index = vm.OldModel.map(function (e) {
            return e.ActivityId;
        }).indexOf(vm.Model.Activity.ActivityId);

        if (index > -1) {
            vm.Model.Rule.PreconditionTable = angular.copy(vm.OldModel[index].Rule.PreconditionTable);
            vm.Model.Rule.RuleTable = angular.copy(vm.OldModel[index].Rule.RuleTable);
            vm.nextActionAssignGroup = angular.copy(vm.OldModel[index].NexActions[0]);
            vm.nextActionSendMail = angular.copy(vm.OldModel[index].NexActions[1]);
            vm.nextActionCaptureData = angular.copy(vm.OldModel[index].NexActions[2]);
            vm.nextActionPostMessage = angular.copy(vm.OldModel[index].NexActions[3]);
        } else {
            vm.Model.Rule.PreconditionTable = [];
            vm.Model.Rule.RuleTable = [];
            vm.nextActionAssignGroup = angular.copy(taskModel.nextActionAssignGroup);
            vm.nextActionSendMail = angular.copy(taskModel.nextActionSendMail);
            vm.nextActionCaptureData = angular.copy(taskModel.nextActionCaptureData);
            vm.nextActionPostMessage = angular.copy(taskModel.nextActionPostMessage);
        }

        vm.OldActivityId = angular.copy(vm.Model.Activity.ActivityId);

        taskModel.getConfigsByActivity(vm.Model.Activity.ActivityId).then(function () {
            vm.Configs = taskModel.Configs;
            vm.Preconditions = [];
            vm.Rules = [];

            angular.forEach(vm.Configs, function (config) {
                if (config.ConfigCategory === "Match") {
                    vm.Preconditions.push(config);
                } else {
                    vm.Rules.push(config);
                }
            });

            vm.ComparePreconditions = angular.copy(vm.Preconditions);
            vm.CompareRules = angular.copy(vm.Rules);
            vm.preconditionRow.Param = vm.Preconditions.length > 0 ? vm.Preconditions[0] : '';
            vm.ruleRow.Param = vm.Rules.length > 0 ? vm.Rules[0] : '';

            vm.changePreCondition();
            vm.changeRule();
        });
    };

    vm.changePreCondition = function () {
        taskModel.changePreCondition(vm);
    };

    vm.changeRule = function () {
        taskModel.changeRule(vm);
    };

    vm.changeAssignGroup = function () {
        if (vm.nextActionAssignGroup.IsTicked) {
            vm.nextActionAssignGroup.ActionTargetId = vm.CustomerGroups.length > 0 ? vm.CustomerGroups[0].GroupId : -1;
        }
    };

    vm.changeSendMail = function () {
        if (vm.nextActionSendMail.IsTicked) {
            vm.nextActionSendMail.ActionTargetId = vm.Mails.length > 0 ? vm.Mails[0].MailId : -1;
        }
    };

    vm.changePostMessage = function () {
        if (vm.nextActionPostMessage.IsTicked) {
            vm.nextActionPostMessage.ActionTargetId = vm.Messages.length > 0 ? vm.Messages[0].MessageId : -1;
        }
    };

    taskModel.getConfigsByActivity(vm.Model.Activity.ActivityId).then(function () {
        vm.Configs = taskModel.Configs;
        vm.Preconditions = [];
        vm.Rules = [];

        angular.forEach(vm.Configs, function (config) {
            if (config.ConfigCategory === "Match") {
                vm.Preconditions.push(config);
            } else {
                vm.Rules.push(config);
            }
        });

        vm.ComparePreconditions = angular.copy(vm.Preconditions);
        vm.CompareRules = angular.copy(vm.Rules);
        vm.preconditionRow.Param = vm.Preconditions.length > 0 ? vm.Preconditions[0] : '';
        vm.ruleRow.Param = vm.Rules.length > 0 ? vm.Rules[0] : '';
    });

    vm.openCalendar = function (dateTimePicker) {
        $(dateTimePicker).datepicker('show');
    };

    vm.showInPrecondition = function (config) {
        return (config.ConfigName !== 'Today' && config.ConfigName !== 'Current Time' && config.ConfigName !== 'Has Changed' && config.ConfigName !== 'Live Score') && !vm.CompareWithOtherField.InPrecondition ||
               (config.ConfigName === 'Match Date' || config.ConfigName === 'Scanned Date' || config.ConfigName === 'Kick-off Time'
             || config.ConfigName === 'Live Score') && vm.CompareWithOtherField.InPrecondition;
    };

    vm.showInComparePrecondition = function (config) {
        return (config.ConfigName === 'Today' || config.ConfigName === 'Current Time' || config.ConfigName === 'Has Changed');
    };

    vm.showInRule = function (config) {
        return (config.ConfigName !== 'Has Changed From Original'
            && config.ConfigName !== 'Has Changed From Latest Capture'
            && config.ConfigName !== '% Max Bet'
            && config.ConfigName !== 'In Danger Period');
    };

    vm.showInCompareRule = function (config) {
        return (config.ConfigName === 'Has Changed From Original'
            || config.ConfigName === 'Has Changed From Latest Capture'
            || config.ConfigName === '% Max Bet'
            || config.ConfigName === 'In Danger Period');
    };

    vm.addPrecondition = function () {
        var preconditionRow = {
            FormulaElements: vm.preconditionRow.FormulaElements,
            Param: taskModel.getParam(vm.preconditionRow.Param),
            Operator: vm.preconditionRow.Operator,
            Value: taskModel.getParamValue(vm.preconditionRow),
            AdditionalValue: vm.preconditionRow.AdditionalValue,
            IsCompare: vm.preconditionRow.IsCompare
        };

        taskModel.getSpecialParamValue(preconditionRow, false);

        vm.Model.Rule.PreconditionTable.push(angular.copy(preconditionRow));

        vm.IsCheckingPrecondition = true;
    };

    vm.addRule = function () {
        debugger;
        var ruleRow = {
            FormulaElements: vm.ruleRow.FormulaElements,
            Param: taskModel.getParam(vm.ruleRow.Param),
            Operator: vm.ruleRow.Operator,
            Value: taskModel.getParamValue(vm.ruleRow),
            AdditionalValue: vm.ruleRow.AdditionalValue,
            IsCompare: vm.ruleRow.IsCompare
        };

        if (taskModel.getSpecialParamValue(ruleRow, true)) {
            vm.Model.Rule.RuleTable.push(angular.copy(ruleRow));
        }

        vm.IsCheckingRule = true;
    };

    vm.changeTimePicker = function () {
        vm.preconditionRow.Value = angular.copy($('#preconditionDateTimePicker').val());
    };

    vm.removePrecondition = function (item) {
        var index = vm.Model.Rule.PreconditionTable.indexOf(item);
        if (index > -1) {
            vm.Model.Rule.PreconditionTable.splice(index, 1);
        }

        vm.IsCheckingPrecondition = true;
    };

    vm.removeRule = function (item) {
        var index = vm.Model.Rule.RuleTable.indexOf(item);
        if (index > -1) {
            vm.Model.Rule.RuleTable.splice(index, 1);
        }

        vm.IsCheckingRule = true;
    };

    vm.tableFormula = function (table, isRule) {
        return taskModel.getRawFormula(table, isRule).replace(/@/g, " ").replace(/#/g, " ");
    };

    vm.rowFormula = function (row, isRule) {
        return taskModel.getRowRawFormula(row, isRule).replace(/@/g, " ").replace(/#/g, " ");
    };

    vm.addRemoveFormulaElementInPrecondition = function (formulaElement) {
        taskModel.addRemoveFormulaElement(vm.Model.Rule.PreconditionTable, formulaElement);

        vm.IsCheckingPrecondition = true;
    };

    vm.addRemoveFormulaElementInRule = function (formulaElement) {
        taskModel.addRemoveFormulaElement(vm.Model.Rule.RuleTable, formulaElement);

        vm.IsCheckingRule = true;
    };

    /*
    Add task.
    */
    vm.addEditTask = function () {
        if (taskModel.checkFormula(vm.Model.Rule.PreconditionTable, '#preconditionTableFormula')) {
            if (taskModel.checkFormula(vm.Model.Rule.RuleTable, '#ruleTableFormula')) {

                var param = {
                    "CreatorId": vm.OnUserId,
                    "CaseId": vm.CaseId,
                    "TaskName": vm.Model.General.TaskName,
                    "TaskDesc": vm.Model.General.TaskDesc,
                    "IsActive": vm.Model.General.IsActive,
                    "EventId": vm.Model.Event.EventId,
                    "BackGroundTaskId": vm.Model.Event.BackGroundTaskId,
                    "ActivityId": vm.Model.Activity.ActivityId,
                    "Interval": vm.Model.Event.Timer,
                    "IntervalType": vm.Model.Event.TimerUnit,
                    "TaskPreconditions": taskModel.generateFormattedConfig(vm.Model.Rule.PreconditionTable),
                    "TaskPreconditionsFormatted": taskModel.generateFormattedConfig(vm.Model.Rule.PreconditionTable),
                    "TaskPreconditionsOriginal": taskModel.getFormula(vm.Model.Rule.PreconditionTable),
                    "TaskRules": taskModel.generateFormattedConfig(vm.Model.Rule.RuleTable),
                    "TaskRulesFormatted": taskModel.generateFormattedConfig(vm.Model.Rule.RuleTable),
                    "TaskRulesOriginal": taskModel.getFormula(vm.Model.Rule.RuleTable),
                    "NextActionIdList": taskModel.getNextActionIdList(vm.nextActionAssignGroup, vm.nextActionSendMail, vm.nextActionCaptureData, vm.nextActionPostMessage),
                    "NextActionTargetIdList": taskModel.getNextActionTargetIdList(vm.nextActionAssignGroup, vm.nextActionSendMail, vm.nextActionCaptureData, vm.nextActionPostMessage),
                    "PreconConfigs": taskModel.getConfigIds(vm.Model.Rule.PreconditionTable),
                    "RuleConfigs": taskModel.getConfigIds(vm.Model.Rule.RuleTable),
                    "IsCheckNotScanned": taskModel.IsCheckNotScanned(vm.Model.Rule.PreconditionTable),
                    "IsCheckNotSuspicious": taskModel.IsCheckNotSuspicious(vm.Model.Rule.PreconditionTable)
                };

                taskModel.addTask(param);
            } else {
                vm.IsCheckingRule = false;
            }
        }
        else {
            vm.IsCheckingPrecondition = false;
        }
    };

    taskModel.getEvents().then(function () {
        vm.Events = taskModel.Events;
    });

    taskModel.getMails().then(function () {
        vm.Mails = taskModel.Mails;
    });

    taskModel.getMessages().then(function () {
        vm.Messages = taskModel.Messages;
    });

    taskModel.getDataTypes().then(function () {
        vm.DataTypes = taskModel.DataTypes;
    });

    taskModel.getCurrencies().then(function () {
        vm.Currencies = taskModel.Currencies;
    });

    taskModel.getSports().then(function () {
        vm.Sports = taskModel.Sports;
    });

    taskModel.getCustomerGroupByCase(vm.CaseId).then(function () {
        vm.CustomerGroups = taskModel.CustomerGroups;
    });

    taskModel.getBackGroundTasksByCase(vm.CaseId).then(function () {
        vm.BackGroundTasks = taskModel.BackGroundTasks;

        if (vm.BackGroundTasks.length > 0) {
            vm.Model.Event.BackGroundTaskId = vm.BackGroundTasks[0].TaskId;
        }
    });

    taskModel.getActivities().then(function () {
        vm.Activities = taskModel.Activities;
    });

    taskModel.getEvidenceTypes().then(function () {
        vm.EvidenceTypes = taskModel.EvidenceTypes;
    });

    taskModel.getBetTypes().then(function () {
        vm.BetTypes = taskModel.BetTypes;
    });
}]);

taskModule.controller('taskEditController',
['taskModel',
function (taskModel) {
    taskModel.onAccordionInitialize();

    var vm = this;

    /*
    Model.
    */
    vm.Model = angular.copy(taskModel.Model);

    /*
    Next action model.
    */
    vm.nextActionAssignGroup = angular.copy(taskModel.nextActionAssignGroup);
    vm.nextActionSendMail = angular.copy(taskModel.nextActionSendMail);
    vm.nextActionCaptureData = angular.copy(taskModel.nextActionCaptureData);
    vm.nextActionPostMessage = angular.copy(taskModel.nextActionPostMessage);

    /*
    Old data.
    */
    vm.OldModel = [];

    /*
    Value on pages.
    */
    vm.IsCheckingPrecondition = true;
    vm.IsCheckingRule = true;

    vm.CaseId = $("#caseid").text();
    vm.OnUserId = $("#onUserid").text();
    vm.TaskId = $("#taskId").text();
    vm.Task = taskModel.Task;
    vm.Events = taskModel.Events;
    vm.Activities = taskModel.Activities;
    vm.EvidenceTypes = taskModel.EvidenceTypes;
    vm.Configs = taskModel.Configs;
    vm.Configs = taskModel.Sports;
    vm.CustomerGroups = taskModel.CustomerGroups;
    vm.BackGroundTasks = taskModel.BackGroundTasks;
    vm.BetTypes = taskModel.BetTypes;
    vm.Currencies = taskModel.Currencies;
    vm.DataTypes = taskModel.DataTypes;
    vm.Mails = taskModel.Mails;
    vm.Messages = taskModel.Messages;
    vm.Preconditions = [];
    vm.Rules = [];
    vm.ComparePreconditions = angular.copy(vm.Preconditions);
    vm.CompareRules = angular.copy(vm.Rules);
    vm.deleteIcon = window.SPU.getAbsoluteUrl('Areas/FraudDetection/App_Themes/Images/Delete.gif');
    vm.Timers = taskModel.Timers;
    vm.Operators = taskModel.Operators;
    vm.MatchStatuses = taskModel.MatchStatuses;
    vm.MatchStates = taskModel.MatchStates;
    vm.LeagueTypes = taskModel.LeagueTypes;
    vm.FormulaElements = taskModel.FormulaElements;
    vm.TicketStatuses = taskModel.TicketStatuses;
    vm.Choices = taskModel.Choices;
    vm.Arbitrages = taskModel.Arbitrages;
    vm.NextActions = taskModel.NextActions;

    /*
    Show/hide variables.
    */
    vm.CompareWithOtherField = {
        InPrecondition: false,
        InRule: false
    };

    vm.DataInRule = {
        TextBox: true,
        ComboBox: false,
        DateTime: false,
        IpAddress: false
    };

    /*
    Precondition model.
    */
    vm.preconditionRow = {
        FormulaElements: [],
        IsChecked: false,
        Param: vm.Preconditions[0],
        Operator: vm.Operators[0],
        Value: angular.copy($('#preconditionDateTimePicker').val()),
        AdditionalValue: '',
        IsCompare: vm.CompareWithOtherField.InPrecondition
    };

    /*
    Rule model.
    */
    vm.ruleRow = {
        FormulaElements: [],
        IsChecked: false,
        Param: vm.Rules[0],
        Operator: vm.Operators[0],
        Value: '',
        AdditionalValue: '',
        IsCompare: vm.CompareWithOtherField.InRule
    };

    /*
    Tab control.
    */
    vm.tab = {
        general: false,
        event: false,
        activity: false,
        rule: false,
        summary: true
    };

    vm.taskProgress = {
        general: 'done',
        event: 'done',
        activity: 'done',
        rule: 'done',
        summary: 'active'
    };

    /*
    Methods.
    */
    vm.cancel = function () {
        var url = "/Case/GetCaseDetail?caseId=" + vm.CaseId;
        window.location.href = window.location.href.split('/Task', 1)[0].toString() + url;
    };

    vm.nextToEvent = function () {
        if (taskModel.checkGeneralTab(vm.Model.General)) {
            vm.goToStep(2);
        } else {
            AlertService.showAlert("The task should have a name!");
        }
    };

    vm.nextToActivity = function () {
        if (taskModel.checkEventTab(vm.Model.Event)) {
            vm.goToStep(3);
        } else {
            AlertService.showAlert("Please input the timer value!");
        }
    };

    vm.nextToSummary = function () {
        if (taskModel.checkFormula(vm.Model.Rule.PreconditionTable, '#preconditionTableFormula')) {
            if (taskModel.checkFormula(vm.Model.Rule.RuleTable, '#ruleTableFormula')) {
                vm.goToStep(5);
            } else {
                vm.IsCheckingRule = false;
            }
        }
        else {
            vm.IsCheckingPrecondition = false;
        }
    };

    vm.nextToRule = function () {
        vm.goToStep(4);
    };

    vm.backToGeneral = function () {
        vm.goToStep(1);
    };

    vm.backToEvent = function () {
        vm.goToStep(2);
    };

    vm.backToActivity = function () {
        vm.goToStep(3);
    };

    vm.backToRule = function () {
        vm.goToStep(4);
    };

    vm.goToStep = function (stepNumber) {
        if (stepNumber === 1) {
            taskModel.goToStep(vm.taskProgress, vm.tab, stepNumber);
            return;
        }

        if (!taskModel.checkGeneralTab(vm.Model.General) && stepNumber !== 1) {
            AlertService.showAlert("The task should have a name!");
            taskModel.goToStep(vm.taskProgress, vm.tab, 1);
        } else {
            if (!taskModel.checkEventTab(vm.Model.Event) && stepNumber !== 2) {
                AlertService.showAlert("Please input the timer value!");
                taskModel.goToStep(vm.taskProgress, vm.tab, 2);
            } else {
                if (stepNumber === 5) {
                    if (taskModel.checkFormula(vm.Model.Rule.PreconditionTable, '#preconditionTableFormula')) {
                        if (taskModel.checkFormula(vm.Model.Rule.RuleTable, '#ruleTableFormula')) {
                            taskModel.goToStep(vm.taskProgress, vm.tab, 5);
                        } else {
                            vm.IsCheckingRule = false;
                        }
                    } else {
                        vm.IsCheckingPrecondition = false;
                    }

                    return;
                }

                taskModel.goToStep(vm.taskProgress, vm.tab, stepNumber);
            }
        }
    };

    vm.changeEvent = function () {
        if (vm.Model.Event.EventId === 2) {
            vm.Model.Event.BackGroundTaskId = vm.BackGroundTasks.length > 0 ? vm.BackGroundTasks[0].TaskId : 0;
        }
    };

    vm.changeComparePrecondition = function () {
        vm.preconditionRow.IsCompare = vm.CompareWithOtherField.InPrecondition;

        vm.changePreCondition();
    };

    vm.changeCompareRule = function () {
        vm.ruleRow.IsCompare = vm.CompareWithOtherField.InRule;

        vm.changeRule();
    };

    vm.changeActivity = function () {
        var index = vm.OldModel.map(function (e) {
            return e.ActivityId;
        }).indexOf(vm.OldActivityId);

        var backupModel = {
            ActivityId: vm.OldActivityId,
            Rule: vm.Model.Rule,
            NexActions: [vm.nextActionAssignGroup, vm.nextActionSendMail, vm.nextActionCaptureData, vm.nextActionPostMessage]
        };

        if (index > -1) {
            vm.OldModel.splice(index, 1);
        }

        vm.OldModel.push(angular.copy(backupModel));

        index = vm.OldModel.map(function (e) {
            return e.ActivityId;
        }).indexOf(vm.Model.Activity.ActivityId);

        if (index > -1) {
            vm.Model.Rule.PreconditionTable = angular.copy(vm.OldModel[index].Rule.PreconditionTable);
            vm.Model.Rule.RuleTable = angular.copy(vm.OldModel[index].Rule.RuleTable);
            vm.nextActionAssignGroup = angular.copy(vm.OldModel[index].NexActions[0]);
            vm.nextActionSendMail = angular.copy(vm.OldModel[index].NexActions[1]);
            vm.nextActionCaptureData = angular.copy(vm.OldModel[index].NexActions[2]);
            vm.nextActionPostMessage = angular.copy(vm.OldModel[index].NexActions[3]);
        } else {
            vm.Model.Rule.PreconditionTable = [];
            vm.Model.Rule.RuleTable = [];
            vm.nextActionAssignGroup = angular.copy(taskModel.nextActionAssignGroup);
            vm.nextActionSendMail = angular.copy(taskModel.nextActionSendMail);
            vm.nextActionCaptureData = angular.copy(taskModel.nextActionCaptureData);
            vm.nextActionPostMessage = angular.copy(taskModel.nextActionPostMessage);
        }

        vm.OldActivityId = angular.copy(vm.Model.Activity.ActivityId);

        taskModel.getConfigsByActivity(vm.Model.Activity.ActivityId).then(function () {
            vm.Configs = taskModel.Configs;
            vm.Preconditions = [];
            vm.Rules = [];

            angular.forEach(vm.Configs, function (config) {
                if (config.ConfigCategory === "Match") {
                    vm.Preconditions.push(config);
                } else {
                    vm.Rules.push(config);
                }
            });

            vm.ComparePreconditions = angular.copy(vm.Preconditions);
            vm.CompareRules = angular.copy(vm.Rules);
            vm.preconditionRow.Param = vm.Preconditions.length > 0 ? vm.Preconditions[0] : '';
            vm.ruleRow.Param = vm.Rules.length > 0 ? vm.Rules[0] : '';

            vm.changePreCondition();
            vm.changeRule();
        });
    };

    vm.changePreCondition = function () {
        taskModel.changePreCondition(vm);
    };

    vm.changeRule = function () {
        taskModel.changeRule(vm);
    };

    vm.changeAssignGroup = function () {
        if (vm.nextActionAssignGroup.IsTicked) {
            vm.nextActionAssignGroup.ActionTargetId = vm.CustomerGroups.length > 0 ? vm.CustomerGroups[0].GroupId : -1;
        }
    };

    vm.changeSendMail = function () {
        if (vm.nextActionSendMail.IsTicked) {
            vm.nextActionSendMail.ActionTargetId = vm.Mails.length > 0 ? vm.Mails[0].MailId : -1;
        }
    };

    vm.changePostMessage = function () {
        if (vm.nextActionPostMessage.IsTicked) {
            vm.nextActionPostMessage.ActionTargetId = vm.Messages.length > 0 ? vm.Messages[0].MessageId : -1;
        }
    };

    vm.openCalendar = function (dateTimePicker) {
        $(dateTimePicker).datepicker('show');
    };

    vm.showInPrecondition = function (config) {
        return (config.ConfigName !== 'Today' && config.ConfigName !== 'Current Time' && config.ConfigName !== 'Has Changed' && config.ConfigName !== 'Live Score') && !vm.CompareWithOtherField.InPrecondition ||
               (config.ConfigName === 'Match Date' || config.ConfigName === 'Scanned Date' || config.ConfigName === 'Kick-off Time'
             || config.ConfigName === 'Live Score') && vm.CompareWithOtherField.InPrecondition;
    };

    vm.showInComparePrecondition = function (config) {
        return (config.ConfigName === 'Today' || config.ConfigName === 'Current Time' || config.ConfigName === 'Has Changed');
    };

    vm.showInRule = function (config) {
        return (config.ConfigName !== 'Has Changed From Original'
            && config.ConfigName !== 'Has Changed From Latest Capture'
            && config.ConfigName !== '% Max Bet'
            && config.ConfigName !== 'In Danger Period');
    };

    vm.showInCompareRule = function (config) {
        return (config.ConfigName === 'Has Changed From Original'
            || config.ConfigName === 'Has Changed From Latest Capture'
            || config.ConfigName === '% Max Bet'
            || config.ConfigName === 'In Danger Period');
    };

    vm.addPrecondition = function () {
        var preconditionRow = {
            FormulaElements: vm.preconditionRow.FormulaElements,
            Param: taskModel.getParam(vm.preconditionRow.Param),
            Operator: vm.preconditionRow.Operator,
            Value: taskModel.getParamValue(vm.preconditionRow),
            AdditionalValue: vm.preconditionRow.AdditionalValue,
            IsCompare: vm.preconditionRow.IsCompare
        };

        taskModel.getSpecialParamValue(preconditionRow, false);

        vm.Model.Rule.PreconditionTable.push(angular.copy(preconditionRow));

        vm.IsCheckingPrecondition = true;
    };

    vm.addRule = function () {
        var ruleRow = {
            FormulaElements: vm.ruleRow.FormulaElements,
            Param: taskModel.getParam(vm.ruleRow.Param),
            Operator: vm.ruleRow.Operator,
            Value: taskModel.getParamValue(vm.ruleRow),
            AdditionalValue: vm.ruleRow.AdditionalValue,
            IsCompare: vm.ruleRow.IsCompare
        };

        if (taskModel.getSpecialParamValue(ruleRow, true)) {
            vm.Model.Rule.RuleTable.push(angular.copy(ruleRow));
        }

        vm.IsCheckingRule = true;
    };

    vm.changeTimePicker = function () {
        vm.preconditionRow.Value = angular.copy($('#preconditionDateTimePicker').val());
    };

    vm.removePrecondition = function (item) {
        var index = vm.Model.Rule.PreconditionTable.indexOf(item);
        if (index > -1) {
            vm.Model.Rule.PreconditionTable.splice(index, 1);
        }

        vm.IsCheckingPrecondition = true;
    };

    vm.removeRule = function (item) {
        var index = vm.Model.Rule.RuleTable.indexOf(item);
        if (index > -1) {
            vm.Model.Rule.RuleTable.splice(index, 1);
        }

        vm.IsCheckingRule = true;
    };

    vm.tableFormula = function (table, isRule) {
        return taskModel.getRawFormula(table, isRule).replace(/@/g, " ").replace(/#/g, " ");
    };

    vm.rowFormula = function (row, isRule) {
        return taskModel.getRowRawFormula(row, isRule).replace(/@/g, " ").replace(/#/g, " ");
    };

    vm.addRemoveFormulaElementInPrecondition = function (formulaElement) {
        taskModel.addRemoveFormulaElement(vm.Model.Rule.PreconditionTable, formulaElement);

        vm.IsCheckingPrecondition = true;
    };

    vm.addRemoveFormulaElementInRule = function (formulaElement) {
        taskModel.addRemoveFormulaElement(vm.Model.Rule.RuleTable, formulaElement);

        vm.IsCheckingRule = true;
    };

    /*
    Add/Edit task.
    */
    vm.addEditTask = function () {
        if (taskModel.checkFormula(vm.Model.Rule.PreconditionTable, '#preconditionTableFormula')) {
            if (taskModel.checkFormula(vm.Model.Rule.RuleTable, '#ruleTableFormula')) {

                var param = {
                    "CreatorId": vm.OnUserId,
                    "CaseId": vm.CaseId,
                    "TaskId": vm.TaskId,
                    "TaskName": vm.Model.General.TaskName,
                    "TaskDesc": vm.Model.General.TaskDesc,
                    "IsActive": vm.Model.General.IsActive,
                    "EventId": vm.Model.Event.EventId,
                    "BackGroundTaskId": vm.Model.Event.BackGroundTaskId,
                    "ActivityId": vm.Model.Activity.ActivityId,
                    "Interval": vm.Model.Event.Timer,
                    "IntervalType": vm.Model.Event.TimerUnit,
                    "TaskPreconditions": taskModel.generateFormattedConfig(vm.Model.Rule.PreconditionTable),
                    "TaskPreconditionsFormatted": taskModel.generateFormattedConfig(vm.Model.Rule.PreconditionTable),
                    "TaskPreconditionsOriginal": taskModel.getFormula(vm.Model.Rule.PreconditionTable),
                    "TaskRules": taskModel.generateFormattedConfig(vm.Model.Rule.RuleTable),
                    "TaskRulesFormatted": taskModel.generateFormattedConfig(vm.Model.Rule.RuleTable),
                    "TaskRulesOriginal": taskModel.getFormula(vm.Model.Rule.RuleTable),
                    "NextActionIdList": taskModel.getNextActionIdList(vm.nextActionAssignGroup, vm.nextActionSendMail, vm.nextActionCaptureData, vm.nextActionPostMessage),
                    "NextActionTargetIdList": taskModel.getNextActionTargetIdList(vm.nextActionAssignGroup, vm.nextActionSendMail, vm.nextActionCaptureData, vm.nextActionPostMessage),
                    "PreconConfigs": taskModel.getConfigIds(vm.Model.Rule.PreconditionTable),
                    "RuleConfigs": taskModel.getConfigIds(vm.Model.Rule.RuleTable),
                    "IsCheckNotScanned": taskModel.IsCheckNotScanned(vm.Model.Rule.PreconditionTable),
                    "IsCheckNotSuspicious": taskModel.IsCheckNotSuspicious(vm.Model.Rule.PreconditionTable)
                };

                taskModel.editTask(param);
            } else {
                vm.IsCheckingRule = false;
            }
        }
        else {
            vm.IsCheckingPrecondition = false;
        }
    };

    taskModel.getEvents().then(function () {
        vm.Events = taskModel.Events;
    });

    taskModel.getMails().then(function () {
        vm.Mails = taskModel.Mails;
    });

    taskModel.getMessages().then(function () {
        vm.Messages = taskModel.Messages;
    });

    taskModel.getBackGroundTasksByCase(vm.CaseId).then(function () {
        vm.BackGroundTasks = taskModel.BackGroundTasks;

        var index = vm.BackGroundTasks.map(function (e) {
            return e.TaskId;
        }).indexOf(parseInt(vm.TaskId));

        if (index > -1) {
            vm.BackGroundTasks.splice(index, 1);
        }
    });

    taskModel.getActivities().then(function () {
        vm.Activities = taskModel.Activities;
    });

    taskModel.getTaskInfo(vm.TaskId).then(function () {
        vm.Task = taskModel.Task;

        vm.Model.General = {
            TaskName: vm.Task.TaskName,
            TaskDesc: vm.Task.TaskDesc,
            IsActive: vm.Task.IsActive
        };

        vm.Model.Event = {
            EventId: vm.Task.EventId,
            Timer: vm.Task.Interval,
            TimerUnit: vm.Task.IntervalType,
            BackGroundTaskId: vm.Task.BackGroundTaskId
        };

        vm.Model.Activity = {
            InputId: '',
            ActivityId: vm.Task.ActivityId,
            OutputId: ''
        };

        taskModel.getDataTypes().then(function () {
            vm.DataTypes = taskModel.DataTypes;
            taskModel.getCurrencies().then(function () {
                vm.Currencies = taskModel.Currencies;
                taskModel.getSports().then(function () {
                    vm.Sports = taskModel.Sports;
                    taskModel.getCustomerGroupByCase(vm.CaseId).then(function () {
                        vm.CustomerGroups = taskModel.CustomerGroups;
                        taskModel.getBetTypes().then(function () {
                            vm.BetTypes = taskModel.BetTypes;
                            vm.OldActivityId = angular.copy(vm.Model.Activity.ActivityId);
                            taskModel.getConfigsByActivity(vm.Model.Activity.ActivityId).then(function () {
                                taskModel.getEvidenceTypes().then(function () {
                                    vm.EvidenceTypes = taskModel.EvidenceTypes;
                                    vm.Configs = taskModel.Configs;
                                    vm.Preconditions = [];
                                    vm.Rules = [];

                                    angular.forEach(vm.Configs, function (config) {
                                        if (config.ConfigCategory === "Match") {
                                            vm.Preconditions.push(config);
                                        } else {
                                            vm.Rules.push(config);
                                        }
                                    });

                                    vm.ComparePreconditions = angular.copy(vm.Preconditions);
                                    vm.CompareRules = angular.copy(vm.Rules);
                                    vm.preconditionRow.Param = vm.Preconditions.length > 0 ? vm.Preconditions[0] : '';
                                    vm.ruleRow.Param = vm.Rules.length > 0 ? vm.Rules[0] : '';
                                    vm.Model.Rule.PreconditionTable = taskModel.makeFormula(vm.Task.TaskPreconditionsOriginal);
                                    vm.Model.Rule.RuleTable = taskModel.makeFormula(vm.Task.TaskRulesOriginal);

                                    taskModel.makeNextActions(vm.nextActionAssignGroup, vm.nextActionSendMail, vm.nextActionCaptureData, vm.nextActionPostMessage, vm.Task.NextActionIdList, vm.Task.NextActionTargetIdList);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}]);