// --------------------------------------------------------------------------
// <copyright file="CustomerDetailsController.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015.12.11">Created</change>
// </history>

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;
    using Core.Business;
    using Core.Web.Attribute;
    using FD.Lib.Criteria.Reports;
    using FD.Lib.Criteria.SuspiciousStatistic;
    using FD.Lib.DTO;
    using FD.Lib.Model.Reports.DailyDataMonitoring;
    using FD.Lib.Service.Implement;
    using NAP.FraudDetection.Controllers;
    using RemotingRef;
    using Service.Core;

    /// <summary>
    /// The controller of Customer Details Report.
    /// </summary>
    public class CustomerDetailsController : BaseController
    {
        private readonly DailyDataMonitoringReportService _dailyDataMonitoringReportService;

        public CustomerDetailsController()
        {
            _dailyDataMonitoringReportService = new DailyDataMonitoringReportService();
        }

        /// <summary>
        /// Main page.
        /// </summary>
        /// <returns>The ActionResult.</returns>
        [NapAuth(FunctionKey = FDFunctionKeys.DailyDataMonitoring, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            return View("~/Areas/FraudDetection/Views/Reports/CustomerDetailsReport.cshtml");
        }

        /// <summary>
        /// Get Daily Data Monitoring report data.
        /// </summary>
        /// <param name="criteria">Daily Data Monitoring Report Get All Criteria.</param>
        /// <returns>Daily data monitoring report data.</returns>
        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.DailyDataMonitoring, Policy = Constant.Policy.Read)]
        public ActionResult Search(DailyDataMonitoringReportGetAllCriteria criteria)
        {
            var dailyDataMonitoring = FormatReportData(GenerateDailyDataMonitoringData(criteria));

            var result = new
            {
                dailyDataMonitoring
            };

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        #region Utilities

        private IEnumerable<DailyDataMonitoring> GenerateDailyDataMonitoringData(DailyDataMonitoringReportGetAllCriteria criteria)
        {
            var balanceUpMoveBetService = new MoveBetsBalanceUpService();
            var balanceUpMoveBetDates = balanceUpMoveBetService.GetBalanceUpDay(new BalanceUpDaySelectCriteria());
            criteria.MoveBetDate = balanceUpMoveBetDates.MoveBetsDay;
            criteria.BalanceUpDate = balanceUpMoveBetDates.BalanceUpDay;

            return _dailyDataMonitoringReportService.GetDailyDataMonitoringReport(criteria).ToList();
        }

        private IEnumerable<DailyDataMonitoringModel> FormatReportData(IEnumerable<DailyDataMonitoring> data, bool plainText = false)
        {
            var dailyDataMonitoringReport = new List<DailyDataMonitoringModel>();
            foreach (var records in data)
            {
                var homeName = RefData.GetTeamName(records.HomeId.ToString(), "en", string.Empty);
                var awayName = RefData.GetTeamName(records.AwayId.ToString(), "en", string.Empty);

                records.Event = plainText
                    ? homeName + " vs " + awayName
                    : "<b>" + homeName + "</b>" + " vs " + "<b>" + awayName + "</b>";

                dailyDataMonitoringReport.Add(new DailyDataMonitoringModel(records));
            }

            return dailyDataMonitoringReport;
        }

        #endregion
    }
}