// --------------------------------------------------------------------------
// <copyright file="CaseController.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Aaron.Cao" date="2015.06.09">Created</change>
//   <change who="Long.Luu" date="2015.07.24">Refactored</change>
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

        #region List Fraud Cases
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
        public JsonResult GetCaseList(CaseGetAllCriteria criteria)
        {
            criteria.PageIndex++;

            var dataReader = _caseService.GetCases(criteria);
            var results = FanexGridHelper.DataForFanexGrid_PreventContainQuote(dataReader);

            return Json(results, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Add Fraud Case
        /// <summary>
        /// Add New Case.
        /// </summary>
        /// <returns>HTML string.</returns>
        [HttpGet]
        public string AddCase()
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
        public ActionResult AddCase(CaseInsertCriteria criteria)
        {
            if (string.IsNullOrEmpty(criteria.CaseName))
            {
                return new JsonResult { Data = new { IsSuccessful = false, Message = "A Case should has a name." } };
            }

            criteria.CreatorId = 1;
            var result = _caseService.InsertCase(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region List Fraud Case's Details
        /// <summary>
        /// Case Detail.
        /// </summary>
        /// <param name="caseId">The Case ID.</param>
        /// <returns>Action Result.</returns>
        [HttpGet]
        public ActionResult GetCaseDetail(int caseId)
        {
            var caseInfo = _caseService.GetCaseById(new CaseGetByIdCriteria { CaseId = caseId });
            ViewBag.CaseName = caseInfo.CaseName;
            var criteria = new TaskGetAllByCaseIdCriteria { CaseId = caseId };

            return View("~/Areas/FraudDetection/Views/Case/CaseDetail.cshtml", criteria);
        }

        /// <summary>
        /// Display the list of task by caseId.
        /// </summary>
        /// <param name="criteria">The criteria for displaying.</param>
        /// <returns>Represents a JSON-formatted content for displaying.</returns>
        [Compress]
        public JsonResult GetCaseDetail(TaskGetAllByCaseIdCriteria criteria)
        {
            criteria.PageIndex++;
            var dataReader = _taskService.GetTasksByCaseId(criteria);
            var result = FanexGridHelper.DataForFanexGrid_PreventContainQuote(dataReader);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Edit Fraud Case
        /// <summary>
        /// The method EditCaseInfo.
        /// </summary>
        /// <param name="caseId">The case ID.</param>
        /// <returns>A template view.</returns>
        [HttpGet]
        public string EditCaseInfo(int? caseId)
        {
            var criteria = new CaseGetByIdCriteria
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
        public ActionResult EditCaseInfo(CaseUpdateCriteria criteria)
        {
            if (string.IsNullOrEmpty(criteria.CaseName))
            {
                return new JsonResult { Data = new { IsSuccessful = false, Message = "A Case should has a name." } };
            }

            criteria.CreatorId = 1;
            var result = _caseService.UpdateCase(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
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

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Edit Task Status
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

            return Json(result, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}
