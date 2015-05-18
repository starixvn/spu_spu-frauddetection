// --------------------------------------------------------------------------
// <copyright file="TaskController.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015.04.05">Created</change>
// </history>

using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Fanex.NAP.FraudDetection.Controllers;
using Fanex.NAP.FraudDetection.Model.ViewModel;
using SPU.Lib.Core;
using SPU.Lib.FraudDetection.Criteria;
using SPU.Lib.FraudDetection.DTO;
using SPU.Lib.FraudDetection.Service;

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    public class TaskController : BaseController
    {
        public ActionResult Index()
        {
            return View("~/Areas/FraudDetection/Views/Task/TaskAdd.cshtml", GenerateViewModel());            
        }

        public TaskViewModel GenerateViewModel()
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
                groupList.Add(new Group { 
                    GroupId = int.Parse(dr["groupid"].ToString()),
                    GroupName = dr["groupname"].ToString()});
            }

            // Bettypes and Sports
            var bettypeService = new BettypeService();
            var sportList = bettypeService.GetAllSBSports(new SportSelectAllCriteria());
            var bettypeList = bettypeService.GetAllSBBettypes(new BettypeSelectAllCriteria());

            var taskViewModel = new TaskViewModel(actionList.ToList(), 
                configList.ToList(), 
                groupList, 
                sportList.ToList(), 
                bettypeList.ToList());
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
        public ActionResult AddNewTask(GroupInsertCriteria criteria)
        {
            criteria.CreatorId = 1;
            GroupService groupService = new GroupService();
            var result = groupService.InsertGroup(criteria);
            return new JsonResult { Data = new { ErrCode = result.Code, ErrMsg = result.Message } };
        }
    }
}
