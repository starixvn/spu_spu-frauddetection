// --------------------------------------------------------------------------
// <copyright file="ParameterController.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015.06.10">Created</change>
// </history>

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using System.Web.Mvc;
    using Fanex.NAP.FraudDetection.Controllers;
    using Fanex.NAP.FraudDetection.Service;
    using SPU.Lib.FraudDetection.Criteria;
    using SPU.Lib.FraudDetection.Service;

    public class ParameterController : BaseController
    {
        public ActionResult Index()
        {
            var onUserId = AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0;
            return View("~/Areas/FraudDetection/Views/Parameter/ParameterUpdate.cshtml", new ConfigParameterUpdateCriteria { CreatorId = onUserId });            
        }

        [HttpPost]
        public ActionResult UpdateParamater(ConfigParameterUpdateCriteria criteria)
        {
            var groupService = new ConfigurationsService();
            var result = groupService.UpdateConfigParameters(criteria);

            return new JsonResult { Data = new { ErrCode = result.Code, ErrMsg = result.Message } };
        }
    }
}
