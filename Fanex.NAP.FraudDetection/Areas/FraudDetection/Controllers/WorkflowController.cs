namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using System.Web.Mvc;
    using System.Web.Script.Serialization;
    using Fanex.NAP.FraudDetection.Controllers;
    using SPU.Lib.Core;
    using SPU.Lib.FraudDetection.Criteria.Task;
    using SPU.Lib.FraudDetection.Criteria.Workflow;
    using SPU.Lib.FraudDetection.Service.Implement;
    using SPU.Lib.FraudDetection.Service.Interface;

    public class WorkflowController : BaseController
    {
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
            var serializer = new JavaScriptSerializer();                        
            criteria.PageIndex++;

            var workflowService = new WorkflowService();
            var dataReader = workflowService.GetWorkflows(criteria);
            var results = FanexGridHelper.DataForFanexGrid_PreventContainQuote(dataReader);

            return Json(results, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Add New Workflow.
        /// </summary>
        /// <returns>HTML string.</returns>
        [HttpGet]
        public string AddNewWorkflow()
        {
            var criteria = new WorkflowInsertCriteria();            

            return RenderViewToString(ControllerContext, "~/Areas/FraudDetection/Views/Workflow/WorkflowAdd.cshtml", criteria);
        }

        /// <summary>
        /// Add New Workflow.
        /// </summary>
        /// <param name="criteria">Workflow Insert Criteria.</param>
        /// <returns>Action Result.</returns>
        [HttpPost]
        public ActionResult AddNewWorkflow(WorkflowInsertCriteria criteria)
        {
            criteria.CreatorId = 1;
            var workflowService = new WorkflowService();
            var result = workflowService.InsertWorkflow(criteria);
            return new JsonResult { Data = new { ErrCode = result.Code, ErrMsg = result.Message } };
        }

        /// <summary>
        /// Workflow Detail.
        /// </summary>
        /// <param name="workflowId">Workflow ID.</param>
        /// <param name="workflowName">Workflow Name.</param>
        /// <returns>Action Result.</returns>
        [HttpGet]
        public ActionResult WorkflowDetail(int workflowId, string workflowName)
        {
            ViewBag.WorkflowName = workflowName;
            var criteria = new TaskSelectAllByWorkflowIdCriteria() { WorkFlowId = workflowId };

            return View("~/Areas/FraudDetection/Views/Workflow/WorkflowDetail.cshtml", criteria);            
        }

        /// <summary>
        /// Display the list of task by workflowId.
        /// </summary>
        /// <param name="criteria">The criteria for displaying.</param>
        /// <returns>Represents a JSON-formatted content for displaying.</returns>
        [Compress]
        public JsonResult GetWorkflowDetail(TaskSelectAllByWorkflowIdCriteria criteria)
        {
            var serializer = new JavaScriptSerializer();
            criteria.PageIndex++;

            var taskService = new TaskService();
            var dataReader = taskService.GetTasksByWorkflowId(criteria);
            var results = FanexGridHelper.DataForFanexGrid_PreventContainQuote(dataReader);

            return Json(results, JsonRequestBehavior.AllowGet);
        }
    }
}
