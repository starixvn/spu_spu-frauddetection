'use strict';
/*global taskModule*/

taskModule.controller('taskAddController',
['taskModel',
function (taskModel) {
    taskModel.onAccordionInitialize();

    var vm = this;

    vm.Model = [];

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
    vm.Configs = taskModel.Configs;
    vm.Configs = taskModel.Sports;
    vm.CustomerGroups = taskModel.CustomerGroups;
    vm.BackGroundTasks = taskModel.BackGroundTasks;
    vm.BetTypes = taskModel.BetTypes;
    vm.Currencies = taskModel.Currencies;
    vm.DataTypes = taskModel.DataTypes;
    vm.Mails = taskModel.Mails;
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
    Model.
    */
    vm.Model.General = taskModel.Model.General;
    vm.Model.Event = taskModel.Model.Event;
    vm.Model.Activity = taskModel.Model.Activity;
    vm.Model.Rule = taskModel.Model.Rule;

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
    Next action model.
    */
    vm.nextActionAssignGroup = angular.copy(taskModel.nextActionAssignGroup);
    vm.nextActionSendMail = angular.copy(taskModel.nextActionSendMail);
    vm.nextActionCaptureData = angular.copy(taskModel.nextActionCaptureData);

    /*
    Tab control.
    */
    vm.tab = {
        general: true,
        event: false,
        activity: false,
        rule: false
    };

    vm.taskProgress = {
        general: 'active',
        event: '',
        activity: '',
        rule: '',
        doneStep: 4
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
            vm.taskProgress.general = progressStatus.done;
            vm.taskProgress.event = activateProgress(vm.taskProgress.event);

            vm.tab.general = false;
            vm.tab.event = true;
            if (vm.taskProgress.doneStep === 1)
                vm.taskProgress.doneStep++;
        } else {
            AlertService.showAlert("The task should have a name!");
        }
    };

    vm.nextToActivity = function () {
        if (taskModel.checkEventTab(vm.Model.Event)) {
            vm.taskProgress.event = progressStatus.done;
            vm.taskProgress.activity = activateProgress(vm.taskProgress.activity);

            vm.tab.event = false;
            vm.tab.activity = true;
            if (vm.taskProgress.doneStep === 2)
                vm.taskProgress.doneStep++;
        } else {
            AlertService.showAlert("Please input the timer value!");
        }
    };

    vm.nextToRule = function () {
        vm.taskProgress.activity = progressStatus.done;
        vm.taskProgress.rule = activateProgress(vm.taskProgress.rule);

        vm.tab.activity = false;
        vm.tab.rule = true;
        if (vm.taskProgress.doneStep === 3)
            vm.taskProgress.doneStep++;
    };

    vm.backToGeneral = function () {
        vm.taskProgress.general = activateProgress(vm.taskProgress.general);
        vm.taskProgress.event = deactivateProgress(vm.taskProgress.event);

        vm.tab.event = false;
        vm.tab.general = true;
    };

    vm.backToEvent = function () {
        vm.taskProgress.event = activateProgress(vm.taskProgress.event);
        vm.taskProgress.activity = deactivateProgress(vm.taskProgress.activity);

        vm.tab.activity = false;
        vm.tab.event = true;
    };

    vm.backToActivity = function () {
        vm.taskProgress.activity = activateProgress(vm.taskProgress.activity);
        vm.taskProgress.rule = deactivateProgress(vm.taskProgress.rule);

        vm.tab.rule = false;
        vm.tab.activity = true;
    };

    vm.goToStep = function (stepNumber) {
        if (vm.taskProgress.doneStep >= stepNumber) {
            switch (stepNumber) {
                case 1:
                    vm.taskProgress.general = activateProgress(vm.taskProgress.general);
                    vm.taskProgress.event = deactivateProgress(vm.taskProgress.event);
                    vm.taskProgress.activity = deactivateProgress(vm.taskProgress.activity);
                    vm.taskProgress.rule = deactivateProgress(vm.taskProgress.rule);

                    vm.tab.general = true;
                    vm.tab.event = false;
                    vm.tab.activity = false;
                    vm.tab.rule = false;
                    break;
                case 2:
                    vm.taskProgress.general = deactivateProgress(vm.taskProgress.general);
                    vm.taskProgress.event = activateProgress(vm.taskProgress.event);
                    vm.taskProgress.activity = deactivateProgress(vm.taskProgress.activity);
                    vm.taskProgress.rule = deactivateProgress(vm.taskProgress.rule);

                    vm.tab.general = false;
                    vm.tab.event = true;
                    vm.tab.activity = false;
                    vm.tab.rule = false;
                    break;
                case 3:
                    vm.taskProgress.general = deactivateProgress(vm.taskProgress.general);
                    vm.taskProgress.event = deactivateProgress(vm.taskProgress.event);
                    vm.taskProgress.activity = activateProgress(vm.taskProgress.activity);
                    vm.taskProgress.rule = deactivateProgress(vm.taskProgress.rule);

                    vm.tab.general = false;
                    vm.tab.event = false;
                    vm.tab.activity = true;
                    vm.tab.rule = false;
                    break;
                case 4:
                    vm.taskProgress.general = deactivateProgress(vm.taskProgress.general);
                    vm.taskProgress.event = deactivateProgress(vm.taskProgress.event);
                    vm.taskProgress.activity = deactivateProgress(vm.taskProgress.activity);
                    vm.taskProgress.rule = activateProgress(vm.taskProgress.rule);

                    vm.tab.general = false;
                    vm.tab.event = false;
                    vm.tab.activity = false;
                    vm.tab.rule = true;
                    break;
                default:
                    vm.taskProgress.general = activateProgress(vm.taskProgress.general);
                    vm.tab.general = true;
                    vm.tab.event = false;
                    vm.tab.activity = false;
                    vm.tab.rule = false;
                    break;
            }
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
    };

    vm.changePreCondition = function () {
        switch (vm.preconditionRow.Param.ConfigName) {
            case "Customer Group":
                vm.preconditionRow.Value = vm.CustomerGroups[0];
                break;
            case "Match Date":
                vm.preconditionRow.Value = angular.copy($('#preconditionDateTimePicker').val());
                break;
            case "Match Status":
                vm.preconditionRow.Value = vm.MatchStatuses[0];
                break;
            case "Match State":
                vm.preconditionRow.Value = vm.MatchStates[0];
                break;
            case "Match Code":
                vm.preconditionRow.Value = '';
                break;
            case "League Type":
                vm.preconditionRow.Value = vm.LeagueTypes[0];
                break;
            case "Sport":
                vm.preconditionRow.Value = vm.Sports[0];
                break;
            case "Scanned Date":
                vm.preconditionRow.Value = angular.copy($('#preconditionDateTimePicker').val());
                break;
            default:
                break;
        }
    };

    vm.changeRule = function () {
        switch (vm.ruleRow.Param.ConfigName) {
            case "Ticket Status":
                vm.DataInRule.TextBox = false;
                vm.DataInRule.ComboBox = true;
                vm.DataInRule.DateTime = false;
                vm.DataInRule.IpAddress = false;

                vm.ruleRow.Value = vm.TicketStatuses[0];
                break;
            case "Bet Type":
                vm.DataInRule.TextBox = false;
                vm.DataInRule.ComboBox = true;
                vm.DataInRule.DateTime = false;
                vm.DataInRule.IpAddress = false;

                vm.ruleRow.Value = vm.BetTypes[0];
                break;
            case "Currency":
                vm.DataInRule.TextBox = false;
                vm.DataInRule.ComboBox = true;
                vm.DataInRule.DateTime = false;
                vm.DataInRule.IpAddress = false;

                vm.ruleRow.Value = vm.Currencies[0];
                break;
            case "Choice":
                vm.DataInRule.TextBox = false;
                vm.DataInRule.ComboBox = true;
                vm.DataInRule.DateTime = false;
                vm.DataInRule.IpAddress = false;

                vm.ruleRow.Value = vm.Choices[0];
                break;
            case "Arbitrage":
                vm.DataInRule.TextBox = false;
                vm.DataInRule.ComboBox = true;
                vm.DataInRule.DateTime = false;
                vm.DataInRule.IpAddress = false;

                vm.ruleRow.Value = vm.Arbitrages[0];
                break;
            case "TransDate":
                vm.DataInRule.TextBox = false;
                vm.DataInRule.ComboBox = false;
                vm.DataInRule.DateTime = true;
                vm.DataInRule.IpAddress = false;

                vm.ruleRow.Value = angular.copy($('#ruleDateTimePicker').val());
                break;
            case "IP":
                vm.DataInRule.TextBox = false;
                vm.DataInRule.ComboBox = false;
                vm.DataInRule.DateTime = false;
                vm.DataInRule.IpAddress = true;

                vm.ruleRow.Value = $('#IpAddress').val();
                break;
            default:
                vm.DataInRule.TextBox = true;
                vm.DataInRule.ComboBox = false;
                vm.DataInRule.DateTime = false;
                vm.DataInRule.IpAddress = false;

                vm.ruleRow.Value = '';
                break;
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
        return (config.ConfigName !== 'Today') && !vm.CompareWithOtherField.InPrecondition ||
               (config.ConfigName === 'Match Date' || config.ConfigName === 'Scanned Date') && vm.CompareWithOtherField.InPrecondition;
    };

    vm.showInComparePrecondition = function (config) {
        return (config.ConfigName === 'Today');
    };

    vm.showInRule = function (config) {
        return (config.ConfigName !== 'Has Changed From Original');
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

        if (preconditionRow.Param.Name === "Match State" && preconditionRow.Value.Name === "Not Scanned") {
            vm.IsCheckNotScanned = true;
        }

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

        vm.Model.Rule.RuleTable.push(angular.copy(ruleRow));

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

    vm.tableFormula = function (table) {
        return taskModel.getRawFormula(table).replace(/@/g, " ").replace(/#/g, " ");
    };

    vm.rowFormula = function (row) {
        return taskModel.getRowRawFormula(row).replace(/@/g, " ").replace(/#/g, " ");
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
                    "NextActionIdList": taskModel.getNextActionIdList(vm.nextActionAssignGroup, vm.nextActionSendMail, vm.nextActionCaptureData),
                    "NextActionTargetIdList": taskModel.getNextActionTargetIdList(vm.nextActionAssignGroup, vm.nextActionSendMail, vm.nextActionCaptureData),
                    "PreconConfigs": taskModel.getConfigIds(vm.Model.Rule.PreconditionTable),
                    "RuleConfigs": taskModel.getConfigIds(vm.Model.Rule.RuleTable),
                    "IsCheckNotScanned": vm.IsCheckNotScanned
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

    taskModel.getBetTypes().then(function () {
        vm.BetTypes = taskModel.BetTypes;
    });

    var progressStatus = {
        active: 'active',
        done: 'done',
        doneActive: 'done active'
    };

    var activateProgress = function (progress) {
        if (progress.indexOf('done') >= 0) {
            return progressStatus.doneActive;
        } else {
            return progressStatus.active;
        }
    };

    var deactivateProgress = function (progress) {
        if (progress.indexOf('done') >= 0) {
            return progressStatus.done;
        } else {
            return '';
        }
    };
} ]);

taskModule.controller('taskEditController',
['taskModel',
function (taskModel) {
    taskModel.onAccordionInitialize();

    var vm = this;

    vm.Model = [];

    /*
    Value on pages.
    */
    vm.IsCheckingPrecondition = true;
    vm.IsCheckingRule = true;
    vm.IsCheckNotScanned = false;

    vm.CaseId = $("#caseid").text();
    vm.OnUserId = $("#onUserid").text();
    vm.TaskId = $("#taskId").text();
    vm.Task = taskModel.Task;
    vm.Events = taskModel.Events;
    vm.Activities = taskModel.Activities;
    vm.Configs = taskModel.Configs;
    vm.Configs = taskModel.Sports;
    vm.CustomerGroups = taskModel.CustomerGroups;
    vm.BackGroundTasks = taskModel.BackGroundTasks;
    vm.BetTypes = taskModel.BetTypes;
    vm.Currencies = taskModel.Currencies;
    vm.DataTypes = taskModel.DataTypes;
    vm.Mails = taskModel.Mails;
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
    Model.
    */
    vm.Model.General = angular.copy(taskModel.Model.General);
    vm.Model.Event = angular.copy(taskModel.Model.Event);
    vm.Model.Activity = angular.copy(taskModel.Model.Activity);
    vm.Model.Rule = angular.copy(taskModel.Model.Rule);

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
    Next action model.
    */
    vm.nextActionAssignGroup = angular.copy(taskModel.nextActionAssignGroup);
    vm.nextActionSendMail = angular.copy(taskModel.nextActionSendMail);
    vm.nextActionCaptureData = angular.copy(taskModel.nextActionCaptureData);

    /*
    Tab control.
    */
    vm.tab = {
        general: true,
        event: false,
        activity: false,
        rule: false
    };

    vm.taskProgress = {
        general: 'active',
        event: '',
        activity: '',
        rule: '',
        doneStep: 4
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
            vm.taskProgress.general = progressStatus.done;
            vm.taskProgress.event = activateProgress(vm.taskProgress.event);

            vm.tab.general = false;
            vm.tab.event = true;
            if (vm.taskProgress.doneStep === 1)
                vm.taskProgress.doneStep++;
        } else {
            AlertService.showAlert("The task should have a name!");
        }
    };

    vm.nextToActivity = function () {
        if (taskModel.checkEventTab(vm.Model.Event)) {
            vm.taskProgress.event = progressStatus.done;
            vm.taskProgress.activity = activateProgress(vm.taskProgress.activity);

            vm.tab.event = false;
            vm.tab.activity = true;
            if (vm.taskProgress.doneStep === 2)
                vm.taskProgress.doneStep++;
        } else {
            AlertService.showAlert("Please input the timer value!");
        }
    };

    vm.nextToRule = function () {
        vm.taskProgress.activity = progressStatus.done;
        vm.taskProgress.rule = activateProgress(vm.taskProgress.rule);

        vm.tab.activity = false;
        vm.tab.rule = true;
        if (vm.taskProgress.doneStep === 3)
            vm.taskProgress.doneStep++;
    };

    vm.backToGeneral = function () {
        vm.taskProgress.general = activateProgress(vm.taskProgress.general);
        vm.taskProgress.event = deactivateProgress(vm.taskProgress.event);

        vm.tab.event = false;
        vm.tab.general = true;
    };

    vm.backToEvent = function () {
        vm.taskProgress.event = activateProgress(vm.taskProgress.event);
        vm.taskProgress.activity = deactivateProgress(vm.taskProgress.activity);

        vm.tab.activity = false;
        vm.tab.event = true;
    };

    vm.backToActivity = function () {
        vm.taskProgress.activity = activateProgress(vm.taskProgress.activity);
        vm.taskProgress.rule = deactivateProgress(vm.taskProgress.rule);

        vm.tab.rule = false;
        vm.tab.activity = true;
    };

    vm.goToStep = function (stepNumber) {
        if (vm.taskProgress.doneStep >= stepNumber) {
            switch (stepNumber) {
                case 1:
                    vm.taskProgress.general = activateProgress(vm.taskProgress.general);
                    vm.taskProgress.event = deactivateProgress(vm.taskProgress.event);
                    vm.taskProgress.activity = deactivateProgress(vm.taskProgress.activity);
                    vm.taskProgress.rule = deactivateProgress(vm.taskProgress.rule);

                    vm.tab.general = true;
                    vm.tab.event = false;
                    vm.tab.activity = false;
                    vm.tab.rule = false;
                    break;
                case 2:
                    vm.taskProgress.general = deactivateProgress(vm.taskProgress.general);
                    vm.taskProgress.event = activateProgress(vm.taskProgress.event);
                    vm.taskProgress.activity = deactivateProgress(vm.taskProgress.activity);
                    vm.taskProgress.rule = deactivateProgress(vm.taskProgress.rule);

                    vm.tab.general = false;
                    vm.tab.event = true;
                    vm.tab.activity = false;
                    vm.tab.rule = false;
                    break;
                case 3:
                    vm.taskProgress.general = deactivateProgress(vm.taskProgress.general);
                    vm.taskProgress.event = deactivateProgress(vm.taskProgress.event);
                    vm.taskProgress.activity = activateProgress(vm.taskProgress.activity);
                    vm.taskProgress.rule = deactivateProgress(vm.taskProgress.rule);

                    vm.tab.general = false;
                    vm.tab.event = false;
                    vm.tab.activity = true;
                    vm.tab.rule = false;
                    break;
                case 4:
                    vm.taskProgress.general = deactivateProgress(vm.taskProgress.general);
                    vm.taskProgress.event = deactivateProgress(vm.taskProgress.event);
                    vm.taskProgress.activity = deactivateProgress(vm.taskProgress.activity);
                    vm.taskProgress.rule = activateProgress(vm.taskProgress.rule);

                    vm.tab.general = false;
                    vm.tab.event = false;
                    vm.tab.activity = false;
                    vm.tab.rule = true;
                    break;
                default:
                    vm.taskProgress.general = activateProgress(vm.taskProgress.general);
                    vm.tab.general = true;
                    vm.tab.event = false;
                    vm.tab.activity = false;
                    vm.tab.rule = false;
                    break;
            }
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
    };

    vm.changePreCondition = function () {
        switch (vm.preconditionRow.Param.ConfigName) {
            case "Customer Group":
                vm.preconditionRow.Value = vm.CustomerGroups[0];
                break;
            case "Match Date":
                vm.preconditionRow.Value = angular.copy($('#preconditionDateTimePicker').val());
                break;
            case "Match Status":
                vm.preconditionRow.Value = vm.MatchStatuses[0];
                break;
            case "Match State":
                vm.preconditionRow.Value = vm.MatchStates[0];
                break;
            case "Match Code":
                vm.preconditionRow.Value = '';
                break;
            case "League Type":
                vm.preconditionRow.Value = vm.LeagueTypes[0];
                break;
            case "Sport":
                vm.preconditionRow.Value = vm.Sports[0];
                break;
            case "Scanned Date":
                vm.preconditionRow.Value = angular.copy($('#preconditionDateTimePicker').val());
                break;
            default:
                break;
        }
    };

    vm.changeRule = function () {
        switch (vm.ruleRow.Param.ConfigName) {
            case "Ticket Status":
                vm.DataInRule.TextBox = false;
                vm.DataInRule.ComboBox = true;
                vm.DataInRule.DateTime = false;
                vm.DataInRule.IpAddress = false;

                vm.ruleRow.Value = vm.TicketStatuses[0];
                break;
            case "Bet Type":
                vm.DataInRule.TextBox = false;
                vm.DataInRule.ComboBox = true;
                vm.DataInRule.DateTime = false;
                vm.DataInRule.IpAddress = false;

                vm.ruleRow.Value = vm.BetTypes[0];
                break;
            case "Currency":
                vm.DataInRule.TextBox = false;
                vm.DataInRule.ComboBox = true;
                vm.DataInRule.DateTime = false;
                vm.DataInRule.IpAddress = false;

                vm.ruleRow.Value = vm.Currencies[0];
                break;
            case "Choice":
                vm.DataInRule.TextBox = false;
                vm.DataInRule.ComboBox = true;
                vm.DataInRule.DateTime = false;
                vm.DataInRule.IpAddress = false;

                vm.ruleRow.Value = vm.Choices[0];
                break;
            case "Arbitrage":
                vm.DataInRule.TextBox = false;
                vm.DataInRule.ComboBox = true;
                vm.DataInRule.DateTime = false;
                vm.DataInRule.IpAddress = false;

                vm.ruleRow.Value = vm.Arbitrages[0];
                break;
            case "TransDate":
                vm.DataInRule.TextBox = false;
                vm.DataInRule.ComboBox = false;
                vm.DataInRule.DateTime = true;
                vm.DataInRule.IpAddress = false;

                vm.ruleRow.Value = angular.copy($('#ruleDateTimePicker').val());
                break;
            case "IP":
                vm.DataInRule.TextBox = false;
                vm.DataInRule.ComboBox = false;
                vm.DataInRule.DateTime = false;
                vm.DataInRule.IpAddress = true;

                vm.ruleRow.Value = $('#IpAddress').val();
                break;
            default:
                vm.DataInRule.TextBox = true;
                vm.DataInRule.ComboBox = false;
                vm.DataInRule.DateTime = false;
                vm.DataInRule.IpAddress = false;

                vm.ruleRow.Value = '';
                break;
        }
    };

    vm.openCalendar = function (dateTimePicker) {
        $(dateTimePicker).datepicker('show');
    };

    vm.showInPrecondition = function (config) {
        return (config.ConfigName !== 'Today') && !vm.CompareWithOtherField.InPrecondition ||
               (config.ConfigName === 'Match Date' || config.ConfigName === 'Scanned Date') && vm.CompareWithOtherField.InPrecondition;
    };

    vm.showInComparePrecondition = function (config) {
        return (config.ConfigName === 'Today');
    };

    vm.showInRule = function (config) {
        return (config.ConfigName !== 'Has Changed From Original');
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

        if (preconditionRow.Param.Name === "Match State" && preconditionRow.Value.Name === "Not Scanned") {
            vm.IsCheckNotScanned = true;
        }

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

        vm.Model.Rule.RuleTable.push(angular.copy(ruleRow));

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

    vm.tableFormula = function (table) {
        return taskModel.getRawFormula(table).replace(/@/g, " ").replace(/#/g, " ");
    };

    vm.rowFormula = function (row) {
        return taskModel.getRowRawFormula(row).replace(/@/g, " ").replace(/#/g, " ");
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
                    "NextActionIdList": taskModel.getNextActionIdList(vm.nextActionAssignGroup, vm.nextActionSendMail, vm.nextActionCaptureData),
                    "NextActionTargetIdList": taskModel.getNextActionTargetIdList(vm.nextActionAssignGroup, vm.nextActionSendMail, vm.nextActionCaptureData),
                    "PreconConfigs": taskModel.getConfigIds(vm.Model.Rule.PreconditionTable),
                    "RuleConfigs": taskModel.getConfigIds(vm.Model.Rule.RuleTable),
                    "IsCheckNotScanned": vm.IsCheckNotScanned
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

    taskModel.getBackGroundTasksByCase(vm.CaseId).then(function () {
        vm.BackGroundTasks = taskModel.BackGroundTasks;
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

                                vm.Model.Rule.PreconditionTable = taskModel.makeFormula(vm.Task.TaskPreconditionsOriginal);
                                vm.Model.Rule.RuleTable = taskModel.makeFormula(vm.Task.TaskRulesOriginal);

                                taskModel.makeNextActions(vm.nextActionAssignGroup, vm.nextActionSendMail, vm.nextActionCaptureData, vm.Task.NextActionIdList, vm.Task.NextActionTargetIdList);
                            });
                        });
                    });
                });
            });
        });
    });

    var progressStatus = {
        active: 'active',
        done: 'done',
        doneActive: 'done active'
    };

    var activateProgress = function (progress) {
        if (progress.indexOf('done') >= 0) {
            return progressStatus.doneActive;
        } else {
            return progressStatus.active;
        }
    };

    var deactivateProgress = function (progress) {
        if (progress.indexOf('done') >= 0) {
            return progressStatus.done;
        } else {
            return '';
        }
    };
} ]);