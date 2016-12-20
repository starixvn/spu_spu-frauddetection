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
    using Core.Business;
    using Core.Web.Attribute;
    using Fanex.NAP.FraudDetection.Model.Case;
    using FD.Lib.Core.Attribute;
    using FD.Lib.Core.Utilities;
    using FD.Lib.Criteria.Case;
    using FD.Lib.Criteria.Common;
    using FD.Lib.Criteria.Task;
    using FD.Lib.QueryGenerator;
    using FD.Lib.QueueManagement.SendingTasks;
    using FD.Lib.Service.Implement;
    using NAP.FraudDetection.Controllers;
    using Service.Core;
    using System.Configuration;
    using System.Linq;
    using System.Web.Mvc;

    /// <summary>
    /// The CaseController.
    /// </summary>
    public class CaseController : BaseController
    {
        private readonly CaseService _caseService;

        private readonly CommonService _commonService;

        private readonly TaskService _taskService;

        public CaseController()
        {
            _caseService = new CaseService();

            _taskService = new TaskService();

            _commonService = new CommonService();
        }

        #region List Fraud Cases
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            ViewBag.IsTest = ConfigurationManager.AppSettings["IsLocalTest"].Equals("1");
            return View("~/Areas/FraudDetection/Views/Case/CaseList.cshtml");
        }

        /// <summary>
        /// Display the list of cases.
        /// </summary>
        /// <param name="criteria">The criteria for displaying.</param>
        /// <returns>Represents a JSON-formatted content for displaying.</returns>
        [Compress]
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Read)]
        public JsonResult GetCaseList(CaseGetAllCriteria criteria)
        {
            var cases = _caseService.GetCases(criteria);

            if (!ConfigurationManager.AppSettings["IsLocalTest"].Equals("1"))
            {
                cases.Cases = cases.Cases.Where(c => !c.IsTest);
            }

            return Json(cases, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Add Fraud Case
        /// <summary>
        /// Add New Case.
        /// </summary>
        /// <returns>HTML string.</returns>
        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Host)]
        public string AddCase()
        {
            var caseTypes = _commonService.GetCaseTypes(new CaseTypesGetAllCriteria());

            var criteria = new CaseInsertCriteria
            {
                IsActive = true,
                IsInternal = true,
                TypeId = 1
            };

            var model = new CaseInsertModel()
            {
                CaseModel = criteria,
                CaseTypes = caseTypes
            };

            return RenderViewToString(ControllerContext, "~/Areas/FraudDetection/Views/Case/CaseAdd.cshtml", model);
        }

        /// <summary>
        /// Add New Case.
        /// </summary>
        /// <param name="criteria">Case Insert Criteria.</param>
        /// <returns>Action Result.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Host)]
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
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Read)]
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
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Read)]
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
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Host)]
        public string EditCaseInfo(int? caseId)
        {
            var criteria = new CaseGetByIdCriteria
            {
                CaseId = caseId == null ? 0 : (int)caseId
            };
            var caseInfo = _caseService.GetCaseById(criteria);
            var caseEditInfo = new CaseUpdateCriteria
            {
                CreatorId = 1,
                CaseId = caseInfo.CaseId,
                CaseName = caseInfo.CaseName,
                CaseDesc = caseInfo.CaseDesc,
                IsActive = caseInfo.IsActive,
                IsInternal = caseInfo.IsInternal,
                TypeId = caseInfo.TypeId
            };

            var caseTypes = _commonService.GetCaseTypes(new CaseTypesGetAllCriteria());

            var model = new CaseUpdateModel()
            {
                CaseModel = caseEditInfo,
                CaseTypes = caseTypes
            };

            return RenderViewToString(ControllerContext, "~/Areas/FraudDetection/Views/Case/CaseEdit.cshtml", model);
        }

        /// <summary>
        /// Edit Work flow.
        /// </summary>
        /// <param name="criteria">Case Update Criteria.</param>
        /// <returns>Action Result.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Host)]
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
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Host)]
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

        [HttpPost]
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Host)]
        public ActionResult EditCaseTest(int caseId, bool isTest)
        {
            var criteria = new CaseUpdateTestCriteria
            {
                CreatorId = 1,
                CaseId = caseId,
                IsTest = isTest
            };

            var result = _caseService.UpdateCase(criteria);

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
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Host)]
        public ActionResult EditTaskStatus(TaskUpdateStatusCriteria criteria)
        {
            criteria.CreatorId = 1;
            var result = _taskService.UpdateTask(criteria);
            var task = _taskService.GetTaskInfoByTaskId(new TaskInfoGetCriteria
            {
                TaskId = criteria.TaskId
            });
            if (result.Code == 0 && task.EventId == (int)EventType.BackGround)
            {
                var syncNewTask = SendingMessageFactory.GetSender(SendingType.UpdatingTask);
                syncNewTask.Send(criteria.TaskId);
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}
