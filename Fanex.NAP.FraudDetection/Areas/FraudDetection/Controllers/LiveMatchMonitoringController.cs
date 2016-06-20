namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using Fanex.NAP.FraudDetection.Controllers;
    using FD.Lib.Criteria.Common;
    using FD.Lib.Service.Implement;
    using FD.Lib.Service.Interface;
    using System;
    using System.Web.Mvc;

    public class LiveMatchMonitoringController : BaseController
    {
        private readonly IMatchMonitoringReportService matchMonitoringReportService;

        public LiveMatchMonitoringController()
        {
            matchMonitoringReportService = new MatchMonitoringReportService();
        }

        public ActionResult Index()
        {
            ViewBag.Leagues = matchMonitoringReportService.GetLeaguesByDate(
                new LeagueGetAllByDateCriteria
                {
                    EventDate = DateTime.Now
                });

            return View("~/Areas/FraudDetection/Views/Reports/LiveMatchMonitoringReport.cshtml");
        }
    }
}