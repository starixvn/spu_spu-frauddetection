// --------------------------------------------------------------------------
// <copyright file="CustomerBettingGroupController.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Aaron.Cao" date="2015.07.08">Created</change>
//   <change who="Long.Luu" date="2015.07.24">Refactored</change>
// </history>

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using System.Web.Mvc;
    using FD.Lib.Criteria.CustomerBettingGroup;
    using FD.Lib.Criteria.Reports;
    using FD.Lib.Service.Implement;
    using FD.Lib.Service.Interface;
    using NAP.FraudDetection.Controllers;

    /// <summary>
    /// The CustomerBettingGroupController.
    /// </summary>
    public class CustomerBettingGroupController : BaseController
    {
        private readonly ICustomerBettingGroupService _customerBettingGroupService;
        private readonly IBettingGroupReportService _bettingGroupReportService;

        public CustomerBettingGroupController()
        {
            _customerBettingGroupService = new CustomerBettingGroupService();
            _bettingGroupReportService = new BettingGroupReportService();
        }

        public ActionResult Index()
        {
            return View("~/Areas/FraudDetection/Views/CustomerBettingGroup/CustomerBettingGroupList.cshtml");
        }

        [HttpGet]
        public ActionResult GetAllBettingGroups()
        {
            var criteria = new CustomerBettingGroupGetAllCriteria();
            var groups = _customerBettingGroupService.GetGroups(criteria);

            return Json(groups, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Delete a betting group.
        /// </summary>
        /// <param name="groupId">The group ID.</param>
        /// <returns>The ActionResult.</returns>
        [HttpGet]
        public ActionResult DeleteBettingGroup(int groupId)
        {
            var criteria = new CustomerBettingGroupDeleteCriteria
            {
                CreatorId = 1,
                GroupId = groupId
            };

            var result = _customerBettingGroupService.DeleteGroup(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Delete a customer.
        /// </summary>
        /// <param name="custId">The customer ID.</param>
        /// <param name="groupId">The group ID.</param>
        /// <returns>The ActionResult.</returns>
        [HttpPost]
        public ActionResult DeleteCustomer(int custId, int groupId)
        {
            var criteria = new CustomerBettingGroupDeleteCustomerCriteria
            {
                CreatorId = 1,
                GroupId = groupId,
                CustId = custId
            };

            var result = _customerBettingGroupService.DeleteCustomer(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetGroupById(int groupId)
        {
            var criteria = new CustomerBettingGroupGetByIdCriteria
            {
                GroupId = groupId
            };
            var group = _customerBettingGroupService.GetGroupById(criteria);

            return Json(group, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetAssociationCustomers(AssociationCustomersGetCriteria criteria)
        {
            var group = _bettingGroupReportService.GetAssociationCustomers(criteria);

            return View("~/Areas/FraudDetection/Views/CustomerBettingGroup/GetAssociationCustomer.cshtml", group);
        }
    }
}