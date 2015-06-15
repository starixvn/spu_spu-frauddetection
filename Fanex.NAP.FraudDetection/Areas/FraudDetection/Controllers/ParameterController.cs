// --------------------------------------------------------------------------
// <copyright file="ParameterController.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015.06.10">Created</change>
// </history>

using Fanex.NAP.FraudDetection.Model.ViewModel.Paramater;

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using System.Linq;
    using System.Web.Mvc;
    using NAP.FraudDetection.Controllers;
    using Service;
    using SPU.Lib.FraudDetection.Criteria;
    using SPU.Lib.FraudDetection.Service.Implement;

    public class ParameterController : BaseController
    {
        public ActionResult Index()
        {
            return View("~/Areas/FraudDetection/Views/Parameter/ParameterUpdate.cshtml", GenerateViewModel());            
        }

        /// <summary>
        /// Generate View Model.
        /// </summary>
        /// <returns>View Model.</returns>
        public ParameterViewModel GenerateViewModel()
        {
            var loggedInUserId = AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0;
            var configService = new ConfigurationsService();
            var listOfParams = configService.GetParameters(new ParameterSelectAllCriteria()).ToList();
            var viewModel = new ParameterViewModel(listOfParams, loggedInUserId);

            return viewModel;
        }

        /// <summary>
        /// Update parameter.
        /// </summary>
        /// <param name="criteria">Config Parameter Update Criteria.</param>
        /// <returns>Action Result.</returns>
        [HttpPost]
        public ActionResult UpdateParamater(ConfigParameterUpdateCriteria criteria)
        {
            var configService = new ConfigurationsService();
            var result = configService.UpdateConfigParameters(criteria);

            return new JsonResult { Data = new { ErrCode = result.Code, ErrMsg = result.Message } };
        }
    }
}
