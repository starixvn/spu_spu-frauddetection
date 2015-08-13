// --------------------------------------------------------------------------
// <copyright file="MatchMonitoringController.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015.08.13">Created</change>
// </history>

using System.Linq;
using FD.Lib.DTO;

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Web.Mvc;
    using FD.Lib.Criteria.Case;
    using FD.Lib.Criteria.Common;
    using FD.Lib.Criteria.Reports;
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
        private readonly int ALLSUSPICIOUSSTATUS = 0;
        private readonly int EXISTSUSPICIOUSCASE = 1;
        private readonly int NOTEXISTSUSPICIOUSCASE = 2;

        public MatchMonitoringController()
        {
            _matchMonitoringReportService = new MatchMonitoringReportService();
            _caseService = new CaseService();
        }

        /// <summary>
        /// Main page.
        /// </summary>
        /// <returns>The ActionResult.</returns>
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
        /// <param name="criteria">MatchMonitoringReportGetAllCriteria.</param>
        /// <returns>Match monitoring report data.</returns>
        [HttpGet]
        public ActionResult Search(MatchMonitoringReportGetAllCriteria criteria)
        {
            var matchesInfo = _matchMonitoringReportService.GetMatchMonitoringReport(criteria);
            matchesInfo = FilterDataOnSearch(matchesInfo, criteria.SuspiciousStatus);

            var result = new
            {
                MatchMonitoring = matchesInfo,
                criteria.NumberOfCases
            };

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        private List<MatchMonitoring> FilterDataOnSearch(List<MatchMonitoring> matches, int suspiciousStatus)
        {
            var resultData = new List<MatchMonitoring>();

            if (suspiciousStatus == ALLSUSPICIOUSSTATUS)
            {
                resultData = matches;
            }
            else
            {
                var existSuspiciousCase = new List<MatchMonitoring>();
                var notExistSuspiciousCase = new List<MatchMonitoring>();

                foreach (var match in matches)
                {
                    var existSus = false;
                    foreach (var dictItem in match.SuspiciousCases.Where(dictItem => dictItem.Value > 0))
                    {
                        existSus = true;
                    }

                    if (existSus)
                    {
                        existSuspiciousCase.Add(match);
                    }
                    else
                    {
                        notExistSuspiciousCase.Add(match);
                    }
                }

                resultData = suspiciousStatus == EXISTSUSPICIOUSCASE
                                       ? existSuspiciousCase
                                       : notExistSuspiciousCase;
            }

            MapRemotingRefData(resultData);
            return resultData;
        }

        private void MapRemotingRefData(List<MatchMonitoring> data)
        {
            var HomeName = string.Empty;
            var AwayName = string.Empty;

            foreach (var match in data)
            {
                HomeName = RefData.GetTeamName(match.HomeId.ToString(), "en", string.Empty);
                AwayName = RefData.GetTeamName(match.AwayId.ToString(), "en", string.Empty);

                match.Event = "<b>" + HomeName + "</b>" + " vs " + "<b>" + AwayName + "</b>";
            }
        }

        /// <summary>
        /// Get all leagues by event date.
        /// </summary>
        /// <returns>The SelectListItem.</returns>
        [HttpGet]
        public ActionResult GetLeaguesByDate(string eventDate)
        {
            var result = _matchMonitoringReportService.GetLeaguesByDate(new LeagueGetAllByDateCriteria
            {
                EventDate = DateTime.Parse(eventDate)
            });

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public int GetCaseIdFromName(string caseName)
        {
            var caseInfo = _caseService.GetCaseByName(new CaseGetByNameCriteria
            {
                CaseName = caseName
            });

            return caseInfo.CaseId;
        }
    }
}