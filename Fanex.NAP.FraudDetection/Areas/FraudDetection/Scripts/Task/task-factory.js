'use strict';
/*global taskModule*/

taskModule.factory('taskFactory', ['$http', function ($http) {
    return {
        addTask: function (criteria) {
            return $http.post('/Task/AddTask', criteria);
        },

        editTask: function (criteria) {
            return $http.post('/Task/EditTask', criteria);
        }, 
        
        getTaskInfo: function (taskId) {
            return $http.get('/Task/GetTaskInfo', {
                params:
                    { taskId: taskId }
            });
        },

        getEvents: function () {
            return $http.get('/Task/GetEvents');
        },

        getActivities: function () {
            return $http.get('/Task/GetActivities');
        },

        getSports: function () {
            return $http.get('/Task/GetSports');
        },

        getConfigsByActivity: function (activityId) {
            return $http.get('/Task/GetConfigsByActivity', {
                params:
                    { activityId: activityId }
            });
        },

        getCustomerGroupByCase: function (caseId) {
            return $http.get('/Task/GetCustomerGroupByCase', {
                params:
                    { caseId: caseId }
            });
        },

        getBackGroundTasksByCase: function (caseId) {
            return $http.get('/Task/GetBackGroundTasksByCase', {
                params:
                    { caseId: caseId }
            });
        },

        getBetTypes: function () {
            return $http.get('/Task/GetBetTypes');
        },

        getCurrencies: function () {
            return $http.get('/Task/GetCurrencies');
        },

        getDataTypes: function () {
            return $http.get('/Task/GetDataTypes');
        },

        getMails: function () {
            return $http.get('/Task/GetMails');
        }
    };
} ]);