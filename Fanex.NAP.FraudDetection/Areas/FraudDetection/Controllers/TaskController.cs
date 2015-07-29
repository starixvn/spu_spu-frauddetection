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
    using System.Configuration;
    using System.Linq;
    using System.Web.Mvc;
    using FD.Lib.Criteria.Bettype;
    using FD.Lib.Criteria.CaseGroup;
    using FD.Lib.Criteria.Config;
    using FD.Lib.Criteria.Event;
    using FD.Lib.Criteria.MailMaster;
    using FD.Lib.Criteria.Task;
    using FD.Lib.DTO;
    using FD.Lib.QueryGenerator;
    using FD.Lib.QueueManagement.SendingTasks;
    using FD.Lib.Service.Implement;
    using Models.ViewModel.Task;
    using NAP.FraudDetection.Controllers;
    using Service;

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
        public ActionResult Index(string caseId)
        {
            int fraudCase;
            if (int.TryParse(caseId, out fraudCase))
            {
                return View(
                    "~/Areas/FraudDetection/Views/Task/TaskAdd.cshtml",
                    GenerateViewModel(AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0, fraudCase));
            }

            return View("~/Views/Error/AccessDenied.cshtml");
        }

        /// <summary>
        /// Add New Task.
        /// </summary>
        /// <param name="criteria">Task Insert Criteria.</param>
        /// <returns>Action Result.</returns>
        [HttpPost]
        public ActionResult AddTask(TaskInsertCriteria criteria)
        {
            var dataCheckResults = CheckTaskDataIsCorrect(criteria);
            if (!string.IsNullOrEmpty(dataCheckResults))
            {
                return new JsonResult { Data = new { IsSuccessful = false, Message = dataCheckResults } };
            }

            var queryGeneratorFactory = new QueryGeneratorFactory(
                    criteria.CaseId,
                    criteria,
                    int.Parse(ConfigurationManager.AppSettings["ChunkOfMatchesToScan"]));
            criteria.TaskPreconditions = queryGeneratorFactory.GetQueryGenerator(QueryGeneratorType.PreCondition).GenerateQuery();
            criteria.TaskRules = queryGeneratorFactory.GetQueryGenerator(QueryGeneratorType.Rule).GenerateQuery();

            var result = _taskService.InsertTask(criteria);
            if (result.Code == 0)
            {
                RunTask(int.Parse(result.Message), SendingType.AddingTask);
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        #endregion Add Task

        #region Edit Task

        [HttpGet]
        public ActionResult EditTask(int taskId)
        {
            var taskInfo = _taskService.GetTaskInfoByTaskId(new TaskInfoGetCriteria { TaskId = taskId });
            var viewModel = GenerateViewModel(
                AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0,
                taskInfo.CaseId);
            viewModel.TaskInformation = taskInfo;

            return View("~/Areas/FraudDetection/Views/Task/TaskEdit.cshtml", viewModel);
        }

        /// <summary>
        /// Edit Task.
        /// </summary>
        /// <param name="criteria">Task Edit Criteria.</param>
        /// <param name="caseId">Work flow ID.</param>
        /// <returns>Action Result.</returns>
        [HttpPost]
        public ActionResult EditTask(TaskUpdateCriteria criteria, string caseId)
        {
            var dataCheckResults = CheckTaskDataIsCorrect(criteria);
            if (!string.IsNullOrEmpty(dataCheckResults))
            {
                return new JsonResult { Data = new { IsSuccessful = false, Message = dataCheckResults } };
            }

            var queryGeneratorFactory = new QueryGeneratorFactory(
                    int.Parse(caseId),
                    criteria,
                    int.Parse(ConfigurationManager.AppSettings["ChunkOfMatchesToScan"]));
            criteria.TaskPreconditions = queryGeneratorFactory.GetQueryGenerator(QueryGeneratorType.PreCondition).GenerateQuery();
            criteria.TaskRules = queryGeneratorFactory.GetQueryGenerator(QueryGeneratorType.Rule).GenerateQuery();
            
            var result = _taskService.UpdateTask(criteria);
            if (result.Code == 0)
            {
                RunTask(criteria.TaskId, SendingType.UpdatingTask);
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        #endregion Edit Task

        #region Utilities
        
        /// <summary>
        /// Generate Task View Model.
        /// </summary>
        /// <param name="currentUserId">Current User ID.</param>
        /// <param name="fraudCaseId">Fraud Case ID.</param>
        /// <returns>Task View Model.</returns>
        public TaskViewModel GenerateViewModel(int currentUserId, int fraudCaseId)
        {
            // Actions
            var eventService = new EventService();
            var events = eventService.GetEvents(new EventGetAllCriteria());

            // Configurations
            var configurationService = new ConfigurationsService();
            var configs = configurationService.GetFormattedConfigs(new ConfigGetAllCriteria(), fraudCaseId);

            // Groups
            var caseGroupService = new CaseGroupService();
            var groups = caseGroupService.SelectCaseGroup(new CaseGroupGetAllCriteria { CaseId = fraudCaseId }).ToList();

            // Bettypes and Sports
            var bettypeService = new BettypeService();
            var sports = bettypeService.GetAllSBSports(new SportGetAllCriteria());
            var bettypes = bettypeService.GetAllSBBettypes(new BettypeGetAllCriteria());
            var mailMasters = new MailMasterService().GetMails(new MailMasterGetAllCriteria());

            var taskViewModel = new TaskViewModel(
                events.ToList(),
                configs.ToList(),
                groups,
                sports.ToList(),
                bettypes.ToList(),
                mailMasters.ToList()) { OnUserId = currentUserId, TaskInformation = new Task { CaseId = fraudCaseId, IsActive = true } };

            return taskViewModel;
        }

        /// <summary>
        /// Check Whether Task Data Is Correct.
        /// </summary>
        /// <param name="criteria">Task Info Criteria.</param>
        /// <returns>Check results.</returns>
        public string CheckTaskDataIsCorrect(TaskInfoCriteria criteria)
        {
            if (string.IsNullOrEmpty(criteria.TaskPreconditions) && string.IsNullOrEmpty(criteria.TaskRules))
            {
                return "The conditions are left blank. Please add condition(s) for the new Task.";
            }

            if (string.IsNullOrEmpty(criteria.NextActionIdList) && string.IsNullOrEmpty(criteria.NextActionTargetIdList))
            {
                return "The next actions are left blank. Please add next action(s) for the new Task.";
            }

            return string.Empty;
        }

        /// <summary>
        /// Run a Task.
        /// </summary>
        /// <param name="taskId">Current Task ID.</param>
        /// <param name="runTaskType">Sending Type.</param>
        public void RunTask(int taskId, SendingType runTaskType)
        {
            var syncNewTask = SendingMessageFactory.GetSender(runTaskType);
            syncNewTask.Send(taskId);
        }

        #endregion
    }
}
