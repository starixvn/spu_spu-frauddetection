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
    using System.Linq;
    using System.Web.Mvc;
    using FD.Lib.Criteria.Config;
    using FD.Lib.Criteria.Parameter;
    using FD.Lib.Service.Implement;
    using NAP.FraudDetection.Controllers;
    using NAP.FraudDetection.Models.ViewModel.Paramater;
    using Service;

    public class ParameterController : BaseController
    {
        public ActionResult Index()
        {
            return View("~/Areas/FraudDetection/Views/Parameter/ParameterEdit.cshtml", GenerateViewModel());
        }

        /// <summary>
        /// Update parameter.
        /// </summary>
        /// <param name="criteria">Config Parameter Update Criteria.</param>
        /// <returns>Action Result.</returns>
        [HttpPost]
        public ActionResult UpdateParameter(ConfigUpdateCriteria criteria)
        {
            var configService = new ConfigurationsService();
            var result = configService.UpdateConfigParameters(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Generate View Model.
        /// </summary>
        /// <returns>View Model.</returns>
        private ParameterViewModel GenerateViewModel()
        {
            var loggedInUserId = AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0;
            var configService = new ConfigurationsService();
            var listOfParams = configService.GetParameters(new ParameterGetAllCriteria()).ToList();
            var viewModel = new ParameterViewModel(listOfParams, loggedInUserId);

            return viewModel;
        }

    }
}
