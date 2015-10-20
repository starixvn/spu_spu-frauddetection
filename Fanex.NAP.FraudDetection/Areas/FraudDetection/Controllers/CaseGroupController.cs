// --------------------------------------------------------------------------
// <copyright file="CaseGroupController.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015.04.05">Created</change>
//   <change who="Long.Luu" date="2015.07.24">Refactored</change>
// </history>

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using System.Linq;
    using System.Web.Mvc;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.FraudDetection.Service.Core;
    using FD.Lib.Criteria.CaseGroup;
    using FD.Lib.Criteria.Group;
    using FD.Lib.Service.Implement;
    using FD.Lib.Service.Interface;
    using NAP.FraudDetection.Controllers;

    /// <summary>
    /// The Case Group Controller.
    /// </summary>
    public class CaseGroupController : BaseController
    {
        private readonly ICaseGroupService _caseGroupService;

        private readonly IGroupService _groupService;

        public CaseGroupController()
        {
            _caseGroupService = new CaseGroupService();
            _groupService = new GroupService();
        }

        public CaseGroupController(ICaseGroupService caseGroupService, IGroupService groupService)
        {
            _caseGroupService = caseGroupService;
            _groupService = groupService;
        }

        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Read)]
        public ActionResult GetCustomerGroupsInCase(CaseGroupGetAllCriteria criteria)
        {
            var caseGroups = _caseGroupService.GetCaseGroup(criteria);

            return Json(caseGroups, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Host)]
        public ActionResult AddCustomerGroupToCase(int caseId)
        {
            ViewBag.CaseId = caseId;

            return View("~/Areas/FraudDetection/Views/CaseGroup/CaseGroupAdd.cshtml");
        }

        [HttpPost]
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Host)]
        public ActionResult GetAvailableCustomerGroups(int caseId)
        {
            var groups = _groupService.GetAvailableGroupsForCase(new GroupGetAvailableGroupsForCaseCriteria
            {
                CaseId = caseId,
                PageIndex = 1,
                PageSize = 30
            }).ToList();

            return Json(groups, JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Host)]
        public ActionResult AddCustomerGroupToCase(CaseGroupInsertCriteria criteria)
        {
            var commandResult = _caseGroupService.InsertCaseGroup(criteria);

            return Json(commandResult, JsonRequestBehavior.DenyGet);
        }

        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Host)]
        public ActionResult RemoveCustomerGroupFromCase(CaseGroupDeleteCriteria criteria)
        {
            var commandResult = _caseGroupService.DeleteCaseGroup(criteria);

            return Json(commandResult, JsonRequestBehavior.AllowGet);
        }
    }
}