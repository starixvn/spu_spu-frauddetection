spuApp.factory('CaseGroupService', [
    '$q', '$filter', '$timeout', '$http', function($q, $filter, $timeout, $http) {
        var service = {};

        service.getData = function (params) {
            //$http.post('http://localhost:49688/TimeSheet/GetData', params)
            //    .success(function (result) {
            //        //note, the server passes the information about the data set size
            //        deferred.resolve(result);
            //    });

            //return deferred.promise;
        };

        return service;
    }
]);