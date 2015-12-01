/*exported fraudDetectionModule, taskModule, suspiciousCustomerReportModule */

var fraudDetectionModule = angular.module("fraudDetectionModule", ['taskModule', 'suspiciousCustomerReportModule']);

var taskModule = angular.module("taskModule", []);

var suspiciousCustomerReportModule = angular.module("suspiciousCustomerReportModule", []);
suspiciousCustomerReportModule.directive('datetimepicker', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.datetimepicker({
                change: function (date) {
                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(date);
                    });

                }
            });
        }
    };
});