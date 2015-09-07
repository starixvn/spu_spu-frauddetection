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
    using FD.Lib.Criteria.Group;
    using FD.Lib.Criteria.Reports;
    using FD.Lib.Criteria.SuspiciousStatistic;
    using FD.Lib.DTO;
    using FD.Lib.Service.Implement;
    using NAP.FraudDetection.Controllers;

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
        /// Get Suspicious Customer Statistic.
        /// </summary>
        /// <param name="custId">The customer ID.</param>
        /// <returns>The ActionResult.</returns>
        [HttpGet]
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