using System.Web.Mvc;
using System.Web.Script.Serialization;
using Fanex.NAP.FraudDetection.Controllers;
using SPU.Lib.Core;
using SPU.Lib.FraudDetection.Criteria.Workflow;
using SPU.Lib.FraudDetection.Service;
using SPU.Lib.FraudDetection.Criteria.Taks;

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

        [HttpGet]
        public ActionResult WorkflowDetail(int workflowId, string workflowName)
        {
            ViewBag.WorkflowName = workflowName;
            var criteria = new TaskSelectAllByWorkflowIdCriteria() { WorkFlowId = workflowId };

            return View("~/Areas/FraudDetection/Views/Workflow/WorkflowDetail.cshtml", criteria);            
        }

        /// <summary>
        /// Display the list of taks by workflowId.
        /// </summary>
        /// <param name="criteria">The criteria for displaying.</param>
        /// <returns>Represents a JSON-formatted content for displaying.</returns>
        [Compress]
        public JsonResult GetWorkflowDetail(TaskSelectAllByWorkflowIdCriteria criteria)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            criteria.PageIndex++;

            TaskService taskService = new TaskService();
            var dataReader = taskService.GetTasksByWorkflowId(criteria);
            var results = FanexGridHelper.DataForFanexGrid_PreventContainQuote(dataReader);

            return Json(results, JsonRequestBehavior.AllowGet);
        }
    }
}
