// --------------------------------------------------------------------------
// <copyright file="SuspiciousCustomerController.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Aarom.Cao" date="2015.06.23">Created</change>
// </history>

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using System.Web.Mvc;
    using NAP.FraudDetection.Controllers;
    using SPU.Lib.FraudDetection.Criteria.Group;
    using SPU.Lib.FraudDetection.Criteria.Reports;
    using SPU.Lib.FraudDetection.Service.Implement;

    /// <summary>
    /// The controller of Customer Report.
    /// </summary>
    public class SuspiciousCustomerController : BaseController
    {
        private readonly GroupService _groupService;

        private readonly CustomerReportService _customerReportService;

        public SuspiciousCustomerController()
        {
            _groupService = new GroupService();

            _customerReportService = new CustomerReportService();
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
        /// <param name="memberName">The customer name.</param>
        /// <param name="groupId">The Group ID.</param>
        /// <returns>A list of customers.</returns>
        [HttpGet]
        public ActionResult Search(string memberName, int groupId)
        {
            var criteria = new SuspiciousCustomerReportGetAllCriteria
            {
                CustName = memberName,
                GroupId = groupId
            };

            var suspiciousCustomers = _customerReportService.GetAllSuspiciousCustomerReport(criteria);

            var result = new
            {
                SuspiciousCustomers = suspiciousCustomers,
                Months = GetThreeLatestMonths()
            };

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Get all suspicious groups.
        /// </summary>
        /// <returns>The SelectListItem.</returns>
        private IEnumerable<SelectListItem> GetAllGroups()
        {
            var criteria = new GroupSelectAllCriteria
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

        /// <summary>
        /// Get 3 latest months.
        /// </summary>
        /// <returns>List of months.</returns>
        private IEnumerable<string> GetThreeLatestMonths()
        {
            var result = new List<string>();
            var startMonth = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).AddMonths(-2);
            for (var i = 0; i < 3; i++)
            {
                var month = startMonth.AddMonths(i);

                result.Add(month.ToString("MMM-yyyy"));
            }

            return result;
        }
    }
}