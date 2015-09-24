// --------------------------------------------------------------------------
// <copyright file="FraudCaseDetailController.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015.04.05">Created</change>
//   <change who="Long.Luu" date="2015.07.24">Refactored</change>
// </history>

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using System.Web.Mvc;
    using FD.Lib.Criteria.Reports;
    using FD.Lib.Service.Implement;
    using FD.Lib.Service.Interface;
    using NAP.FraudDetection.Controllers;

    /// <summary>
    /// The Case Group Controller.
    /// </summary>
    public class FraudCaseDetailController : BaseController
    {
        private readonly IFraudCaseDetailReportService _service;

        public FraudCaseDetailController()
        {
            _service = new FraudCaseDetailReportService();
        }

        public FraudCaseDetailController(IFraudCaseDetailReportService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult Index(FraudCaseDetailReportCriteria criteria)
        {
            var model = _service.GetFraudCaseDetails(criteria);

            return View("~/Areas/FraudDetection/Views/FraudCaseDetail/FraudCaseDetailList.cshtml", model);
        }
    }
}