// --------------------------------------------------------------------------
// <copyright file="FraudCaseDetailController.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015.04.05">Created</change>
//   <change who="Long.Luu" date="2015.07.24">Refactored</change>
// </history>

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.FraudDetection.Service.Core;
    using FD.Lib.Core.ExportExcel;
    using FD.Lib.Criteria.Reports;
    using FD.Lib.Model.Reports.FraudCaseDetail;
    using FD.Lib.Service.Implement;
    using FD.Lib.Service.Interface;
    using NAP.FraudDetection.Controllers;
    using NPOI.SS.UserModel;
    using System.Collections.Generic;
    using System.Web.Mvc;

    /// <summary>
    /// The Case Group Controller.
    /// </summary>
    public class FraudCaseDetailController : BaseController
    {
        private readonly IFraudCaseDetailReportService service;
        private readonly ICustomerDetailsReportService customerDetailsReportService;

        public FraudCaseDetailController()
        {
            service = new FraudCaseDetailReportService();
            customerDetailsReportService = new CustomerDetailsReportService();
        }

        public FraudCaseDetailController(IFraudCaseDetailReportService service, ICustomerDetailsReportService customerDetailsReportService)
        {
            this.service = service;
            this.customerDetailsReportService = customerDetailsReportService;
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Read)]
        public ActionResult Index(FraudCaseDetailReportCriteria criteria)
        {
            var model = service.GetFraudCaseDetails(criteria);

            return View("~/Areas/FraudDetection/Views/Reports/FraudCaseDetailList.cshtml", model);
        }

        public JsonResult GetAllTicketsByIp(string ip)
        {
            var result = customerDetailsReportService.GetFraudTicketsByIp("10.10.10.10");

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult ExportExcel(FraudCaseDetailReportCriteria criteria)
        {
            var model = service.GetFraudCaseDetails(criteria, true);

            var excelExporter = new FDExportExcelFraudCaseDetails(
                Server.MapPath("~/ExcelFiles"),
                "FraudCaseDetails",
                GetMatchMonitoringReportInfo(model.Summary),
                GetMatchMonitoringHeaders(),
                model.Body[0].FraudCaseDetailList);

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

        public List<Legend> GetMatchMonitoringReportInfo(FraudCaseDetailSummary reportInfo)
        {
            return new List<Legend>
                {
                    new Legend("Case Name", reportInfo.CaseName),
                    new Legend("Event", reportInfo.HomeName + " -vs- " + reportInfo.AwayName),
                    new Legend("# Members", reportInfo.CustomerCount.ToString()),
                    new Legend("# Tickets", reportInfo.BetCount.ToString())
                };
        }

        public List<string> GetMatchMonitoringHeaders()
        {
            var columnCount = 0;
            var headers = new List<string>();
            headers.Insert(columnCount++, "#");
            headers.Insert(columnCount++, "Members");
            headers.Insert(columnCount++, "Trans Date");
            headers.Insert(columnCount++, "Bet ID");
            headers.Insert(columnCount++, "Bet Type");
            headers.Insert(columnCount++, "Choice");
            headers.Insert(columnCount++, "Score");
            headers.Insert(columnCount++, "Odds");
            headers.Insert(columnCount++, "Stake");
            headers.Insert(columnCount++, "Win Loss");
            headers.Insert(columnCount++, "Status");
            headers.Insert(columnCount++, "IP");

            return headers;
        }
    }
}