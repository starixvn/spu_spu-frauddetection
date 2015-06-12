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
    using System.Data;
    using System.Linq;
    using System.Web.Mvc;
    using System.Web.Script.Serialization;
    using Fanex.NAP.FraudDetection.Areas.FraudDetection.Models;
    using Fanex.NAP.FraudDetection.Controllers;
    using Fanex.NAP.FraudDetection.Model.ViewModel;
    using Fanex.NAP.FraudDetection.Service;
    using SPU.Lib.Core;
    using SPU.Lib.FraudDetection;
    using SPU.Lib.FraudDetection.BusinessManager;
    using SPU.Lib.FraudDetection.Criteria;
    using SPU.Lib.FraudDetection.Criteria.Task;
    using SPU.Lib.FraudDetection.DTO;
    using SPU.Lib.FraudDetection.Service.Implement;

    public class TaskController : BaseController
    {
        private int _workflowID = 0;

        /// <summary>
        /// Home page for Task.
        /// </summary>
        /// <param name="workflowId">Workflow ID.</param>
        /// <returns>Action Result.</returns>
        public ActionResult Index(string workflowId)
        {
            if (int.TryParse(workflowId, out _workflowID))
            {
                return View(
                    "~/Areas/FraudDetection/Views/Task/TaskAdd.cshtml", 
                    GenerateViewModel(AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0, _workflowID));
            }
            else
            {
                return View("~/Views/Error/AccessDenied.cshtml");
            }
        }

        /// <summary>
        /// Generate Task View Model.
        /// </summary>
        /// <param name="currentUserID">Current User ID.</param>
        /// <param name="workflowID">Workflow ID.</param>
        /// <returns>Task View Model.</returns>
        public TaskViewModel GenerateViewModel(int currentUserID, int workflowID)
        {
            // Actions
            var actionService = new EventService();
            var actionList = actionService.GetEvents(new EventSelectAllCriteria());

            // Configurations
            var configurationService = new ConfigurationsService();
            var configList = configurationService.GetConfigs(new ConfigSelectAllCriteria());

            // Groups
            var groupCriteria = new GroupSelectAllCriteria { PageSize = 100, PageIndex = 1 };
            var groupService = new GroupService();
            var dataCollection = groupService.GetGroups(groupCriteria);
            var groupList = new List<Group>();
            foreach (DataRow dr in dataCollection.Data.Tables[0].Rows)
            {
                groupList.Add(new Group 
                { 
                    GroupId = int.Parse(dr["groupid"].ToString()),
                    GroupName = dr["groupname"].ToString()
                });
            }

            // Bettypes and Sports
            var bettypeService = new BettypeService();
            var sportList = bettypeService.GetAllSBSports(new SportSelectAllCriteria());
            var bettypeList = bettypeService.GetAllSBBettypes(new BettypeSelectAllCriteria());

            var taskViewModel = new TaskViewModel(
                actionList.ToList(), 
                configList.ToList(), 
                groupList, 
                sportList.ToList(), 
                bettypeList.ToList());
            taskViewModel.OnUserID = currentUserID;
            taskViewModel.WorkflowID = workflowID;

            return taskViewModel;
        }

        /// <summary>
        /// Display the list of groups.
        /// </summary>
        /// <param name="criteria">The criteria for displaying.</param>
        /// <returns>Represents a JSON-formatted content for displaying.</returns>
        [Compress]
        public JsonResult GetGroupList(GroupSelectAllCriteria criteria)
        {
            var serializer = new JavaScriptSerializer();                        
            criteria.PageIndex++;

            var groupService = new GroupService();
            var dataReader = groupService.GetGroups(criteria);
            var results = FanexGridHelper.DataForFanexGrid_PreventContainQuote(dataReader);

            return Json(results, JsonRequestBehavior.AllowGet);
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
                return new JsonResult { Data = new { ErrCode = "2209", ErrMsg = "The conditions are left blank. Please add condition(s) for the new Task." } };
            }

            if (string.IsNullOrEmpty(criteria.NextActionIdList) && string.IsNullOrEmpty(criteria.NextActionTargetIdList))
            {
                return new JsonResult { Data = new { ErrCode = "2209", ErrMsg = "The next actions are left blank. Please add next action(s) for the new Task." } };
            }

            criteria.IsActive = true;
            var queryPreconString = "select top 100 {0} from {1} where {2}";
            var queryRuleString = "select {0} from {1} where {2}";
            var taskService = new TaskService();
            var tablesForeignKey = taskService.GetTablesForeignKey(new TablesForeignKeySelectAllCriteria()).ToList();
            var configurationService = new ConfigurationsService();
            var configList = configurationService.GetConfigs(new ConfigSelectAllCriteria()).ToList();

            criteria.TaskPreconditions = string.IsNullOrEmpty(additionalInfo.PreconConfigs) ? string.Empty :
                string.Format(
                queryPreconString,
                GenerateSQLSelect(configList, additionalInfo.PreconConfigs),
                GenerateSQLFrom(configList, tablesForeignKey, additionalInfo.PreconConfigs),
                GenerateSQLWhere(configList, true, additionalInfo, criteria.TaskPreconditions));
            criteria.TaskPreconditionsOriginal = string.IsNullOrEmpty(criteria.TaskPreconditions) ? string.Empty : criteria.TaskPreconditionsOriginal;

            criteria.TaskRules = string.IsNullOrEmpty(additionalInfo.RuleConfigs) ? string.Empty : 
                string.Format(
                queryRuleString,
                GenerateSQLSelect(configList, additionalInfo.RuleConfigs),
                GenerateSQLFrom(configList, tablesForeignKey, additionalInfo.RuleConfigs),
                GenerateSQLWhere(configList, false, additionalInfo, criteria.TaskRules));

            var result = taskService.InsertTask(criteria);
            if (result.Code == 0)
            {
                PushNewTaskToRun(criteria, int.Parse(result.Message));
            }

            return new JsonResult { Data = new { ErrCode = result.Code, ErrMsg = result.Message } };
        }

        /// <summary>
        /// Push New Task To Run Automatically.
        /// </summary>
        /// <param name="criteria">Task Insert Criteria.</param>
        /// <param name="taskId">Inserted Task ID.</param>
        public void PushNewTaskToRun(TaskInsertCriteria criteria, int taskId)
        {
            var syncNewTask = new FraudAutoDetection();
            syncNewTask.AddNewTask(
                new Task(new TaskInfo
                {
                    EventId = criteria.EventId,
                    Interval = criteria.Interval,
                    IntervalType = criteria.IntervalType,
                    IsActive = true,
                    IsBackgroundProcess = true,
                    NextActionIdList = criteria.NextActionIdList,
                    NextActionTargetIdList = criteria.NextActionTargetIdList,
                    TaskPreconditions = criteria.TaskPreconditions,
                    TaskRules = criteria.TaskRules,
                    TaskDesc = criteria.TaskDesc,
                    TaskId = taskId,
                    TaskName = criteria.TaskName,
                    WorkflowId = criteria.WorkflowId
                }));
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
            var sqlFromString = "bodb02.dbo.match tch ";
            var relevantTables = GenerateRelevantTables(configs, selectedConfigIds);

            if (relevantTables.ToLower().Contains("count"))
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
        /// <param name="isPrecondition">Is Precondition.</param>
        /// <param name="additionalInfo">Additional Info.</param>
        /// <param name="formula">Original Formula.</param>
        /// <returns>SQL Where string.</returns>
        public string GenerateSQLWhere(List<Config> configs, bool isPrecondition, TaskAdditionalInfo additionalInfo, string formula)
        {
            var sqlForNotScanned = configs.Single(l => l.ConfigName.ToLower() == "match state").ConfigSQLField;
            var relevantTables = isPrecondition
                ? GenerateRelevantTables(configs, additionalInfo.PreconConfigs)
                : GenerateRelevantTables(configs, additionalInfo.RuleConfigs);
            var configIds = isPrecondition ? additionalInfo.PreconConfigs.Split('#') : additionalInfo.RuleConfigs.Split('#');
            foreach (var configId in configIds)
            {
                var config = configs.Single(l => l.ConfigId == int.Parse(configId));
                formula = formula.Replace(config.ConfigName, config.ConfigSQLField);
            }

            if (relevantTables.ToLower().Contains("count"))
            {
                return formula;
            }

            var sqlWhereString = "tch.matchid in ($param1$) and (" + formula.Replace("%", "'").Replace("#", " ") + ")";
            if (isPrecondition)
            {
                if (additionalInfo.IsCheckNotScanned)
                {
                    sqlWhereString = sqlWhereString.Replace("$param1$", sqlForNotScanned);
                }
                else
                {
                    sqlWhereString = formula.Replace("%", "'").Replace("#", " ");
                }
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

        /// <summary>
        /// Remove multiple space in a string.
        /// </summary>
        /// <param name="targetString">Target String.</param>
        /// <returns>Formatted String.</returns>
        public string RemoveRedundantSpace(string targetString)
        {
            System.Text.RegularExpressions.RegexOptions options = System.Text.RegularExpressions.RegexOptions.None;
            System.Text.RegularExpressions.Regex regex = new System.Text.RegularExpressions.Regex(@"[ ]{2,}", options);
            targetString = regex.Replace(targetString, @" ");

            return targetString;
        }
    }
}
