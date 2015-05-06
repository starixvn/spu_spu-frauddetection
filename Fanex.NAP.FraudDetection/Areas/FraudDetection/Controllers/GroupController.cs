// --------------------------------------------------------------------------
// <copyright file="GroupController.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015.04.05">Created</change>
// </history>

using System.Web.Mvc;
using System.Web.Script.Serialization;
using Fanex.NAP.FraudDetection.Controllers;
using Fanex.NAP.SPU.Core;
using SPU.Lib.FraudDetection.Service;
using SPU.Lib.FraudDetection.Criteria;

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
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
            JavaScriptSerializer serializer = new JavaScriptSerializer();                        
            criteria.PageIndex++;

            GroupService groupService = new GroupService();
            var dataReader = groupService.GetGroups(criteria);
            var results = FanexGridHelper.DataForFanexGrid_PreventContainQuote(dataReader);

            return Json(results, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public string AddNewGroup()
        {
            return RenderViewToString(ControllerContext, "~/Areas/FraudDetection/Views/Group/GroupInfo.cshtml");
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
