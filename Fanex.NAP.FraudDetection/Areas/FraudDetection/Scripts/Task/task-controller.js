'use strict';
/*global taskModule*/

taskModule.controller('taskController',
['taskModel',
function (taskModel) {
    taskModel.onAccordionInitialize();

    var vm = this;

    vm.Model = [];

    vm.CaseId = $("#caseid").text();
    vm.OnUserId = $("#onUserid").text();
    vm.Events = taskModel.Events;
    vm.Activities = taskModel.Activities;
    vm.Configs = taskModel.Configs;
    vm.Configs = taskModel.Sports;
    vm.CustomerGroups = taskModel.CustomerGroups;
    vm.BackGroundTasks = taskModel.BackGroundTasks;
    vm.Preconditions = [];
    vm.Rules = [];
    vm.ComparePreconditions = angular.copy(vm.Preconditions);
    vm.CompareRules = angular.copy(vm.Rules);
    vm.deleteIcon = SPU.getAbsoluteUrl('Areas/FraudDetection/App_Themes/Images/Delete.gif');
    vm.Timers = [
        { Value: "Second", Name: "Second(s)" },
        { Value: "Minute", Name: "Minute(s)" },
        { Value: "Hour", Name: "Hour(s)" },
        { Value: "Day", Name: "Day(s)" }
    ];
    vm.Operators = [
        { Value: "Equal", Name: "=" },
        { Value: "Unequal", Name: "<>" },
        { Value: "LargerThan", Name: ">" },
        { Value: "LargerThanOrEqual", Name: ">=" },
        { Value: "LessThan", Name: "<" },
        { Value: "LessThanOrEqual", Name: "<=" },
        { Value: "Between", Name: "between" }
    ];
    vm.MatchStatuses = [
        { Value: "%completed%", Name: "Completed" },
        { Value: "%closed%", Name: "Closed" },
        { Value: "%running%", Name: "Running" }
    ];
    vm.MatchStates = [
        { Value: "notscanned", Name: "Not Scanned" },
        { Value: "scanned", Name: "Scanned" }
    ];
    vm.LeagueTypes = [
        { Value: "gue.IsMainMarket", Name: "Main Markets" },
        { Value: "gue.IsMainMarket", Name: "Other Markets" }
    ];
    vm.FormulaElements = [
        { Value: "(#", Name: "(+", IsPrefix: true },
        { Value: "(#", Name: "(-", IsPrefix: true },
        { Value: "#)", Name: ")+", IsPrefix: false },
        { Value: "#)", Name: ")-", IsPrefix: false },
        { Value: "AND#", Name: "AND+", IsPrefix: true },
        { Value: "AND#", Name: "AND-", IsPrefix: true },
        { Value: "OR#", Name: "OR+", IsPrefix: true },
        { Value: "OR#", Name: "OR-", IsPrefix: true }
    ];

    vm.Model.General = {
        TaskName: '',
        TaskDesc: '',
        IsActive: true
    };

    vm.Model.Event = {
        EventId: 1,
        Timer: '',
        TimerUnit: 'Second',
        BackGroundTaskId: 1
    };

    vm.Model.Activity = {
        InputId: '',
        ActivityId: 1,
        OutputId: ''
    };

    vm.Model.Rule = {
        PreconditionTable: [],
        RuleTable: [],
        ActionTable: []
    };

    vm.CompareWithOtherField = {
        InPrecondition: false,
        InRule: false
    };

    vm.preconditionRow = {
        FormulaElements: [],
        IsChecked: false,
        Param: vm.Preconditions[0],
        Operator: vm.Operators[0],
        Value: angular.copy($('#preconditionDateTimePicker').val())
    };

    vm.preconditionTable = [];

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
            //vm.model.PreConfig = vm.Preconditions.length > 0 ? vm.Preconditions[0] : '';
            //vm.model.PreConfig = vm.Rules.length > 0 ? vm.Preconditions[0].ConfigId : 0;
        });
    };

    vm.changePreCondition = function () {
        switch (vm.preconditionRow.Param.ConfigName) {
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
        vm.preconditionRow.Param = vm.Preconditions.length > 0 ? vm.Preconditions[0] : '';
        //vm.model.PreConfig = vm.Preconditions.length > 0 ? vm.Preconditions[0] : '';
        //vm.model.PreConfig = vm.Rules.length > 0 ? vm.Preconditions[0].ConfigId : 0;
    });

    vm.openCalendar = function (dateTimePicker) {
        $(dateTimePicker).datepicker('show');
    };

    vm.showInPrecondition = function (config) {
        return (config.ConfigName !== 'Today');
    };

    vm.addPrecondition = function () {
        var preconditionRow = {
            FormulaElements: vm.preconditionRow.FormulaElements,
            Param: taskModel.getParam(vm.preconditionRow.Param),
            Operator: vm.preconditionRow.Operator,
            Value: taskModel.getParamValue(vm.preconditionRow)
        };

        vm.preconditionTable.push(angular.copy(preconditionRow));
    };

    vm.changeTimePicker = function () {
        vm.preconditionRow.Value = angular.copy($('#preconditionDateTimePicker').val());
    };

    vm.removePrecondition = function (item) {
        var index = vm.preconditionTable.indexOf(item);
        if (index > -1) {
            vm.preconditionTable.splice(index, 1);
        }
    };

    vm.preconditionTableFormula = function () {
        var result = '';
        angular.forEach(vm.preconditionTable, function (precondition) {

            result += vm.preconditionRowFormula(precondition);
        });

        return result;
    };

    vm.preconditionRowFormula = function (precondition) {
        var result = '',
            preFixFormula = '',
            postFixFormula = '';

        angular.forEach(precondition.FormulaElements, function (formulaElement) {
            if (formulaElement.IsPrefix) {
                preFixFormula += formulaElement.Value.replace("#", " ");
            } else {
                postFixFormula += formulaElement.Value.replace("#", " ");
            }
        });

        result = preFixFormula + " " + precondition.Param.Name + " " + precondition.Operator.Name + " " + precondition.Value.Name + " " + postFixFormula;

        return result;
    };

    vm.addRemoveFormulaElement = function (formulaElement) {
        if (formulaElement.Name.indexOf("-") > -1) {
            angular.forEach(vm.preconditionTable, function (precondition) {
                if (precondition.IsChecked) {
                    var index = precondition.FormulaElements.map(function (e) {
                        return e.Value;
                    }).indexOf(formulaElement.Value);

                    if (index > -1) {
                        precondition.FormulaElements.splice(index, 1);
                    }
                }
            });
        } else {
            angular.forEach(vm.preconditionTable, function (precondition) {
                if (precondition.IsChecked) {
                    if (precondition.FormulaElements.length > 0) {
                        if (precondition.FormulaElements[0].Value.indexOf("OR") > -1 || precondition.FormulaElements[0].Value.indexOf("AND") > -1) {
                            if (formulaElement.Value.indexOf("OR") > -1 || formulaElement.Value.indexOf("AND") > -1) {
                                precondition.FormulaElements.splice(0, 1);
                                precondition.FormulaElements.unshift(formulaElement);
                            } else {
                                precondition.FormulaElements.push(formulaElement);
                            }
                        } else {
                            precondition.FormulaElements.unshift(formulaElement);
                        }
                    } else {
                        precondition.FormulaElements.push(formulaElement);
                    }
                }
            });
        }
    };

    taskModel.getEvents().then(function () {
        vm.Events = taskModel.Events;
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

    taskModel.onAccordionInitialize();

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