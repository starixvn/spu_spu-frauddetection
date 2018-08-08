namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using Fanex.Data.Repository;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.FraudDetection.Controllers;
    using Fanex.NAP.FraudDetection.Service;
    using Fanex.NAP.FraudDetection.Service.Core;
    using FD.Lib.Criteria.Bettype;
    using FD.Lib.Criteria.Case;
    using FD.Lib.Criteria.Common;
    using FD.Lib.Criteria.Reports.LiveMatchMonitoring;
    using FD.Lib.Criteria.SuspiciousStatistic;
    using FD.Lib.DTO;
    using FD.Lib.Service.Implement;
    using FD.Lib.Service.Interface;
    using RemotingRef;
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Globalization;
    using System.Linq;
    using System.Web.Mvc;

    public class LiveMatchMonitoringController : BaseController
    {
        private readonly ILiveMatchMonitoringReportService liveMatchMonitoringReportService;

        private readonly ICaseService caseService;

        private static readonly RemotingRefService refService = new RemotingRefService();

        public LiveMatchMonitoringController()
        {
            liveMatchMonitoringReportService = new LiveMatchMonitoringReportService();
            caseService = new CaseService();
        }

        [NapAuth(FunctionKey = FDFunctionKeys.LiveMatchMonitoring, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            LeagueGetAllByDateCriteria criteria = new LeagueGetAllByDateCriteria()
            {
                EventDate = DateTime.Now
            };

            ViewBag.Leagues = liveMatchMonitoringReportService.GetLeaguesByDate(criteria);
            return View("~/Areas/FraudDetection/Views/Reports/LiveMatchMonitoringReport.cshtml");
        }

        [HttpPost]
        [NapAuth(FunctionKey = FDFunctionKeys.LiveMatchMonitoring, Policy = Constant.Policy.Read)]
        public ActionResult Search(LiveMatchMonitoringReportGetAllCriteria criteria, int sportId)
        {
            criteria.IsTest = ConfigurationManager.AppSettings["IsLocalTest"].Equals("1");

            if (criteria.LeagueId == -1)
            {
                var listLeagues = GetLeagueListByDateAndSport(criteria.EventDate.ToString(), sportId);

                if (listLeagues != null && listLeagues.Count() > 0)
                {
                    criteria.LeagueIds = string.Join(",", listLeagues.Select(l => l.LeagueId));
                }
            }

            var matchesInfo = liveMatchMonitoringReportService.GetMatchMonitoringReport(criteria);
            MapRemotingRefData(matchesInfo);

            var result = new
            {
                MatchMonitoring = matchesInfo,
                criteria.NumberOfCases
            };

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.LiveMatchMonitoring, Policy = Constant.Policy.Read)]
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
            var result = liveMatchMonitoringReportService.GetLeaguesByDate(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.LiveMatchMonitoring, Policy = Constant.Policy.Read)]
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
            var result = liveMatchMonitoringReportService.GetLeaguesByDateAndSport(criteria);

            if (result.Count() > 0)
            {
                result = result.OrderBy(t => t.LeagueName);
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.LiveMatchMonitoring, Policy = Constant.Policy.Read)]
        public ActionResult GetSportsByDate(string eventDate)
        {
            var sports = new BettypeService().GetAllSBSports(new SportGetAllCriteria());

            return Json(sports, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.LiveMatchMonitoring, Policy = Constant.Policy.Read)]
        public int GetCaseIdFromName(string caseName)
        {
            var caseInfo = caseService.GetCaseByName(new CaseGetByNameCriteria
            {
                CaseName = caseName
            });

            return caseInfo.CaseId;
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.MatchMonitoring, Policy = Constant.Policy.Read)]
        public ActionResult UpdateVerification(int matchId, bool isActive)
        {
            var result = liveMatchMonitoringReportService.UpdateVerification(new LiveMatchMonitoringReportUpdateVerifiedCriteria
            {
                IsVerified = isActive,
                MatchId = matchId,
                VerifiedBy = AppSession.CurrentUser != null ? AppSession.CurrentUser.Username : string.Empty
            });

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        private static void MapRemotingRefData(List<LiveMatchMonitoring> data)
        {
            foreach (var match in data)
            {
                var homeName = refService.GetTeamName(match.HomeId.ToString(CultureInfo.InvariantCulture), "en", string.Empty);
                var awayName = refService.GetTeamName(match.AwayId.ToString(CultureInfo.InvariantCulture), "en", string.Empty);
                string displayEvent = "{0} (Code: {1}) </br><span class='league'>{2}</span>";
                string displayMatch = "<b>" + homeName + "</b>" + " vs " + "<b>" + awayName + "</b>";

                match.Event = string.Format(displayEvent, displayMatch, match.MatchCode, match.LeagueName);
            }
        }

        private IEnumerable<League> GetLeagueListByDateAndSport(string eventDate, int sportId)
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
            var result = liveMatchMonitoringReportService.GetLeaguesByDateAndSport(criteria);

            return result;
        }
    }
}