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
    using SPU.Lib.FraudDetection.BusinessManager;
    using SPU.Lib.FraudDetection.Criteria;
    using SPU.Lib.FraudDetection.Criteria.Taks;
    using SPU.Lib.FraudDetection.Criteria.Task;
    using SPU.Lib.FraudDetection.DTO;
    using SPU.Lib.FraudDetection.Service;

    public class TaskController : BaseController
    {
        private int _workflowID = 0;

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

        public TaskViewModel GenerateViewModel(int currentUserID, int workflowID)
        {
            // Actions
            var actionService = new ActionService();
            var actionList = actionService.GetActions(new ActionSelectAllCriteria());

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
            JavaScriptSerializer serializer = new JavaScriptSerializer();                        
            criteria.PageIndex++;

            GroupService groupService = new GroupService();
            var dataReader = groupService.GetGroups(criteria);
            var results = FanexGridHelper.DataForFanexGrid_PreventContainQuote(dataReader);

            return Json(results, JsonRequestBehavior.AllowGet);
        }

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

            criteria.IsActive = true; // true;
            criteria.TaskName = RemoveRedundantSpace(criteria.TaskName);
            criteria.TaskPreconditionsOriginal = string.Empty;
            criteria.TaskRulesOriginal = string.Empty;
            var queryPreconString = "select top 100 {0} from {1} where {2}";
            var queryRuleString = "select {0} from {1} where {2}";
            var taskService = new TaskService();
            List<TablesForeignKey> tablesForeignKey = taskService.GetTablesForeignKey(new TablesForeignKeySelectAllCriteria()).ToList();

            criteria.TaskPreconditions = string.IsNullOrEmpty(additionalInfo.PreconRelevantTables) ? string.Empty :
                string.Format(
                queryPreconString,
                additionalInfo.PreconRelevantReturns,
                GenerateSQLFrom(tablesForeignKey, additionalInfo.PreconRelevantTables),
                GenerateSQLWhere(true, tablesForeignKey, additionalInfo, criteria.TaskPreconditions));

            criteria.TaskRules = string.IsNullOrEmpty(additionalInfo.RuleRelevantTables) ? string.Empty : 
                string.Format(
                queryRuleString,
                additionalInfo.RuleRelevantReturns,
                GenerateSQLFrom(tablesForeignKey, additionalInfo.RuleRelevantTables),
                GenerateSQLWhere(false, tablesForeignKey, additionalInfo, criteria.TaskRules));

            var result = taskService.InsertTask(criteria);
            if (result.Code == 0)
            {
                FraudAutoDetection syncNewTask = new FraudAutoDetection();
                syncNewTask.AddNewTask(new Task(new TaskInfo {
                    ActionId = criteria.ActionId,
                    Interval = criteria.Interval,
                IntervalType = criteria.IntervalType,
                IsActive = true,
                IsBackgroundProcess = true,
                NextActionIdList = criteria.NextActionIdList,
                NextActionTargetIdList = criteria.NextActionTargetIdList,
                TaskPreconditions = criteria.TaskPreconditions,
                TaskRules = criteria.TaskRules,
                TaskDesc = criteria.TaskDesc,
                TaskId = int.Parse(result.Message),
                TaskName = criteria.TaskName,
                WorkflowId = criteria.WorkflowId}));
            }

            return new JsonResult { Data = new { ErrCode = result.Code, ErrMsg = result.Message } };
        }

        public string GenerateSQLFrom(List<TablesForeignKey> tablesForeignKey, string relevantTables)
        {
            if (relevantTables.Contains("COUNT"))
            {
                return relevantTables;
            }

            var tables = relevantTables.Split(',');
            var sqlFromString = "bodb02.dbo.match tch ";
            foreach (var table in tables)
            {
                sqlFromString += tablesForeignKey.Single(l => l.DBTable2.Trim().ToLower() == table.Trim().ToLower()).ForeignKey;
            }

            return RemoveRedundantSpace(sqlFromString);
        }

        public string GenerateSQLWhere(bool isPrecondition, List<TablesForeignKey> tablesForeignKey, TaskAdditionalInfo additionalInfo, string relevantConditions)
        {
            if (additionalInfo.RuleRelevantTables.Contains("COUNT"))
            {
                return relevantConditions;
            }

            var sqlWhereString = "tch.matchid in ($param1$) and (" + relevantConditions.Replace("%", "'").Replace("#", " ") + ")";
            if (isPrecondition)
            {
                if (additionalInfo.IsCheckNotScanned)
                {
                    sqlWhereString = sqlWhereString.Replace("$param1$", additionalInfo.SQLForNotScanned);
                }
                else
                {
                    sqlWhereString = relevantConditions.Replace("%", "'").Replace("#", " ");
                }
            }

            return RemoveRedundantSpace(sqlWhereString);
        }

        public string RemoveRedundantSpace(string targetString)
        {
            System.Text.RegularExpressions.RegexOptions options = System.Text.RegularExpressions.RegexOptions.None;
            System.Text.RegularExpressions.Regex regex = new System.Text.RegularExpressions.Regex(@"[ ]{2,}", options);
            targetString = regex.Replace(targetString, @" ");

            return targetString;
        }
    }
}
