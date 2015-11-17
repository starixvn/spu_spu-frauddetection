'use strict';
/*global taskModule*/

taskModule.factory('taskFactory', ['$http', function ($http) {
    return {
        addTask: function (criteria) {
            return $http.post('Task/AddTask', criteria);
        },

        editTask: function (criteria) {
            return $http.post('EditTask', criteria);
        },

        getEvents: function () {
            return $http.get('Task/GetEvents');
        },

        getActivities: function () {
            return $http.get('Task/GetActivities');
        },

        getSports: function () {
            return $http.get('Task/GetSports');
        },

        getConfigsByActivity: function (activityId) {
            return $http.get('Task/GetConfigsByActivity', {
                params:
                    { activityId: activityId }
            });
        },

        getCustomerGroupByCase: function (caseId) {
            return $http.get('Task/GetCustomerGroupByCase', {
                params:
                    { caseId: caseId }
            });
        }, 
        
        getBackGroundTasksByCase: function (caseId) {
            return $http.get('Task/GetBackGroundTasksByCase', {
                params:
                    { caseId: caseId }
            });
        }
    };
} ]);