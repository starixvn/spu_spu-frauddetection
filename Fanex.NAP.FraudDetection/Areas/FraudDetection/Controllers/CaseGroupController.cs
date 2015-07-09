namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;
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
            var caseGroups = new List<CaseGroup>
            {
                new CaseGroup
                {
                    CaseId = 1,
                    GroupId = 1,
                    GroupName = "Group 1",
                    GroupDescription = "GroupDescription 1"
                },

                new CaseGroup
                {
                    CaseId = 1,
                    GroupId = 2,
                    GroupName = "Group 2",
                    GroupDescription = "GroupDescription 2"
                },
                new CaseGroup
                {
                    CaseId = 1,
                    GroupId = 3,
                    GroupName = "Group 3",
                    GroupDescription = "GroupDescription 3"
                }
            };

            return Json(caseGroups, JsonRequestBehavior.AllowGet);
        }

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

            return View("~/Areas/FraudDetection/Views/CaseGroup/AddCustomerGroupToCase.cshtml");
        }

        public ActionResult RemoveCustomerGroupFromCase(CaseGroupDeleteCriteria criteria)
        {
            var result = _caseGroupService.RemoveCaseGroup(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }

    public class AddCustomerGroupToCaseViewModel
    {
        public int CaseId { get; set; }

        public IList<Group> Groups { get; set; }
    }
}