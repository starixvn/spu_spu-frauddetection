// --------------------------------------------------------------------------
// <copyright file="SuspiciousCustomerController.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Aaron.Cao" date="2015.06.23">Created</change>
// </history>

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using Core.Business;
    using Core.Web.Attribute;
    using FD.Lib.Core.ExportExcel;
    using FD.Lib.Criteria.Case;
    using FD.Lib.Criteria.Reports;
    using FD.Lib.Service.Implement;
    using NAP.FraudDetection.Controllers;
    using NPOI.SS.UserModel;
    using Service.Core;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;
    using System.Configuration;
    using Fanex.NAP.Core.Service.Impl;

    /// <summary>
    /// The controller of Customer Report.
    /// </summary>
    public class SuspiciousCustomerController : BaseController
    {
        private readonly CustomerReportService _customerReportService;

        public SuspiciousCustomerController()
        {
            _customerReportService = new CustomerReportService();
        }

        /// <summary>
        /// Main page.
        /// </summary>
        /// <returns>The ActionResult.</returns>
        [NapAuth(FunctionKey = FDFunctionKeys.SuspiciousCustomer, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            return View("~/Areas/FraudDetection/Views/Reports/SuspiciousCustomerReport.cshtml");
        }

        /// <summary>
        /// Query the suspicious customers.
        /// </summary>
        /// <param name="criteria">The criteria.</param>
        /// <returns>A list of customers.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = FDFunctionKeys.SuspiciousCustomer, Policy = Constant.Policy.Read)]
        public ActionResult Search(SuspiciousCustomerReportGetAllCriteria criteria)
        {
            var suspiciousCustomers = _customerReportService.GetAllSuspiciousCustomers(criteria);

            return Json(suspiciousCustomers, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Export the suspicious customers report to Excel file.
        /// </summary>
        /// <param name="criteria">The criteria.</param>
        /// <param name="caseName">Selected group name.</param>
        /// <returns>A list of customers.</returns>
        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.SuspiciousCustomer, Policy = Constant.Policy.Read)]
        public ActionResult ExportExcel(SuspiciousCustomerReportGetAllCriteria criteria, string caseName)
        {
            criteria.PageSize = int.MaxValue;
            var suspiciousCustomers = _customerReportService.GetAllSuspiciousCustomers(criteria);

            var excelExporter = new FDExportExcelSuspiciousCustomer(
                Server.MapPath("~/ExcelFiles"),
                "CustomerReport",
                new List<Legend>
                {
                    new Legend("From Date", criteria.EventDateFrom.ToShortDateString()),
                    new Legend("To Date", criteria.EventDateTo.ToShortDateString()),
                    new Legend("Member", criteria.CustName),
                    new Legend("Total Violations ≥", criteria.TotalViolations.ToString()),
                    new Legend("New Violations ≥", criteria.NewViolations.ToString()),
                    new Legend("Verification", criteria.IsVerified == null ? string.Empty : (criteria.IsVerified.Value ? "Yes" : "No")),
                    new Legend("Fraud Case", caseName)
                },
                GetSuspiciousCustomerHeaders(),
                suspiciousCustomers.SuspiciousCustomers);

            var saveAsFileName = excelExporter.GenerateExcelFile();
            ResponseStreamExcel(excelExporter.Workbook, saveAsFileName);

            return new EmptyResult();
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.SuspiciousCustomer, Policy = Constant.Policy.Read)]
        public ActionResult GetNotes(int custId)
        {
            var notes = _customerReportService.GetNotes(new SuspiciousCustomerReportGetNotesCriteria
            {
                CustId = custId
            });

            var users = GetAllUsers();

            foreach (var note in notes)
            {
                if (note.Author == null)
                {
                    note.Author = users.Where(t => t.Id == note.AuthorId).FirstOrDefault().Username;
                }
            }

            return Json(notes, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.SuspiciousCustomer, Policy = Constant.Policy.Read)]
        public ActionResult GetAllCases()
        {
            var caseService = new CaseService();
            var cases = caseService.GetCases(new CaseGetAllCriteria
            {
                PageSize = int.MaxValue,
                PageIndex = 1
            }).Cases.Where(c => !c.IsInternal);

            return Json(cases, JsonRequestBehavior.AllowGet);
        }

        #region Export Excel

        public void ResponseStreamExcel(IWorkbook workbook, string fileName)
        {
            Response.Clear();
            Response.ContentType = "application/vnd.ms-excel";
            Response.AddHeader("Content-Disposition", string.Format("attachment; filename={0}.xls", fileName));
            workbook.Write(Response.OutputStream);
        }

        public List<string> GetSuspiciousCustomerHeaders()
        {
            var headers = new List<string>();
            headers.Insert(0, "#");
            headers.Insert(1, "Delinquent");
            headers.Insert(2, "Verified");
            headers.Insert(3, "Member");
            headers.Insert(4, "Total Violations");
            headers.Insert(5, "New Violations");
            headers.Insert(6, "Violated Cases");
            headers.Insert(7, "Assignees");

            return headers;
        }

        #endregion

        private List<Core.Domain.IUser> GetAllUsers()
        {
            const string FunctionKey = FDFunctionKeys.SuspiciousCustomer;
            var siteId = int.Parse(ConfigurationManager.AppSettings["SiteId"]);
            var suspiciousCustomerFunction = new FunctionService().GetByKeyAndSite(FunctionKey, siteId);
            var users = new UserService().GetByFunctionAndSite(suspiciousCustomerFunction.Id, siteId);
            var result = new List<Core.Domain.IUser>();

            foreach (var user in users)
            {
                if (user.Policy != (decimal)Constant.Policy.Read && user.Policy != (decimal)Constant.Policy.Host)
                {
                    continue;
                }

                if (user.User.Group == null)
                {
                    result.Add(user.User);
                }
                else if (!user.User.Group.Name.Equals("IT"))
                {
                    result.Add(user.User);
                }
            }

            return result;
        }
    }
}