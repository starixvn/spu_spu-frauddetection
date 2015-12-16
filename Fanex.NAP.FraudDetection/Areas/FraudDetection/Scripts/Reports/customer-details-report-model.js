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

    var params = $location.search();

    customerDetailsReportModel.GeneralInfo = {
        CustId: parseInt(params.custId),
        FromDate: params.fromDate,
        ToDate: params.toDate
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