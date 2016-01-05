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
    using System.Collections.Generic;
    using System.Web.Mvc;
    using Core.Business;
    using Core.Web.Attribute;
    using FD.Lib.Core.ExportExcel;
    using FD.Lib.Service.Implement;
    using NAP.FraudDetection.Controllers;
    using NPOI.SS.UserModel;
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

        [NapAuth(FunctionKey = FDFunctionKeys.OfficeIPs, Policy = Constant.Policy.Read)]
        public ActionResult ExportExcel(DateTime fromDate, DateTime toDate)
        {
            const int caseId = 2;
            var tickets = _officeIPsReportService.ExportExcel(caseId, fromDate, toDate);

            var excelExporter = new FDExportExcelOfficeIPs(
                Server.MapPath("~/ExcelFiles"),
                "OfficeIPs",
                GetMatchMonitoringReportInfo(fromDate, toDate),
                GetMatchMonitoringHeaders(),
                tickets);

            var saveAsFileName = excelExporter.GenerateExcelFile();
            ResponseStreamExcel(excelExporter.Workbook, saveAsFileName);

            return new EmptyResult();
        }

        public void ResponseStreamExcel(IWorkbook workbook, string fileName)
        {
            Response.Clear();
            Response.ContentType = "application/vnd.ms-excel";
            Response.AddHeader("Content-Disposition", string.Format("attachment; filename={0}", fileName));
            workbook.Write(Response.OutputStream);
        }

        private IEnumerable<Legend> GetMatchMonitoringReportInfo(DateTime fromDate, DateTime toDate)
        {
            return new List<Legend>
            {
                new Legend("Event Date", fromDate.ToString("yyyy/MM/dd") + " ~ " + toDate.ToString("yyyy/MM/dd"))
            };
        }

        private IEnumerable<string> GetMatchMonitoringHeaders()
        {
            var columnCount = 0;
            var headers = new List<string>();
            headers.Insert(columnCount++, "#");
            headers.Insert(columnCount++, "Member");
            headers.Insert(columnCount++, "Trans Date");
            headers.Insert(columnCount++, "Bet ID");
            headers.Insert(columnCount++, "Bet Type");
            headers.Insert(columnCount++, "Choice");
            headers.Insert(columnCount++, "Score");
            headers.Insert(columnCount++, "Odds");
            headers.Insert(columnCount++, "Stake");
            headers.Insert(columnCount++, "Win Loss");
            headers.Insert(columnCount++, "Status");
            headers.Insert(columnCount, "IP");

            return headers;
        }
    }
}