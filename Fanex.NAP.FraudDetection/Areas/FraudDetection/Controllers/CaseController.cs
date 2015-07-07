// --------------------------------------------------------------------------
// <copyright file="CaseController.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Aarom.Cao" date="2015.06.09">Created</change>
// </history>

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using System.Web.Mvc;
    using NAP.FraudDetection.Controllers;
    using SPU.Lib.Core;
    using SPU.Lib.FraudDetection.Criteria.Case;
    using SPU.Lib.FraudDetection.Criteria.Task;
    using SPU.Lib.FraudDetection.QueueManagement.SendingTasks;
    using SPU.Lib.FraudDetection.Service.Implement;

    /// <summary>
    /// The CaseController.
    /// </summary>
    public class CaseController : BaseController
    {
        private readonly CaseService _caseService;

        private readonly TaskService _taskService;

        public CaseController()
        {
            _caseService = new CaseService();

            _taskService = new TaskService();
        }

        public ActionResult Index()
        {
            return View("~/Areas/FraudDetection/Views/Case/CaseList.cshtml");
        }

        /// <summary>
        /// Display the list of cases.
        /// </summary>
        /// <param name="criteria">The criteria for displaying.</param>
        /// <returns>Represents a JSON-formatted content for displaying.</returns>
        [Compress]
        public JsonResult GetCaseList(CaseSelectAllCriteria criteria)
        {
            criteria.PageIndex++;

            var dataReader = _caseService.GetCases(criteria);
            var results = FanexGridHelper.DataForFanexGrid_PreventContainQuote(dataReader);

            return Json(results, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Add New Case.
        /// </summary>
        /// <returns>HTML string.</returns>
        [HttpGet]
        public string AddNewCase()
        {
            var criteria = new CaseInsertCriteria();

            return RenderViewToString(ControllerContext, "~/Areas/FraudDetection/Views/Case/CaseAdd.cshtml", criteria);
        }

        /// <summary>
        /// Add New Case.
        /// </summary>
        /// <param name="criteria">Case Insert Criteria.</param>
        /// <returns>Action Result.</returns>
        [HttpPost]
        public ActionResult AddNewCase(CaseInsertCriteria criteria)
        {
            if (string.IsNullOrEmpty(criteria.CaseName))
            {
                return new JsonResult { Data = new { ErrCode = "2209", ErrMsg = "A Case should has a name." } };
            }

            criteria.CreatorId = 1;
            var result = _caseService.InsertCase(criteria);
            return new JsonResult { Data = new { ErrCode = result.Code, ErrMsg = result.Message } };
        }

        /// <summary>
        /// Case Detail.
        /// </summary>
        /// <param name="caseId">The Case ID.</param>
        /// <returns>Action Result.</returns>
        [HttpGet]
        public ActionResult CaseDetail(int caseId)
        {
            var caseInfo = _caseService.GetCaseById(new CaseSelectByIdCriteria { CaseId = caseId });
            ViewBag.CaseName = caseInfo.CaseName;
            var criteria = new TaskSelectAllByCaseIdCriteria { CaseId = caseId };

            return View("~/Areas/FraudDetection/Views/Case/CaseDetail.cshtml", criteria);
        }

        /// <summary>
        /// Display the list of task by caseId.
        /// </summary>
        /// <param name="criteria">The criteria for displaying.</param>
        /// <returns>Represents a JSON-formatted content for displaying.</returns>
        [Compress]
        public JsonResult GetCaseDetail(TaskSelectAllByCaseIdCriteria criteria)
        {
            var dataReader = _taskService.GetTasksByCaseId(criteria);
            var results = dataReader.ConvertToString(); //// FanexGridHelper.DataForFanexGrid_PreventContainQuote(dataReader); --

            return Json(results, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// The method EditCaseInfo.
        /// </summary>
        /// <param name="caseId">The work flow ID.</param>
        /// <returns>A template view.</returns>
        [HttpGet]
        public string EditCaseInfo(int? caseId)
        {
            var criteria = new CaseSelectByIdCriteria
            {
                CaseId = caseId == null ? 0 : (int)caseId
            };
            var caseInfo = _caseService.GetCaseById(criteria);
            var model = new CaseUpdateCriteria
            {
                CreatorId = 1,
                CaseId = caseInfo.CaseId,
                CaseName = caseInfo.CaseName,
                CaseDesc = caseInfo.CaseDesc,
                IsActive = caseInfo.IsActive
            };

            return RenderViewToString(ControllerContext, "~/Areas/FraudDetection/Views/Case/CaseEdit.cshtml", model);
        }

        /// <summary>
        /// Edit Work flow.
        /// </summary>
        /// <param name="criteria">Case Update Criteria.</param>
        /// <returns>Action Result.</returns>
        [HttpPost]
        public ActionResult EditCase(CaseUpdateCriteria criteria)
        {
            if (string.IsNullOrEmpty(criteria.CaseName))
            {
                return new JsonResult { Data = new { ErrCode = "2209", ErrMsg = "A Case should has a name." } };
            }

            criteria.CreatorId = 1;
            var result = _caseService.UpdateCase(criteria);

            return new JsonResult { Data = new { ErrCode = result.Code, ErrMsg = result.Message } };
        }

        /// <summary>
        /// Update a work flow status.
        /// </summary>
        /// <param name="caseId">The work flow ID.</param>
        /// <param name="isActive">The new status.</param>
        /// <returns>The ActionResult.</returns>
        [HttpPost]
        public ActionResult EditCaseStatus(int caseId, bool isActive)
        {
            var criteria = new CaseUpdateStatusCriteria
            {
                CreatorId = 1,
                CaseId = caseId,
                IsActive = isActive
            };

            var result = _caseService.UpdateCase(criteria);
            if (result.Code == 0)
            {
                var syncNewTask = SendingMessageFactory.GetSender(
                    isActive ? SendingType.ActivatingCase : SendingType.DeactivatingCase);
                syncNewTask.Send(caseId);
            }

            return new JsonResult { Data = new { ErrCode = result.Code, ErrMsg = result.Message } };
        }

        /// <summary>
        /// Update a work task.
        /// </summary>
        /// <param name="criteria">The input criteria.</param>
        /// <returns>The ActionResult.</returns>
        [HttpPost]
        public ActionResult EditTaskStatus(TaskUpdateStatusCriteria criteria)
        {
            criteria.CreatorId = 1;
            var result = _taskService.UpdateTask(criteria);
            if (result.Code == 0)
            {
                var syncNewTask = SendingMessageFactory.GetSender(SendingType.UpdatingTask);
                syncNewTask.Send(criteria.TaskId);
            }

            return new JsonResult { Data = new { ErrCode = result.Code, ErrMsg = result.Message } };
        }
    }
}
