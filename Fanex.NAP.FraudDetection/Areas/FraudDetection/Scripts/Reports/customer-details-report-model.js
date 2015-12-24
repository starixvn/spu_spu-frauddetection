'use strict';
/*global customerDetailsReportModule*/

customerDetailsReportModule.factory('customerDetailsReportModel',
['customerDetailsReportFactory', '$location',
function (customerDetailsReportFactory, $location) {
    var customerDetailsReportModel = {};

    customerDetailsReportModel.CustInfo = {};
    customerDetailsReportModel.FraudCaseDetails = [];
    customerDetailsReportModel.LogNotes = [];
    customerDetailsReportModel.Summary = {};
    customerDetailsReportModel.EventChoices = [];
    customerDetailsReportModel.SportsByMargin = [];
    customerDetailsReportModel.BettypesByMargin = [];
    customerDetailsReportModel.DailyViolatedTickets = [];
    customerDetailsReportModel.IsHost = false;
    customerDetailsReportModel.EditAssingee = {
        isEditAssignee: false,
        assignees: '',
        Assignees: [],
        AssigneesTicked: []
    };

    var params = $location.search();

    customerDetailsReportModel.GeneralInfo = {
        CustId: parseInt(params.custId),
        FromDate: params.fromDate,
        ToDate: params.toDate
    };

    customerDetailsReportModel.getHostPermission = function () {
        return customerDetailsReportFactory.getHostPermission().success(function (result) {
            customerDetailsReportModel.IsHost = result;
        });
    };

    customerDetailsReportModel.insertAssignees = function (custId, assignees) {
        return customerDetailsReportFactory.insertAssignees(custId, assignees).success(function (result) {
            AlertService.showAlert(result);
        });
    };

    customerDetailsReportModel.getAssigneesById = function (custId) {
        return customerDetailsReportFactory.getAssigneesById(custId).success(function (assignees) {
            customerDetailsReportModel.EditAssingee.assignees = assignees;
        });
    };

    customerDetailsReportModel.getUsers = function () {
        return customerDetailsReportFactory.getUsers().success(function (users) {
            customerDetailsReportModel.EditAssingee.Assignees = [];

            angular.forEach(users, function (user) {
                var newUser = {
                    name: user.Username,
                    ticked: false
                };

                customerDetailsReportModel.EditAssingee.Assignees.push(newUser);
            });
        });
    };

    customerDetailsReportModel.updateDelinquency = function (custId, isDelinquent) {
        return customerDetailsReportFactory.updateDelinquency(custId, isDelinquent).success(function (result) {
            AlertService.showAlert(result);
        });
    };

    customerDetailsReportModel.getCustInfoById = function (custId) {
        return customerDetailsReportFactory.getCustInfoById(custId).success(function (custInfo) {
            customerDetailsReportModel.CustInfo = custInfo;
        });
    };

    customerDetailsReportModel.getFraudCaseDetails = function (custId, fromDate, toDate) {
        return customerDetailsReportFactory.getFraudCaseDetails(custId, fromDate, toDate).success(function (fraudCaseDetails) {
            customerDetailsReportModel.FraudCaseDetails = fraudCaseDetails;
        });
    };

    customerDetailsReportModel.getLogNotes = function (custId) {
        return customerDetailsReportFactory.getLogNotes(custId).success(function (logNotes) {
            customerDetailsReportModel.LogNotes = logNotes;
        });
    };

    customerDetailsReportModel.getWinlossStatistic = function (custId, fromDate, toDate) {
        return customerDetailsReportFactory.getWinlossStatistic(custId, fromDate, toDate).success(function (result) {
            customerDetailsReportModel.Summary = result.Summary;
            customerDetailsReportModel.EventChoices = result.EventChoice;
            customerDetailsReportModel.SportsByMargin = result.TopSportsByMargin;
            customerDetailsReportModel.BettypesByMargin = result.TopBettypesByMargin;
        });
    };

    customerDetailsReportModel.getDailyViolatedTickets = function (custId, fromDate, toDate) {
        return customerDetailsReportFactory.getDailyViolatedTickets(custId, fromDate, toDate).success(function (result) {
            customerDetailsReportModel.DailyViolatedTickets = result;
        });
    };

    customerDetailsReportModel.addNote = function (custId, note) {
        return customerDetailsReportFactory.addNote(custId, note).success(function (result) {
            AlertService.showAlert(result);
        });
    };

    customerDetailsReportModel.verifyCustomer = function (custId, caseId) {
        return customerDetailsReportFactory.verifyCustomer(custId, caseId).success(function (result) {
            AlertService.showAlert(result);
        });
    };

    return customerDetailsReportModel;
} ]);