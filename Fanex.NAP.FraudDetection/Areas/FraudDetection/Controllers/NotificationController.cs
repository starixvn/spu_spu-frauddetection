namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using FD.Lib.Service.Implement;
    using NAP.FraudDetection.Controllers;
    using System.Web.Mvc;

    /// <summary>
    /// The NotificationController.
    /// </summary>
    public class NotificationController : BaseController
    {
        private readonly CaseService _caseService;

        public NotificationController()
        {
            _caseService = new CaseService();
        }

        #region List Notify Messages
        [HttpGet]
        public JsonResult Index()
        {
            var cases = _caseService.GetCases(null);

            return Json(cases, JsonRequestBehavior.AllowGet);
        }
        #endregion

        /*
        #region List Fraud Case's Details
        /// <summary>
        /// Case Detail.
        /// </summary>
        /// <param name="caseId">The Case ID.</param>
        /// <returns>Action Result.</returns>
        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Read)]
        public ActionResult GetCaseDetail(int caseId)
        {
            var caseInfo = _caseService.GetCaseById(new CaseGetByIdCriteria { CaseId = caseId });
            ViewBag.CaseName = caseInfo.CaseName;
            var criteria = new TaskGetAllByCaseIdCriteria { CaseId = caseId };

            return View("~/Areas/FraudDetection/Views/Case/CaseDetail.cshtml", criteria);
        }

        /// <summary>
        /// Display the list of task by caseId.
        /// </summary>
        /// <param name="criteria">The criteria for displaying.</param>
        /// <returns>Represents a JSON-formatted content for displaying.</returns>
        [Compress]
        [NapAuth(FunctionKey = FDFunctionKeys.FraudCase, Policy = Constant.Policy.Read)]
        public JsonResult GetCaseDetail(TaskGetAllByCaseIdCriteria criteria)
        {
            criteria.PageIndex++;
            var dataReader = _taskService.GetTasksByCaseId(criteria);
            var result = FanexGridHelper.DataForFanexGrid_PreventContainQuote(dataReader);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
        #endregion
        */
    }
}
