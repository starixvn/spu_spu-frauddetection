using System.Web.Mvc;
using System.Web.Script.Serialization;
using Fanex.NAP.FraudDetection.Controllers;
using SPU.Lib.Core;
using SPU.Lib.FraudDetection.Criteria.Workflow;
using SPU.Lib.FraudDetection.Service;

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    public class WorkflowController : BaseController
    {
        //
        // GET: /FraudDetection/Workflow/

        public ActionResult Index()
        {
            return View("~/Areas/FraudDetection/Views/Workflow/WorkflowList.cshtml");            
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

        [HttpGet]
        public string AddNewWorkflow()
        {
            var criteria = new WorkflowInsertCriteria();            

            return RenderViewToString(ControllerContext, "~/Areas/FraudDetection/Views/Workflow/WorkflowAdd.cshtml", criteria);
        }

        [HttpPost]
        public ActionResult AddNewWorkflow(WorkflowInsertCriteria criteria)
        {
            criteria.CreatorId = 1;
            WorkflowService workflowService = new WorkflowService();
            var result = workflowService.InsertWorkflow(criteria);
            return new JsonResult { Data = new { ErrCode = result.Code, ErrMsg = result.Message } };
        }  
    }
}
