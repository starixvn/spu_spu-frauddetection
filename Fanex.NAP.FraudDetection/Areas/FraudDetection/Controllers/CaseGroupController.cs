namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;
    using Models;
    using NAP.FraudDetection.Controllers;
    using SPU.Lib.FraudDetection.Criteria.CaseGroup;
    using SPU.Lib.FraudDetection.Criteria.Group;
    using SPU.Lib.FraudDetection.DTO;
    using SPU.Lib.FraudDetection.Service.Implement;
    using SPU.Lib.FraudDetection.Service.Interface;

    /// <summary>
    /// The CaseController.
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

        public ActionResult GetCustomerGroupsInCase(CaseGroupSelectCriteria criteria)
        {
            var caseGroups = _caseGroupService.SelectCaseGroup(criteria);

            return Json(caseGroups, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult AddCustomerGroupToCase(int caseId)
        {
            var model = new AddCustomerGroupToCaseViewModel()
            {
                CaseId = caseId,
                Groups = _groupService.GetAllGroups(new GroupSelectAllCriteria()
                {
                    PageIndex = 1,
                    PageSize = 30
                }).ToList()
            };

            return View("~/Areas/FraudDetection/Views/CaseGroup/AddCustomerGroupToCase.cshtml", model);
        }

        [HttpPost]
        public ActionResult AddCustomerGroupToCase(CaseGroupInsertCriteria criteria)
        {
            var commandResult = _caseGroupService.InsertCaseGroup(criteria);

            return Json(commandResult, JsonRequestBehavior.DenyGet);
        }

        public ActionResult RemoveCustomerGroupFromCase(CaseGroupDeleteCriteria criteria)
        {
            var result = _caseGroupService.RemoveCaseGroup(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}