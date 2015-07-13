// --------------------------------------------------------------------------
// <copyright file="TaskController.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015.04.05">Created</change>
// </history>

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using System.Collections.Generic;
    using System.Configuration;
    using System.Linq;
    using System.Web.Mvc;
    using Models;
    using NAP.FraudDetection.Controllers;
    using NAP.FraudDetection.Models.ViewModel.Task;
    using Service;
    using SPU.Lib.FraudDetection.Criteria;
    using SPU.Lib.FraudDetection.Criteria.CaseGroup;
    using SPU.Lib.FraudDetection.Criteria.MailMaster;
    using SPU.Lib.FraudDetection.Criteria.Task;
    using SPU.Lib.FraudDetection.DTO;
    using SPU.Lib.FraudDetection.QueueManagement.SendingTasks;
    using SPU.Lib.FraudDetection.Service.Implement;

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
        /// <param name="caseId">Case ID.</param>
        /// <returns>Action Result.</returns>
        public ActionResult Index(string caseId)
        {
            var caseSpu = 0;
            if (int.TryParse(caseId, out caseSpu))
            {
                return View(
                    "~/Areas/FraudDetection/Views/Task/TaskAdd.cshtml",
                    GenerateViewModel(AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0, caseSpu));
            }

            return View("~/Views/Error/AccessDenied.cshtml");
        }

        /// <summary>
        /// Generate Task View Model.
        /// </summary>
        /// <param name="currentUserID">Current User ID.</param>
        /// <param name="caseID">Case ID.</param>
        /// <returns>Task View Model.</returns>
        public TaskViewModel GenerateViewModel(int currentUserID, int caseID)
        {
            // Actions
            var eventService = new EventService();
            var eventList = eventService.GetEvents(new EventSelectAllCriteria());

            // Configurations
            var configurationService = new ConfigurationsService();
            var configList = configurationService.GetConfigs(new ConfigSelectAllCriteria());

            // Groups
            var caseGroupService = new CaseGroupService();
            var groupList = caseGroupService.SelectCaseGroup(new CaseGroupSelectCriteria { CaseId = caseID}).ToList();

            // Bettypes and Sports
            var bettypeService = new BettypeService();
            var sportList = bettypeService.GetAllSBSports(new SportSelectAllCriteria());
            var bettypeList = bettypeService.GetAllSBBettypes(new BettypeSelectAllCriteria());
            var mailMasterList = new MailMasterService().GetMails(new MailMasterGetAllCriteria());

            var taskViewModel = new TaskViewModel(
                eventList.ToList(),
                configList.ToList(),
                groupList,
                sportList.ToList(),
                bettypeList.ToList(),
                mailMasterList.ToList()) { OnUserId = currentUserID, TaskInformation = new Task { CaseId = caseID, IsActive = true} };


            var counterTableSQLString = taskViewModel.ConfigurationList.SingleOrDefault(l => l.ConfigName == "Counter").ConfigSQLTable;
            taskViewModel.ConfigurationList.Where(l => l.ConfigName == "Counter").First().ConfigSQLTable = counterTableSQLString.Replace("$param1$", caseID.ToString());

            return taskViewModel;
        }

        /// <summary>
        /// Add New Task.
        /// </summary>
        /// <param name="criteria">Task Insert Criteria.</param>
        /// <param name="additionalInfo">Additional Info.</param>
        /// <returns>Action Result.</returns>
        [HttpPost]
        public ActionResult AddNewTask(TaskInsertCriteria criteria, TaskAdditionalInfo additionalInfo)
        {
            if (string.IsNullOrEmpty(criteria.TaskPreconditions) && string.IsNullOrEmpty(criteria.TaskRules))
            {
                return new JsonResult { Data = new { IsSuccessful = false, Message = "The conditions are left blank. Please add condition(s) for the new Task." } };
            }

            if (string.IsNullOrEmpty(criteria.NextActionIdList) && string.IsNullOrEmpty(criteria.NextActionTargetIdList))
            {
                return new JsonResult { Data = new { IsSuccessful = false, Message = "The next actions are left blank. Please add next action(s) for the new Task." } };
            }

            var queryPreconString = "select distinct top " + ConfigurationManager.AppSettings["ChunkOfMatchesToScan"] + " {0} from {1} where {2}";
            var queryRuleString = "select distinct {0} from {1} where {2}";
            var tablesForeignKey = _taskService.GetTablesForeignKey(new TablesForeignKeySelectAllCriteria()).ToList();
            var configurationService = new ConfigurationsService();
            var configList = configurationService.GetConfigs(new ConfigSelectAllCriteria()).ToList();
            var counterTableSQLString = configList.SingleOrDefault(l => l.ConfigName == "Counter").ConfigSQLTable;
            configList.Where(l => l.ConfigName == "Counter").First().ConfigSQLTable = counterTableSQLString.Replace("$param1$", criteria.CaseId.ToString());

            criteria.TaskPreconditionsFormatted = criteria.TaskPreconditions;
            criteria.TaskPreconditions = string.IsNullOrEmpty(additionalInfo.PreconConfigs) ? string.Empty :
                string.Format(
                queryPreconString,
                GenerateSQLSelect(configList, additionalInfo.PreconConfigs),
                GenerateSQLFrom(configList, tablesForeignKey, additionalInfo.PreconConfigs),
                GenerateSQLWhere(configList, true, additionalInfo, criteria.TaskPreconditions, criteria.TaskPreconditionsOriginal));
            criteria.TaskPreconditionsOriginal = string.IsNullOrEmpty(criteria.TaskPreconditions) ? string.Empty : criteria.TaskPreconditionsOriginal;

            criteria.TaskRulesFormatted = criteria.TaskRules;
            criteria.TaskRules = string.IsNullOrEmpty(additionalInfo.RuleConfigs) ? string.Empty :
                string.Format(
                queryRuleString,
                GenerateSQLSelect(configList, additionalInfo.RuleConfigs),
                GenerateSQLFrom(configList, tablesForeignKey, additionalInfo.RuleConfigs),
                GenerateSQLWhere(configList, false, additionalInfo, criteria.TaskRules));

            var result = _taskService.InsertTask(criteria);
            if (result.Code == 0)
            {
                PushNewTaskToRun(criteria, int.Parse(result.Message));
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Push New Task To Run Automatically.
        /// </summary>
        /// <param name="criteria">Task Insert Criteria.</param>
        /// <param name="taskId">Inserted Task ID.</param>
        public void PushNewTaskToRun(TaskInsertCriteria criteria, int taskId)
        {
            var syncNewTask = SendingMessageFactory.GetSender(SendingType.AddingTask);
            syncNewTask.Send(taskId);
        }

        /// <summary>
        /// Generate SQL Select.
        /// </summary>
        /// <param name="configs">List of configurations.</param>
        /// <param name="selectedConfigIds">Selected Config IDs.</param>
        /// <returns>SQL Select string.</returns>
        public string GenerateSQLSelect(List<Config> configs, string selectedConfigIds)
        {
            var sqlSelectString = string.Empty;
            var configsList = selectedConfigIds.Split('#');
            foreach (var config in configsList)
            {
                var currentRelevantReturns = configs.Single(l => l.ConfigId == int.Parse(config)).ConfigSQLReturn.Split(',');
                foreach (var currentReturn in currentRelevantReturns)
                {
                    if (!sqlSelectString.Contains(currentReturn))
                    {
                        sqlSelectString += currentReturn + ",";
                    }
                }
            }

            return sqlSelectString.Remove(sqlSelectString.Length - 1);
        }

        /// <summary>
        /// Generate SQL From.
        /// </summary>
        /// <param name="configs">List of configurations.</param>
        /// <param name="tablesForeignKey">Tables' Foreign Keys.</param>
        /// <param name="selectedConfigIds">Selected Config IDs.</param>
        /// <returns>SQL From string.</returns>
        public string GenerateSQLFrom(List<Config> configs, List<TablesForeignKey> tablesForeignKey, string selectedConfigIds)
        {
            var sqlFromString = "bodb02.dbo.match tch with(nolock) ";
            var relevantTables = GenerateRelevantTables(configs, selectedConfigIds);

            if (relevantTables.ToLower().Contains("count("))
            {
                return relevantTables;
            }

            var tables = relevantTables.Split(',');
            foreach (var table in tables)
            {
                sqlFromString += tablesForeignKey.Single(l => l.DBTable2.Trim().ToLower() == table.Trim().ToLower()).ForeignKey;
            }

            return RemoveRedundantSpace(sqlFromString);
        }

        /// <summary>
        /// Generate SQL Where.
        /// </summary>
        /// <param name="configs">List of configurations.</param>
        /// <param name="isPrecond">Is Precondition.</param>
        /// <param name="additionalInfo">Additional Info.</param>
        /// <param name="formula">Formatted Formula.</param>
        /// <param name="originFormula">Original Formula.</param>
        /// <returns>SQL Where string.</returns>
        public string GenerateSQLWhere(List<Config> configs, bool isPrecond, TaskAdditionalInfo additionalInfo, string formula, string originFormula = "")
        {
            var sqlForNotScanned = configs.Single(l => l.ConfigName.ToLower() == "match state").ConfigSQLField;
            var relevantTables = isPrecond
                ? GenerateRelevantTables(configs, additionalInfo.PreconConfigs)
                : GenerateRelevantTables(configs, additionalInfo.RuleConfigs);
            var configIds = isPrecond ? additionalInfo.PreconConfigs.Split('#') : additionalInfo.RuleConfigs.Split('#');
            foreach (var configId in configIds)
            {
                var config = configs.Single(l => l.ConfigId == int.Parse(configId));
                formula = formula.Replace(config.ConfigName, config.ConfigSQLField);
            }

            if (relevantTables.ToLower().Contains("count("))
            {
                return formula;
            }

            var dangerPeriodSql = configs.Single(l => l.ConfigId == 16).ConfigSQLField;
            formula = formula.Replace("NEARTHEGOAL", dangerPeriodSql);
            var sqlWhereString = "tch.matchid in ($param1$) and (" + formula.Replace("%", "'").Replace("#", " ").Replace("@", " ") + ")";
            if (isPrecond)
            {
                sqlWhereString = sqlWhereString.Replace("tch.matchid in", "tch.sporttype between 1 and 99 and tch.matchid not in");

                if (originFormula.Contains("Match State") && additionalInfo.IsCheckNotScanned)
                {
                    sqlWhereString = sqlWhereString.Replace("$param1$", sqlForNotScanned);
                }
                else
                {
                    sqlWhereString = "tch.sporttype between 1 and 99 and " + formula.Replace("%", "'").Replace("#", " ").Replace("@", " ");
                }
            }
            else
            {
                sqlWhereString = "ans.liveindicator = 1 and " + sqlWhereString;
            }

            return RemoveRedundantSpace(sqlWhereString);
        }

        /// <summary>
        /// Generate Relevant Tables.
        /// </summary>
        /// <param name="configs">List of configurations.</param>
        /// <param name="selectedConfigIds">Selected Config IDs.</param>
        /// <returns>List of selected tables.</returns>
        public string GenerateRelevantTables(List<Config> configs, string selectedConfigIds)
        {
            var relevantTables = string.Empty;
            var configsList = selectedConfigIds.Split('#');
            foreach (var config in configsList)
            {
                var currentRelevantTables = configs.Single(l => l.ConfigId == int.Parse(config)).ConfigSQLTable.Split(',');
                foreach (var currentTable in currentRelevantTables)
                {
                    if (!relevantTables.Contains(currentTable))
                    {
                        relevantTables += currentTable + ",";
                    }
                }
            }

            return relevantTables.Remove(relevantTables.Length - 1);
        }

        #endregion Add Task

        #region Edit Task

        [HttpGet]
        public ActionResult TaskEditInfo(int taskId)
        {
            var taskInfo = _taskService.GetTaskInfoByTaskId(new TaskInfoSelectCriteria { TaskId = taskId });
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
        /// <param name="additionalInfo">Additional Info.</param>
        /// <param name="caseId">Work flow ID.</param>
        /// <returns>Action Result.</returns>
        [HttpPost]
        public ActionResult TaskEditInfo(TaskUpdateCriteria criteria, TaskAdditionalInfo additionalInfo, string caseId)
        {
            if (string.IsNullOrEmpty(criteria.TaskPreconditions) && string.IsNullOrEmpty(criteria.TaskRules))
            {
                return new JsonResult { Data = new { IsSuccessful = false, Message = "The conditions are left blank. Please add condition(s) for the new Task." } };
            }

            if (string.IsNullOrEmpty(criteria.NextActionIdList) && string.IsNullOrEmpty(criteria.NextActionTargetIdList))
            {
                return new JsonResult { Data = new { IsSuccessful = false, Message = "The next actions are left blank. Please add next action(s) for the new Task." } };
            }

            string queryPreconString = "select top " + ConfigurationManager.AppSettings["ChunkOfMatchesToScan"] + " {0} from {1} where {2}";
            string queryRuleString = "select {0} from {1} where {2}";
            var tablesForeignKey = _taskService.GetTablesForeignKey(new TablesForeignKeySelectAllCriteria()).ToList();
            var configurationService = new ConfigurationsService();
            var configList = configurationService.GetConfigs(new ConfigSelectAllCriteria()).ToList();
            var counterTableSQLString = configList.SingleOrDefault(l => l.ConfigName == "Counter").ConfigSQLTable;
            configList.Where(l => l.ConfigName == "Counter").First().ConfigSQLTable = counterTableSQLString.Replace("$param1$", caseId);

            criteria.TaskPreconditionsFormatted = criteria.TaskPreconditions;
            criteria.TaskPreconditions = string.IsNullOrEmpty(additionalInfo.PreconConfigs) ? string.Empty :
                string.Format(
                queryPreconString,
                GenerateSQLSelect(configList, additionalInfo.PreconConfigs),
                GenerateSQLFrom(configList, tablesForeignKey, additionalInfo.PreconConfigs),
                GenerateSQLWhere(configList, true, additionalInfo, criteria.TaskPreconditions, criteria.TaskPreconditionsOriginal));
            criteria.TaskPreconditionsOriginal = string.IsNullOrEmpty(criteria.TaskPreconditions) ? string.Empty : criteria.TaskPreconditionsOriginal;

            criteria.TaskRulesFormatted = criteria.TaskRules;
            criteria.TaskRules = string.IsNullOrEmpty(additionalInfo.RuleConfigs) ? string.Empty :
                string.Format(
                queryRuleString,
                GenerateSQLSelect(configList, additionalInfo.RuleConfigs),
                GenerateSQLFrom(configList, tablesForeignKey, additionalInfo.RuleConfigs),
                GenerateSQLWhere(configList, false, additionalInfo, criteria.TaskRules));

            var result = _taskService.UpdateTask(criteria);
            if (result.Code == 0)
            {
                UpdateRunningTask(criteria, int.Parse(caseId));
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Push New Task To Run Automatically.
        /// </summary>
        /// <param name="criteria">Task Insert Criteria.</param>
        /// <param name="caseId">Work flow ID.</param>
        public void UpdateRunningTask(TaskUpdateCriteria criteria, int caseId)
        {
            var syncNewTask = SendingMessageFactory.GetSender(SendingType.UpdatingTask);
            syncNewTask.Send(criteria.TaskId);
        }

        #endregion Edit Task

        #region Utilities

        /// <summary>
        /// Remove multiple space in a string.
        /// </summary>
        /// <param name="targetString">Target String.</param>
        /// <returns>Formatted String.</returns>
        public string RemoveRedundantSpace(string targetString)
        {
            const System.Text.RegularExpressions.RegexOptions options = System.Text.RegularExpressions.RegexOptions.None;
            var regex = new System.Text.RegularExpressions.Regex(@"[ ]{2,}", options);
            targetString = regex.Replace(targetString, @" ");

            return targetString;
        }

        #endregion Utilities
    }
}
