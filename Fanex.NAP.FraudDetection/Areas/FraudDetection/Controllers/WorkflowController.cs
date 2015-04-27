using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SPU.Lib.FraudDetection.Criteria.Workflow;
using SPU.Lib.FraudDetection.Service;
using Fanex.NAP.SPU.Core;
using System.Web.Script.Serialization;

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    public class WorkflowController : Controller
    {
        //
        // GET: /FraudDetection/Workflow/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult List()
        {

            //WorkflowSelectAllCriteria criteria = new WorkflowSelectAllCriteria();
            //WorkflowService wfService = new WorkflowService();
            //wfService.GetWorkflows(criteria);

            //return View("~/Areas/FraudDetection/Views/Workflow.cshtml");

            WorkflowSelectAllCriteria criteria = new WorkflowSelectAllCriteria();
            GetAffiliateList(criteria);
            return View("~/Areas/FraudDetection/Views/Workflow.cshtml");
        }

        /// <summary>
        /// Display the list of affiliates.
        /// </summary>
        /// <param name="criteria">The criteria for displaying.</param>
        /// <returns>Represents a JSON-formatted content for displaying.</returns>
        [Compress]
        public JsonResult GetAffiliateList(WorkflowSelectAllCriteria criteria)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();                        
            //criteria.PageIndex++;

            WorkflowService wfService = new WorkflowService();
            var dr = wfService.GetWorkflows(criteria);
            var result = FanexGridHelper.DataForFanexGrid_PreventContainQuote(dr);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
  

    }
}
