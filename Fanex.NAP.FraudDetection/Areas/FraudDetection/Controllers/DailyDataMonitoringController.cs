// --------------------------------------------------------------------------
// <copyright file="DailyDataMonitoringController.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015.08.13">Created</change>
// </history>

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Web.Mvc;
    using FD.Lib.Core.ExportExcel;
    using FD.Lib.Criteria.Reports;
    using FD.Lib.Criteria.SuspiciousStatistic;
    using FD.Lib.DTO;
    using FD.Lib.Model.Reports.DailyDataMonitoring;
    using FD.Lib.Service.Implement;
    using NAP.FraudDetection.Controllers;
    using RemotingRef;
    using NPOI.SS.UserModel;
    using System.Web;

    /// <summary>
    /// The controller of Daily Data Monitoring Report.
    /// </summary>
    public class DailyDataMonitoringController : BaseController
    {
        private readonly DailyDataMonitoringReportService _dailyDataMonitoringReportService;

        public DailyDataMonitoringController()
        {
            _dailyDataMonitoringReportService = new DailyDataMonitoringReportService();
        }

        /// <summary>
        /// Main page.
        /// </summary>
        /// <returns>The ActionResult.</returns>
        public ActionResult Index()
        {
            return View("~/Areas/FraudDetection/Views/Reports/DailyDataMonitoringReport.cshtml");
        }

        /// <summary>
        /// Get Daily Data Monitoring report data.
        /// </summary>
        /// <param name="criteria">Daily Data Monitoring Report Get All Criteria.</param>
        /// <returns>Daily data monitoring report data.</returns>
        [HttpGet]
        public ActionResult Search(DailyDataMonitoringReportGetAllCriteria criteria)
        {
            var dailyDataMonitoring = FormatReportData(GenerateDailyDataMonitoringData(criteria));

            var result = new
            {
                dailyDataMonitoring
            };

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Export Daily Data Monitoring report to Excel file.
        /// </summary>
        /// <param name="criteria">Daily Data Monitoring Report Get All Criteria.</param>
        /// <returns>Daily Data monitoring report data.</returns>
        [HttpGet]
        public ActionResult ExportExcel(DailyDataMonitoringReportGetAllCriteria criteria)
        {
            var dailyDataMonitoring = FormatReportData(GenerateDailyDataMonitoringData(criteria), true);

            var excelExporter = new FDExportExcelDailyDataMonitoring(
                Server.MapPath("~/ExcelFiles"), 
                "DailyDataMonitoring", 
                GetMatchMonitoringReportInfo(criteria),
                GetMatchMonitoringHeaders(),
                dailyDataMonitoring);
            
            var saveAsFileName = excelExporter.GenerateExcelFile();
            ResponseStreamExcel(excelExporter.Workbook, saveAsFileName);

            return new EmptyResult();
        }

        public void ResponseStreamExcel(IWorkbook workbook, string fileName)
        {
            Response.Clear();
            Response.ContentType = "application/vnd.ms-excel";
            Response.AddHeader("Content-Disposition", string.Format("attachment; filename={0}.xls", fileName));
            workbook.Write(Response.OutputStream);
        }

        #region Export Excel

        public List<Legend> GetMatchMonitoringReportInfo(DailyDataMonitoringReportGetAllCriteria criteria)
        {
            return new List<Legend>
                {
                    new Legend("Event Date From", criteria.EventDateFrom.ToShortDateString()),
                    new Legend("Event Date To", criteria.EventDateTo.ToShortDateString())
                };
        }

        public List<string> GetMatchMonitoringHeaders()
        {
            var counter = 0;
            var headers = new List<string>();
            headers.Insert(counter++, "Match");
            headers.Insert(counter++, "Event Date");
            headers.Insert(counter++, "Category");
            headers.Insert(counter++, "Captured Time");
            headers.Insert(counter++, "Captured Data");
            headers.Insert(counter++, "Compared Time");
            headers.Insert(counter++, "Compared Data");

            return headers;
        }

        #endregion

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