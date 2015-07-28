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
    using NAP.FraudDetection.Controllers;
    using SPU.Lib.FraudDetection.Service.Implement;
    using SPU.Lib.FraudDetection.Criteria.CustomerBettingGroup;

    /// <summary>
    /// The CustomerBettingGroupController.
    /// </summary>
    public class CustomerBettingGroupController : BaseController
    {
        private readonly CustomerBettingGroupService _customerBettingGroupService;

        public CustomerBettingGroupController()
        {
            _customerBettingGroupService = new CustomerBettingGroupService();
        }

        public ActionResult Index()
        {
            return View("~/Areas/FraudDetection/Views/CustomerBettingGroup/CustomerBettingGroupIndex.cshtml");
        }

        /// <summary>
        /// Add New Betting Group.
        /// </summary>
        /// <returns>HTML string.</returns>
        [HttpGet]
        public string AddBettingGroup()
        {
            return RenderViewToString(
                ControllerContext,
                "~/Areas/FraudDetection/Views/CustomerBettingGroup/CustomerBettingGroupAdd.cshtml", 
                new CustomerBettingGroupInsertCriteria());
        }

        /// <summary>
        /// Add New Betting Group.
        /// </summary>
        /// <param name="criteria">The criteria.</param>
        /// <returns>The ActionResult.</returns>
        [HttpPost]
        public ActionResult AddBettingGroup(CustomerBettingGroupInsertCriteria criteria)
        {
            if (string.IsNullOrEmpty(criteria.Name))
            {
                return new JsonResult { Data = new { IsSuccessful = false, Message = "A Group should has a name!" } };
            }

            criteria.CreatorId = 1;
            var result = _customerBettingGroupService.InsertGroup(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Edit Betting Group Info.
        /// </summary>
        /// <param name="groupId">The group ID.</param>
        /// <returns>A template view.</returns>
        [HttpGet]
        public string EditBettingGroupInfo(int? groupId)
        {
            var criteria = new CustomerBettingGroupGetByIdCriteria
            {
                GroupId = groupId == null ? 0 : (int)groupId
            };

            var groupInfo = _customerBettingGroupService.GetGroupById(criteria);
            var model = new CustomerBettingGroupUpdateCriteria
            {
                CreatorId = 1,
                GroupId = groupInfo.GroupId,
                Name = groupInfo.Name,
                Description = groupInfo.Description
            };

            return RenderViewToString(ControllerContext, "~/Areas/FraudDetection/Views/CustomerBettingGroup/CustomerBettingGroupEdit.cshtml", model);
        }

        /// <summary>
        /// Edit Betting Group Info.
        /// </summary>
        /// <param name="criteria">Group Update Criteria.</param>
        /// <returns>Action Result.</returns>
        [HttpPost]
        public ActionResult EditBettingGroupInfo(CustomerBettingGroupUpdateCriteria criteria)
        {
            criteria.CreatorId = 1;
            var result = _customerBettingGroupService.UpdateGroup(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
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
        public string EditCustomers(int groupId)
        {
            var model = new CustomerBettingGroupInsertCustomerCriteria { GroupId = groupId };

            return RenderViewToString(
                ControllerContext, 
                "~/Areas/FraudDetection/Views/CustomerBettingGroup/CustomerBettingGroupEditCustomer.cshtml", 
                model);
        }

        [HttpPost]
        public ActionResult EditCustomers(CustomerBettingGroupInsertCustomerCriteria criteria)
        {
            if (string.IsNullOrEmpty(criteria.CustName))
            {
                return new JsonResult { Data = new { IsSuccessful = false, Message = "Customer should have a name!" } };
            }

            var customer = _customerBettingGroupService.GetCustomerByName(
                new CustomerBettingGroupGetCustomerByNameCriteria
                    {
                        CustName = criteria.CustName
                    });
            if (customer != null)
            {
                criteria.CreatorId = 1;
                criteria.CurrencyId = customer.Currency.CurrencyId;
                criteria.CurrencyName = customer.Currency.CurrencyName;
                criteria.CustId = customer.CustId;
                criteria.CustName = customer.CustName;
                var result = _customerBettingGroupService.InsertCustomer(criteria);

                return Json(result, JsonRequestBehavior.AllowGet);
            }

            return new JsonResult { Data = new { IsSuccessful = false, Message = "This customer doesn't exist!" } };
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
    }
}
