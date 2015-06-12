// --------------------------------------------------------------------------
// <copyright file="GroupController.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015.04.05">Created</change>
// </history>

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using System.Web.Mvc;
    using System.Web.Script.Serialization;
    using Fanex.NAP.FraudDetection.Controllers;
    using SPU.Lib.Core;
    using SPU.Lib.FraudDetection.Criteria;
    using SPU.Lib.FraudDetection.Service.Implement;
    using SPU.Lib.FraudDetection.Service.Interface;

    public class GroupController : BaseController
    {
        public ActionResult Index()
        {            
            return View("~/Areas/FraudDetection/Views/Group/GroupList.cshtml");            
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
        /// Add New Group.
        /// </summary>
        /// <returns>HTML string.</returns>
        [HttpGet]
        public string AddNewGroup()
        {
            var groupInfo = new GroupInsertCriteria();            

            return RenderViewToString(ControllerContext, "~/Areas/FraudDetection/Views/Group/GroupInfo.cshtml", groupInfo);
        }

        /// <summary>
        /// Add New Group.
        /// </summary>
        /// <param name="criteria">Group Insert Criteria.</param>
        /// <returns>Action Result.</returns>
        [HttpPost]
        public ActionResult AddNewGroup(GroupInsertCriteria criteria)
        {
            criteria.CreatorId = 1;
            var groupService = new GroupService();
            var result = groupService.InsertGroup(criteria);
            return new JsonResult { Data = new { ErrCode = result.Code, ErrMsg = result.Message } };
        }

        [HttpGet]
        public void EditGroupInfo()
        {
        }

        [HttpGet]
        public string EditGroupStatus(int groupId, bool newStatus)
        {
            return "successfully update groupID: " + groupId + " with newStatus:" + newStatus;
        }

        [HttpGet]
        public string DeleteGroup(int groupId)
        {
            return "successfully remove groupID: " + groupId;
        }
    }
}
