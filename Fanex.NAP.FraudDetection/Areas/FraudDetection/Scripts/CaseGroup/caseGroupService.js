spuApp.factory('CaseGroupService', [
    '$q', '$filter', '$timeout', '$http', function($q, $filter, $timeout, $http) {
        var service = {};

        service.addCustomerGroupToCase = function (param) {
            var url = SPU.getAbsoluteUrl("CaseGroup/AddCustomerGroupToCase");

            return $http.post(url, param);
        };

        return service;
    }
]);