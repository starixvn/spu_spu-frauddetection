using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SPU.Lib.FraudDetection.Criteria.Workflow;
using SPU.Lib.FraudDetection.Service;
using Fanex.NAP.SPU.Core;
using System.Web.Script.Serialization;
using Fanex.NAP.FraudDetection.Controllers;

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    public class WorkflowController : BaseController
    {
        //
        // GET: /FraudDetection/Workflow/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult List()
        {            
            return View("~/Areas/FraudDetection/Views/Workflow.cshtml");            
        }

        /// <summary>
        /// Display the list of workflows.
        /// </summary>
        /// <param name="criteria">The criteria for displaying.</param>
        /// <returns>Represents a JSON-formatted content for displaying.</returns>
        [Compress]
        public JsonResult GetWorkflowList(WorkflowSelectAllCriteria criteria)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();                        
            criteria.PageIndex++;

            WorkflowService wfService = new WorkflowService();
            var dataReader = wfService.GetWorkflows(criteria);
            var results = FanexGridHelper.DataForFanexGrid_PreventContainQuote(dataReader);

            return Json(results, JsonRequestBehavior.AllowGet);
        }
  

    }
}
