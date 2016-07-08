'use strict';
/*global taskModule*/

taskModule.factory('taskFactory', ['$http', function ($http) {
    return {
        addTask: function (criteria) {
            var url = SPU.getAbsoluteUrl("Task/AddTask");

            return $http.post(url, criteria);
        },

        editTask: function (criteria) {
            var url = SPU.getAbsoluteUrl("Task/EditTask");

            return $http.post(url, criteria);
        },

        getTaskInfo: function (taskId) {
            var url = SPU.getAbsoluteUrl("Task/GetTaskInfo");

            return $http.get(url, {
                params:
                    { taskId: taskId }
            });
        },

        getEvents: function () {
            var url = SPU.getAbsoluteUrl("Task/GetEvents");

            return $http.get(url);
        },

        getActivities: function () {
            var url = SPU.getAbsoluteUrl("Task/GetActivities");

            return $http.get(url);
        },

        getSports: function () {
            var url = SPU.getAbsoluteUrl("Task/GetSports");

            return $http.get(url);
        },

        getConfigsByActivity: function (activityId) {
            var url = SPU.getAbsoluteUrl("Task/GetConfigsByActivity");

            return $http.get(url, {
                params:
                    { activityId: activityId }
            });
        },

        getCustomerGroupByCase: function (caseId) {
            var url = SPU.getAbsoluteUrl("Task/GetCustomerGroupByCase");

            return $http.get(url, {
                params:
                    { caseId: caseId }
            });
        },

        getBackGroundTasksByCase: function (caseId) {
            var url = SPU.getAbsoluteUrl("Task/GetBackGroundTasksByCase");

            return $http.get(url, {
                params:
                    { caseId: caseId }
            });
        },

        getBetTypes: function () {
            var url = SPU.getAbsoluteUrl("Task/GetBetTypes");

            return $http.get(url);
        },

        getCurrencies: function () {
            var url = SPU.getAbsoluteUrl("Task/GetCurrencies");

            return $http.get(url);
        },

        getDataTypes: function () {
            var url = SPU.getAbsoluteUrl("Task/GetDataTypes");

            return $http.get(url);
        },

        getMails: function () {
            var url = SPU.getAbsoluteUrl("Task/GetMails");

            return $http.get(url);
        },

        getMessages: function () {
            var url = SPU.getAbsoluteUrl("Task/GetMessages");

            return $http.get(url);
        }
    };
} ]);