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
    using Core.Business;
    using Core.Web.Attribute;
    using Data.Repository;
    using FD.Lib.Core.ExportExcel;
    using FD.Lib.Criteria.Bettype;
    using FD.Lib.Criteria.Case;
    using FD.Lib.Criteria.Common;
    using FD.Lib.Criteria.Reports;
    using FD.Lib.Criteria.SuspiciousStatistic;
    using FD.Lib.DTO;
    using FD.Lib.Service.Implement;
    using NAP.FraudDetection.Controllers;
    using NPOI.SS.UserModel;
    using RemotingRef;
    using Service;
    using Service.Core;
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using System.Web.Mvc;

    public class MatchMonitoringController : BaseController
    {
        private readonly MatchMonitoringReportService _matchMonitoringReportService;
        private readonly CaseService _caseService;

        public MatchMonitoringController()
        {
            _matchMonitoringReportService = new MatchMonitoringReportService();
            _caseService = new CaseService();
        }

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

        [HttpPost]
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

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.MatchMonitoring, Policy = Constant.Policy.Read)]
        public ActionResult ExportExcel(MatchMonitoringReportGetAllCriteria criteria)
        {
            var matchesInfo = GenerateMatchMonitoringData(criteria);
            MapRemotingRefData(matchesInfo, true);
            var headers = GetMatchMonitoringHeaders(matchesInfo);

            var excelExporter = new FDExportExcelMatchMonitoring(
                Server.MapPath("~/ExcelFiles"),
                "MatchMonitoring",
                GetMatchMonitoringReportInfo(criteria),
                headers,
                matchesInfo);

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

        public List<Legend> GetMatchMonitoringReportInfo(MatchMonitoringReportGetAllCriteria criteria)
        {
            return new List<Legend>
                {
                    new Legend("Event Date", criteria.EventDate.ToShortDateString()),
                    new Legend("League", criteria.LeagueId == -1 ? "All Leagues" : RefData.GetLeagueName(criteria.LeagueId.ToString(CultureInfo.InvariantCulture), "en", "All Leagues")),
                    new Legend("Match Code", criteria.MatchCode),
                    new Legend("Match Status", criteria.MatchStatus),
                    new Legend("Has Suspicious Customer(s)", criteria.SuspiciousStatus == 0 ? "All" : (criteria.SuspiciousStatus == 1 ? "Yes" : "No"))
                };
        }

        public List<string> GetMatchMonitoringHeaders(List<MatchMonitoring> data)
        {
            var headers = new List<string>();
            headers.Insert(0, "#");
            headers.Insert(1, "Delinquent");
            headers.Insert(2, "Verified");
            headers.Insert(3, "League");
            headers.Insert(4, "Last Verified By");
            headers.Insert(5, "Match Code");
            headers.Insert(6, "Event");
            headers.Insert(7, "Status");

            if (data.Any())
            {
                var columnCount = 8;
                foreach (var record in data[0].SuspiciousCases)
                {
                    headers.Insert(columnCount, record.Key);
                    columnCount++;
                }
            }

            return headers;
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.MatchMonitoring, Policy = Constant.Policy.Read)]
        public ActionResult GetLeaguesByDateAndSport(string eventDate, int sportId)
        {
            var balanceUpMoveBetService = new MoveBetsBalanceUpService();
            var balanceUpMoveBetDates = balanceUpMoveBetService.GetBalanceUpDay(new BalanceUpDaySelectCriteria());

            var criteria = DateTime.Parse(eventDate) > balanceUpMoveBetDates.BalanceUpDay
                               ? (ICriteria)new LeagueGetAllByDateAndSportCriteria
                               {
                                   IsLatestData = DateTime.Parse(eventDate) > balanceUpMoveBetDates.MoveBetsDay,
                                   EventDate = DateTime.Parse(eventDate),
                                   SportId = sportId
                               }
                               : new LeagueGetAllByDateAndSportFromDBArchiveCriteria
                               {
                                   EventDate = DateTime.Parse(eventDate),
                                   SportId = sportId
                               };
            var result = _matchMonitoringReportService.GetLeaguesByDateAndSport(criteria);

            if (result.Count() > 0)
            {
                result = result.OrderBy(t => t.LeagueName);
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

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
        public ActionResult GetSportsByDate(string eventDate)
        {
            var sports = new BettypeService().GetAllSBSports(new SportGetAllCriteria());

            return Json(sports, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.MatchMonitoring, Policy = Constant.Policy.Read)]
        public ActionResult UpdateDelinquency(int matchId, bool isActive)
        {
            var result = _matchMonitoringReportService.UpdateDelinquency(new MatchMonitoringReportUpdateDelinquentCriteria
            {
                IsDelinquent = isActive,
                MatchId = matchId
            });

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.MatchMonitoring, Policy = Constant.Policy.Read)]
        public ActionResult UpdateVerification(int matchId, bool isActive)
        {
            var result = _matchMonitoringReportService.UpdateVerification(new MatchMonitoringReportUpdateVerifiedCriteria
            {
                IsVerified = isActive,
                MatchId = matchId,
                VerifiedBy = AppSession.CurrentUser != null ? AppSession.CurrentUser.Username : string.Empty
            });

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
                var homeName = RefData.GetTeamName(match.HomeId.ToString(CultureInfo.InvariantCulture), "en", string.Empty);
                var awayName = RefData.GetTeamName(match.AwayId.ToString(CultureInfo.InvariantCulture), "en", string.Empty);

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