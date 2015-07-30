// --------------------------------------------------------------------------
// <copyright file="GroupController.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015.04.05">Created</change>
//   <change who="Aaron.Cao" date="2015.06.22">Updated</change>
//   <change who="Long.Luu" date="2015.07.24">Refactored</change>
// </history>

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using System.Web.Mvc;
    using FD.Lib.Core.Attribute;
    using FD.Lib.Core.Utilities;
    using FD.Lib.Criteria.Group;
    using FD.Lib.Service.Implement;
    using NAP.FraudDetection.Controllers;

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

        #region List Groups
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
        public JsonResult GetGroupList(GroupGetAllCriteria criteria)
        {
            var result = _groupService.GetGroups(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Add Group
        /// <summary>
        /// Add New Group.
        /// </summary>
        /// <returns>HTML string.</returns>
        [HttpGet]
        public string AddGroup()
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
        public ActionResult AddGroup(GroupInsertCriteria criteria)
        {
            if (string.IsNullOrEmpty(criteria.GroupName))
            {
                return new JsonResult { Data = new { IsSuccessful = false, Message = "A Group should has a name." } };
            }

            criteria.CreatorId = 1;
            var result = _groupService.InsertGroup(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Edit Group
        /// <summary>
        /// The method EditGroupInfo.
        /// </summary>
        /// <param name="groupId">The group ID.</param>
        /// <returns>A template view.</returns>
        [HttpGet]
        public string EditGroup(int? groupId)
        {
            var criteria = new GroupGetByIdCriteria
            {
                GroupId = groupId == null ? 0 : (int)groupId
            };

            var groupInfo = _groupService.GetGroupById(criteria);
            var viewModel = new GroupUpdateCriteria
            {
                CreatorId = 1,
                GroupId = groupInfo.GroupId,
                GroupName = groupInfo.GroupName,
                GroupDesc = groupInfo.GroupDesc,
                IsActive = groupInfo.IsActive
            };

            return RenderViewToString(ControllerContext, "~/Areas/FraudDetection/Views/Group/GroupEdit.cshtml", viewModel);
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
                return new JsonResult { Data = new { IsSuccessful = false, Message = "A Group should has a name!" } };
            }

            criteria.CreatorId = 1;
            var result = _groupService.UpdateGroup(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
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

            return Json(result, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}
