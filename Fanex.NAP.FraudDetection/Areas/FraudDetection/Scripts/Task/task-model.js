'use strict';
/*global taskModule*/

taskModule.factory('taskModel',
['taskFactory',
function (taskFactory) {
    var taskModel = {};

    taskModel.Events = [];
    taskModel.Activities = [];
    taskModel.Configs = [];
    taskModel.Sports = [];
    taskModel.CustomerGroups = [];
    taskModel.BackGroundTasks = [];

    taskModel.getEvents = function () {
        return taskFactory.getEvents().success(function (events) {
            taskModel.Events = events;
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
            Value: config.ConfigId
        };

        return result;
    };

    taskModel.getParamValue = function (configRow) {
        var result = {
            Name: '',
            Value: ''
        };

        switch (configRow.Param.ConfigName) {
            case "Match Date":
                result.Name = configRow.Value;
                result.Value = configRow.Value;
                break;
            case "Match Status":
                result = configRow.Value;
                break;
            case "Match State":
                result = configRow.Value;
                break;
            case "Match Code":
                result.Name = configRow.Value;
                result.Value = configRow.Value;
                break;
            case "League Type":
                result = configRow.Value;
                break;
            case "Sport":
                result.Name = configRow.Value.SportName;
                result.Value = configRow.Value.SportId;
                break;
            case "Scanned Date":
                result.Name = configRow.Value;
                result.Value = configRow.Value;
                break;
            default:
                break;
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

    return taskModel;
} ]);

/*
EventId: 1,
Timer: '',
TimerUnit: 'Second',
BackGroundTaskId: 1
*/