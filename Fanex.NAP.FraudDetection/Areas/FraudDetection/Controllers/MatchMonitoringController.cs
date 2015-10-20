// --------------------------------------------------------------------------
// <copyright file="MatchMonitoringController.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015.08.13">Created</change>
// </history>

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;
    using Data.Repository;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.FraudDetection.Service.Core;
    using FD.Lib.Core.ExportExcel;
    using FD.Lib.Criteria.Case;
    using FD.Lib.Criteria.Common;
    using FD.Lib.Criteria.Reports;
    using FD.Lib.Criteria.SuspiciousStatistic;
    using FD.Lib.DTO;
    using FD.Lib.Service.Implement;
    using NAP.FraudDetection.Controllers;
    using RemotingRef;

    /// <summary>
    /// The controller of Customer Report.
    /// </summary>
    public class MatchMonitoringController : BaseController
    {
        private readonly MatchMonitoringReportService _matchMonitoringReportService;
        private readonly CaseService _caseService;

        public MatchMonitoringController()
        {
            _matchMonitoringReportService = new MatchMonitoringReportService();
            _caseService = new CaseService();
        }

        /// <summary>
        /// Main page.
        /// </summary>
        /// <returns>The ActionResult.</returns>
        [NapAuth(FunctionKey = FDFunctionKeys.MatchMonitoring, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            ViewBag.Leagues = _matchMonitoringReportService.GetLeaguesByDate(
                new LeagueGetAllByDateCriteria
                {
                    EventDate = DateTime.Now
                });

            return View("~/Areas/FraudDetection/Views/Reports/MatchMonitoringReport.cshtml");
        }

        /// <summary>
        /// Get Match Monitoring report data.
        /// </summary>
        /// <param name="criteria">Match Monitoring Report Get All Criteria.</param>
        /// <returns>Match monitoring report data.</returns>
        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.MatchMonitoring, Policy = Constant.Policy.Read)]
        public ActionResult Search(MatchMonitoringReportGetAllCriteria criteria)
        {
            var matchesInfo = GenerateMatchMonitoringData(criteria);
            MapRemotingRefData(matchesInfo);

            var result = new
            {
                MatchMonitoring = matchesInfo,
                criteria.NumberOfCases
            };

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Export Match Monitoring report to Excel file.
        /// </summary>
        /// <param name="criteria">Match Monitoring Report Get All Criteria.</param>
        /// <returns>Match monitoring report data.</returns>
        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.MatchMonitoring, Policy = Constant.Policy.Read)]
        public ActionResult ExportExcel(MatchMonitoringReportGetAllCriteria criteria)
        {
            var fileName = DoExportExcel(criteria);

            var result = new
            {
                Msg = fileName
            };

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public string DoExportExcel(MatchMonitoringReportGetAllCriteria criteria)
        {
            var matchesInfo = GenerateMatchMonitoringData(criteria);
            MapRemotingRefData(matchesInfo, true);
            var headers = GetMatchMonitoringHeaders(matchesInfo);

            var excelExporter = new FDExportExcelMatchMonitoring(
                string.Empty,
                "Match Monitoring",
                GetMatchMonitoringReportInfo(criteria),
                headers,
                matchesInfo);

            return excelExporter.ExportFile();
        }

        public List<Legend> GetMatchMonitoringReportInfo(MatchMonitoringReportGetAllCriteria criteria)
        {
            return new List<Legend>
                {
                    new Legend("Event Date", criteria.EventDate.ToShortDateString()),
                    new Legend("League", criteria.LeagueId == -1 ? "All Leagues" : RefData.GetLeagueName(criteria.LeagueId.ToString(), "en", "All Leagues")),
                    new Legend("Match Code", criteria.MatchCode),
                    new Legend("Match Status", criteria.MatchStatus),
                    new Legend("Has Suspicious Customer(s)", criteria.SuspiciousStatus == 0 ? "All" : (criteria.SuspiciousStatus == 1 ? "Yes" : "No"))
                };
        }

        public List<string> GetMatchMonitoringHeaders(List<MatchMonitoring> data)
        {
            var headers = new List<string>();
            headers.Insert(0, "#");
            headers.Insert(1, "League");
            headers.Insert(2, "Match Code");
            headers.Insert(3, "Event");
            headers.Insert(4, "Status");

            if (data.Any())
            {
                var columnCount = 5;
                foreach (var record in data[0].SuspiciousCases)
                {
                    headers.Insert(columnCount, record.Key);
                    columnCount++;
                }
            }

            return headers;
        }

        /// <summary>
        /// Get all leagues by event date.
        /// </summary>
        /// <param name="eventDate">Event Date.</param>
        /// <returns>The SelectListItem.</returns>
        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.MatchMonitoring, Policy = Constant.Policy.Read)]
        public ActionResult GetLeaguesByDate(string eventDate)
        {
            var balanceUpMoveBetService = new MoveBetsBalanceUpService();
            var balanceUpMoveBetDates = balanceUpMoveBetService.GetBalanceUpDay(new BalanceUpDaySelectCriteria());

            var criteria = DateTime.Parse(eventDate) > balanceUpMoveBetDates.BalanceUpDay
                               ? (ICriteria)new LeagueGetAllByDateCriteria
                                   {
                                       IsLatestData = DateTime.Parse(eventDate) > balanceUpMoveBetDates.MoveBetsDay,
                                       EventDate = DateTime.Parse(eventDate)
                                   }
                               : new LeagueGetAllByDateFromDBArchiveCriteria
                                   {
                                       EventDate = DateTime.Parse(eventDate)
                                   };
            var result = _matchMonitoringReportService.GetLeaguesByDate(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.MatchMonitoring, Policy = Constant.Policy.Read)]
        public int GetCaseIdFromName(string caseName)
        {
            var caseInfo = _caseService.GetCaseByName(new CaseGetByNameCriteria
            {
                CaseName = caseName
            });

            return caseInfo.CaseId;
        }

        private static void MapRemotingRefData(List<MatchMonitoring> data, bool plainText = false)
        {
            foreach (var match in data)
            {
                var homeName = RefData.GetTeamName(match.HomeId.ToString(), "en", string.Empty);
                var awayName = RefData.GetTeamName(match.AwayId.ToString(), "en", string.Empty);

                match.Event = plainText
                    ? homeName + " vs " + awayName
                    : "<b>" + homeName + "</b>" + " vs " + "<b>" + awayName + "</b>";
            }
        }

        private List<MatchMonitoring> GenerateMatchMonitoringData(MatchMonitoringReportGetAllCriteria criteria)
        {
            var balanceUpMoveBetService = new MoveBetsBalanceUpService();
            var balanceUpMoveBetDates = balanceUpMoveBetService.GetBalanceUpDay(new BalanceUpDaySelectCriteria());
            criteria.IsLatestData = criteria.EventDate > balanceUpMoveBetDates.MoveBetsDay;

            return criteria.EventDate > balanceUpMoveBetDates.BalanceUpDay
                       ? _matchMonitoringReportService.GetMatchMonitoringReport(criteria)
                       : _matchMonitoringReportService.GetMatchMonitoringReportFromDBArchive(
                           new MatchMonitoringReportGetAllDBArchiveCriteria(criteria));
        }
    }
}