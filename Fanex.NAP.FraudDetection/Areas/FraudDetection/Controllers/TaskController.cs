// --------------------------------------------------------------------------
// <copyright file="TaskController.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015.04.05">Created</change>
//   <change who="Long.Luu" date="2015.07.24">Refactored</change>
// </history>

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using Core.Business;
    using Core.Web.Attribute;
    using FD.Lib.Criteria.Activity;
    using FD.Lib.Criteria.Bettype;
    using FD.Lib.Criteria.CaseGroup;
    using FD.Lib.Criteria.Common;
    using FD.Lib.Criteria.Config;
    using FD.Lib.Criteria.Event;
    using FD.Lib.Criteria.MailMaster;
    using FD.Lib.Criteria.MessageMaster;
    using FD.Lib.Criteria.Parameter;
    using FD.Lib.Criteria.Task;
    using FD.Lib.QueryGenerator;
    using FD.Lib.QueueManagement.SendingTasks;
    using FD.Lib.Service.Implement;
    using Models.ViewModel.Task;
    using NAP.FraudDetection.Controllers;
    using Service;
    using Service.Core;
    using System.Linq;
    using System.Web.Mvc;

    public class TaskController : BaseController
    {
        private readonly TaskService _taskService;

        public TaskController()
        {
            _taskService = new TaskService();
        }

        #region Add Task

        /// <summary>
        /// Home page for Task.
        /// </summary>
        /// <param name="caseId">Fraud Case ID.</param>
        /// <returns>Action Result.</returns>
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Read)]
        public ActionResult Index(string caseId)
        {
            int fraudCase;
            if (int.TryParse(caseId, out fraudCase))
            {
                var result = new TaskModel
                {
                    CaseId = fraudCase,
                    UserId = AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0
                };

                return View(
                    "~/Areas/FraudDetection/Views/Task/TaskAdd.cshtml", result);
            }

            return View("~/Views/Error/AccessDenied.cshtml");
        }

        /// <summary>
        /// Add New Task.
        /// </summary>
        /// <param name="criteria">Task Insert Criteria.</param>
        /// <returns>Action Result.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Host)]
        public ActionResult AddTask(TaskInsertCriteria criteria)
        {
            var configService = new ConfigurationsService();
            var matchParams =
                configService.GetParameters(new ParameterGetAllCriteria()).Where(t => t.ParamName == "ChunkOfMatches");
            var matchSize = matchParams.FirstOrDefault() != null ? matchParams.FirstOrDefault().ParamValue : 10;

            var queryGeneratorFactory = new QueryGeneratorFactory(
                    criteria.CaseId,
                    criteria,
                    matchSize);
            criteria.TaskPreconditions = queryGeneratorFactory.GetQueryGenerator(QueryGeneratorType.PreCondition).GenerateQuery();
            criteria.TaskRules = queryGeneratorFactory.GetQueryGenerator(QueryGeneratorType.Rule).GenerateQuery();

            var result = _taskService.InsertTask(criteria);
            if (result.Code == 0 && criteria.EventId == (int)EventType.BackGround)
            {
                RunTask(int.Parse(result.Message), SendingType.AddingTask);
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        #endregion Add Task

        #region Edit Task

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Read)]
        public ActionResult EditTask(int taskId)
        {
            var taskInfo = _taskService.GetTaskInfoByTaskId(new TaskInfoGetCriteria { TaskId = taskId });

            var result = new TaskModel
            {
                CaseId = taskInfo.CaseId,
                UserId = AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0,
                TaskId = taskId
            };
            return View("~/Areas/FraudDetection/Views/Task/TaskEdit.cshtml", result);
        }

        /// <summary>
        /// Edit Task.
        /// </summary>
        /// <param name="criteria">Task Edit Criteria.</param>
        /// <param name="caseId">Work flow ID.</param>
        /// <returns>Action Result.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Host)]
        public ActionResult EditTask(TaskUpdateCriteria criteria, string caseId)
        {
            var configService = new ConfigurationsService();
            var matchParams =
                configService.GetParameters(new ParameterGetAllCriteria()).Where(t => t.ParamName == "ChunkOfMatches");
            var matchSize = matchParams.FirstOrDefault() != null ? matchParams.FirstOrDefault().ParamValue : 10;

            var queryGeneratorFactory = new QueryGeneratorFactory(
                    int.Parse(caseId),
                    criteria,
                    matchSize);
            criteria.TaskPreconditions = queryGeneratorFactory.GetQueryGenerator(QueryGeneratorType.PreCondition).GenerateQuery();
            criteria.TaskRules = queryGeneratorFactory.GetQueryGenerator(QueryGeneratorType.Rule).GenerateQuery();
            criteria.TaskDesc = string.IsNullOrEmpty(criteria.TaskDesc) ? string.Empty : criteria.TaskDesc;
            var result = _taskService.UpdateTask(criteria);

            if (result.Code == 0 && criteria.EventId == (int)EventType.BackGround)
            {
                RunTask(criteria.TaskId, SendingType.UpdatingTask);
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        #endregion Edit Task

        #region Utilities

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Read)]
        public ActionResult GetTaskInfo(int taskId)
        {
            var taskInfo = _taskService.GetTaskInfoByTaskId(new TaskInfoGetCriteria { TaskId = taskId });

            return Json(taskInfo, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Read)]
        public ActionResult GetEvents()
        {
            var events = new CommonService().GetEvents(new EventGetAllCriteria());

            return Json(events, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Read)]
        public ActionResult GetMails()
        {
            var mailMasters = new MailMasterService().GetMails(new MailMasterGetAllCriteria()).Where(m => m.IsActive);

            return Json(mailMasters, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Read)]
        public ActionResult GetMessages()
        {
            var messages = new MessageMasterService().GetAllMessage(new MessageMasterGetAllCriteria()).Where(m => m.IsActive);

            return Json(messages, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Read)]
        public ActionResult GetCurrencies()
        {
            var currencies = new CurrencyService().GetCurrencies(new CurrencyGetAllCriteria());

            return Json(currencies, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Read)]
        public ActionResult GetActivities()
        {
            var activities = new CommonService().GetActivities(new ActivityGetAllCriteria());

            return Json(activities, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Read)]
        public ActionResult GetSports()
        {
            var sports = new BettypeService().GetAllSBSports(new SportGetAllCriteria());

            return Json(sports, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Read)]
        public ActionResult GetBetTypes()
        {
            var betTypes = new BettypeService().GetAllSBBettypes(new BettypeGetAllCriteria());

            return Json(betTypes, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Read)]
        public ActionResult GetDataTypes()
        {
            var dataTypes = new DataCaptureService().GetAllDataTypeCapture(new DataTypeCaptureGetAllCriteria());

            return Json(dataTypes, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Read)]
        public ActionResult GetConfigsByActivity(int? activityId)
        {
            var criteria = new ConfigsGetByActivityCriteria
            {
                ActivityId = activityId
            };
            var configs = new CommonService().GetConfigsByActivity(criteria);

            return Json(configs, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Read)]
        public ActionResult GetCustomerGroupByCase(int caseId)
        {
            var groups = new CaseGroupService().GetCaseGroup(new CaseGroupGetAllCriteria { CaseId = caseId });

            return Json(groups, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Read)]
        public ActionResult GetBackGroundTasksByCase(int caseId)
        {
            var tasks = new TaskService().GetBackGroundTasksByCase(new TaskBackGroundGetByCaseIdCriteria { CaseId = caseId });

            return Json(tasks, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Read)]
        public ActionResult GetEvidenceTypes()
        {
            var evidenceTypes = new CommonService().GetEvidenceTypes(new EvidenceTypesGetAllCriteria());

            return Json(evidenceTypes, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Run a Task.
        /// </summary>
        /// <param name="taskId">Current Task ID.</param>
        /// <param name="runTaskType">Sending Type.</param>
        private void RunTask(int taskId, SendingType runTaskType)
        {
            var syncNewTask = SendingMessageFactory.GetSender(runTaskType);
            syncNewTask.Send(taskId);
        }

        #endregion
    }
}
