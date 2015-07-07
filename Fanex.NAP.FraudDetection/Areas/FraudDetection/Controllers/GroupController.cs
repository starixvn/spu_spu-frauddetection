// --------------------------------------------------------------------------
// <copyright file="GroupController.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015.04.05">Created</change>
//   <change who="Aaron.Cao" date="2015.06.22">Updated</change>
// </history>

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using System.Web.Mvc;
    using NAP.FraudDetection.Controllers;
    using SPU.Lib.Core;
    using SPU.Lib.FraudDetection.Criteria.Group;
    using SPU.Lib.FraudDetection.Service.Implement;

    /// <summary>
    /// The Group Controller.
    /// </summary>
    public class GroupController : BaseController
    {
        private readonly GroupService _groupService;

        public GroupController()
        {
            _groupService = new GroupService();
        }

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
            criteria.PageIndex++;

            var dataReader = _groupService.GetGroups(criteria);
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

            return RenderViewToString(ControllerContext, "~/Areas/FraudDetection/Views/Group/GroupAdd.cshtml", groupInfo);
        }

        /// <summary>
        /// Add New Group.
        /// </summary>
        /// <param name="criteria">Group Insert Criteria.</param>
        /// <returns>Action Result.</returns>
        [HttpPost]
        public ActionResult AddNewGroup(GroupInsertCriteria criteria)
        {
            if (string.IsNullOrEmpty(criteria.GroupName))
            {
                return new JsonResult { Data = new { ErrCode = "2209", ErrMsg = "A Group should has a name." } };
            }

            criteria.CreatorId = 1;
            var result = _groupService.InsertGroup(criteria);
            return new JsonResult { Data = new { ErrCode = result.Code, ErrMsg = result.Message } };
        }

        /// <summary>
        /// The method EditGroupInfo.
        /// </summary>
        /// <param name="groupId">The group ID.</param>
        /// <returns>A template view.</returns>
        [HttpGet]
        public string EditGroupInfo(int? groupId)
        {
            var criteria = new GroupGetByIdCriteria
            {
                GroupId = groupId == null ? 0 : (int)groupId
            };
            var groupInfo = _groupService.GetGroupById(criteria);
            var model = new GroupUpdateCriteria
            {
                CreatorId = 1,
                GroupId = groupInfo.GroupId,
                GroupName = groupInfo.GroupName,
                GroupDesc = groupInfo.GroupDesc,
                IsActive = groupInfo.IsActive
            };

            return RenderViewToString(ControllerContext, "~/Areas/FraudDetection/Views/Group/GroupEdit.cshtml", model);
        }

        /// <summary>
        /// Edit Group.
        /// </summary>
        /// <param name="criteria">Group Update Criteria.</param>
        /// <returns>Action Result.</returns>
        [HttpPost]
        public ActionResult EditGroup(GroupUpdateCriteria criteria)
        {
            if (string.IsNullOrEmpty(criteria.GroupName))
            {
                return new JsonResult { Data = new { ErrCode = "2209", ErrMsg = "A Group should has a name." } };
            }

            criteria.CreatorId = 1;
            var result = _groupService.UpdateGroup(criteria);

            return new JsonResult { Data = new { ErrCode = result.Code, ErrMsg = result.Message } };
        }

        /// <summary>
        /// Update a group status.
        /// </summary>
        /// <param name="groupId">The group ID.</param>
        /// <param name="isActive">The new status.</param>
        /// <returns>The ActionResult.</returns>
        [HttpPost]
        public ActionResult EditGroupStatus(int groupId, bool isActive)
        {
            var criteria = new GroupUpdateStatusCriteria
            {
                CreatorId = 1,
                GroupId = groupId,
                IsActive = isActive
            };

            var result = _groupService.UpdateGroup(criteria);

            return new JsonResult { Data = new { ErrCode = result.Code, ErrMsg = result.Message } };
        }
    }
}
