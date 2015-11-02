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
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using System.Web.Mvc;
    using Fanex.NAP.Core.Business;
    using FD.Lib.Core.ExportExcel;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.FraudDetection.Service.Core;
    using FD.Lib.Criteria.Group;
    using FD.Lib.Criteria.Reports;
    using FD.Lib.Criteria.SuspiciousStatistic;
    using FD.Lib.DTO;
    using FD.Lib.Service.Implement;
    using NAP.FraudDetection.Controllers;
    using NPOI.SS.UserModel;

    /// <summary>
    /// The controller of Customer Report.
    /// </summary>
    public class SuspiciousCustomerController : BaseController
    {
        private readonly GroupService _groupService;

        private readonly CustomerReportService _customerReportService;

        private readonly CustomerService _customerService;

        public SuspiciousCustomerController()
        {
            _groupService = new GroupService();

            _customerReportService = new CustomerReportService();

            _customerService = new CustomerService();
        }

        /// <summary>
        /// Main page.
        /// </summary>
        /// <returns>The ActionResult.</returns>
        [NapAuth(FunctionKey = FDFunctionKeys.SuspiciousCustomer, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            var groups = GetAllGroups();

            return View("~/Areas/FraudDetection/Views/Reports/SuspiciousCustomerReport.cshtml", groups);
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

            var result = new
            {
                suspiciousCustomers.SuspiciousCustomers,
                suspiciousCustomers.TotalItem
            };

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Export the suspicious customers report to Excel file.
        /// </summary>
        /// <param name="criteria">The criteria.</param>
        /// <param name="groupName">Selected group name.</param>
        /// <returns>A list of customers.</returns>
        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.SuspiciousCustomer, Policy = Constant.Policy.Read)]
        public ActionResult ExportExcel(SuspiciousCustomerReportGetAllCriteria criteria, string groupName)
        {
            criteria.PageSize = int.MaxValue;
            criteria.PageIndex = 1;
            var suspiciousCustomers = _customerReportService.GetAllSuspiciousCustomers(criteria);

            var excelExporter = new FDExportExcelSuspiciousCustomer(
                Server.MapPath("~/ExcelFiles"), 
                "CustomerReport",
                new List<Legend>
                {
                    new Legend("Event Date From", criteria.EventDateFrom.ToShortDateString()),
                    new Legend("Event Date To", criteria.EventDateTo.ToShortDateString()),
                    new Legend("Member", criteria.CustName),
                    new Legend("Group", groupName)
                },
                GetSuspiciousCustomerHeaders(),
                suspiciousCustomers.SuspiciousCustomers);

            var saveAsFileName = excelExporter.GenerateExcelFile();
            ResponseStreamExcel(excelExporter.Workbook, saveAsFileName);

            return new EmptyResult();
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
            headers.Insert(1, "Member");
            headers.Insert(2, "Group");
            headers.Insert(3, "Suspicious Time");

            return headers;
        }

        #endregion

        /// <summary>
        /// Get Suspicious Customer Statistic.
        /// </summary>
        /// <param name="custId">The customer ID.</param>
        /// <returns>The ActionResult.</returns>
        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.SuspiciousCustomer, Policy = Constant.Policy.Read)]
        public ActionResult GetSuspiciousCustomerStatistic(int custId)
        {
            var marginCriteria = new CustomerWinlostSelectCriteria
            {
                ListCustIDs = custId.ToString(CultureInfo.InvariantCulture)
            };

            var statistic = _customerService.GetMarginCustomerByCustId(marginCriteria);
            var result = GetThreeLatestMonthStatistic(statistic);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Get 3 latest months.
        /// </summary>
        /// <param name="margins">The margins statistic.</param>
        /// <returns>List of result.</returns>
        private static IEnumerable<dynamic> GetThreeLatestMonthStatistic(IEnumerable<RawMarginCustomer> margins)
        {
            var result = new List<dynamic>();
            var startMonth = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).AddMonths(-2);
            for (var i = 0; i < 3; i++)
            {
                var month = startMonth.AddMonths(i);
                var margin = margins.FirstOrDefault(m => m.WinlostDate == month);

                var customerWinloss = new
                {
                    Month = month.ToString("MMM-yyyy"),
                    Turnover = margin != null ? margin.Turnover : null,
                    MemberWinlost = margin != null ? margin.MemberWinlost : null,
                    Margin = margin != null ? margin.Margin : null
                };

                result.Add(customerWinloss);
            }

            return result;
        }

        /// <summary>
        /// Get all suspicious groups.
        /// </summary>
        /// <returns>The SelectListItem.</returns>
        private IEnumerable<SelectListItem> GetAllGroups()
        {
            var criteria = new GroupGetAllCriteria
            {
                PageCount = 0,
                PageIndex = 1,
                PageSize = int.MaxValue,
                RowCount = 0
            };

            var result = _groupService.GetAllGroups(criteria);
            var groups = result.Select(s => new SelectListItem
            {
                Text = s.GroupName,
                Value = s.GroupId.ToString(CultureInfo.InvariantCulture)
            });

            var all = new[] { new SelectListItem { Selected = true, Text = "All Groups", Value = "-1" } };

            groups = all.Concat(groups);

            return groups;
        }
    }
}