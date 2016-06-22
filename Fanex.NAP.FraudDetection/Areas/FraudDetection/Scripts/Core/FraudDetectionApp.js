/*exported fraudDetectionModule, taskModule, suspiciousCustomerReportModule, customerDetailsReportModule,
matchMonitoringReportModule, officeIPsReportModule, isteven-multi-select*/

var fraudDetectionModule = angular.module("fraudDetectionModule",
    ['taskModule',
    'suspiciousCustomerReportModule',
    'customerDetailsReportModule',
    'matchMonitoringReportModule',
    'liveMatchMonitoringReportModule',
    'officeIPsReportModule',
    'isteven-multi-select']);

var taskModule = angular.module("taskModule", []);

var suspiciousCustomerReportModule = angular.module("suspiciousCustomerReportModule", []);

var customerDetailsReportModule = angular.module("customerDetailsReportModule", []);
customerDetailsReportModule.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
} ]);

var matchMonitoringReportModule = angular.module("matchMonitoringReportModule", []);
var liveMatchMonitoringReportModule = angular.module("liveMatchMonitoringReportModule", []);
var officeIPsReportModule = angular.module("officeIPsReportModule", []);
