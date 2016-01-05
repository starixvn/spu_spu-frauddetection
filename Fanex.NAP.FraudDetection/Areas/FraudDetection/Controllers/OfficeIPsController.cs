// --------------------------------------------------------------------------
// <copyright file="OfficeIPsController.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Aaron.Cao" date="2016.01.05">Created</change>
// </history>

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using System;
    using System.Web.Mvc;
    using Core.Business;
    using Core.Web.Attribute;
    using FD.Lib.Service.Implement;
    using NAP.FraudDetection.Controllers;
    using Service.Core;

    public class OfficeIPsController : BaseController
    {
        private readonly OfficeIPsReportService _officeIPsReportService;

        public OfficeIPsController()
        {
            _officeIPsReportService = new OfficeIPsReportService();
        }

        [NapAuth(FunctionKey = FDFunctionKeys.OfficeIPs, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            return View("~/Areas/FraudDetection/Views/Reports/OfficeIpReport.cshtml");
        }

        [NapAuth(FunctionKey = FDFunctionKeys.OfficeIPs, Policy = Constant.Policy.Read)]
        public ActionResult GetSuspiciousTickets(DateTime fromDate, DateTime toDate)
        {
            //// HARD-CODE: The Scan Office IPs CaseId = 2!
            const int caseId = 2;
            var tickets = _officeIPsReportService.GetFraudTickets(caseId, fromDate, toDate);

            return Json(tickets, JsonRequestBehavior.AllowGet);
        }
    }
}