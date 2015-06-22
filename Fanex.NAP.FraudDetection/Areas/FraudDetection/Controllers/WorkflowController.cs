namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using System.Web.Mvc;
    using NAP.FraudDetection.Controllers;
    using SPU.Lib.Core;
    using SPU.Lib.FraudDetection.Criteria.Task;
    using SPU.Lib.FraudDetection.Criteria.Workflow;
    using SPU.Lib.FraudDetection.Service.Implement;

    /// <summary>
    /// The WorkflowController.
    /// </summary>
    public class WorkflowController : BaseController
    {
        private readonly WorkflowService _workflowService;

        public WorkflowController()
        {
            _workflowService = new WorkflowService();
        }

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
            var criteria = new TaskSelectAllByWorkflowIdCriteria { WorkFlowId = workflowId };

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
            criteria.PageIndex++;

            var taskService = new TaskService();
            var dataReader = taskService.GetTasksByWorkflowId(criteria);
            var results = FanexGridHelper.DataForFanexGrid_PreventContainQuote(dataReader);

            return Json(results, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// The method EditWorkflowInfo.
        /// </summary>
        /// <param name="workflowId">The work flow ID.</param>
        /// <returns>A template view.</returns>
        [HttpGet]
        public string EditWorkflowInfo(int? workflowId)
        {
            var criteria = new WorkflowSelectByIdCriteria
            {
                WorkflowId = workflowId == null ? 0 : (int)workflowId
            };
            var workflowInfo = _workflowService.GetWorkflowById(criteria);
            var model = new WorkflowUpdateCriteria
            {
                CreatorId = 1,
                WorkflowId = workflowInfo.WorkflowId,
                WorkflowName = workflowInfo.WorkflowName,
                WorkflowDesc = workflowInfo.WorkflowDesc,
                IsActive = workflowInfo.IsActive
            };

            return RenderViewToString(ControllerContext, "~/Areas/FraudDetection/Views/Workflow/WorkflowEdit.cshtml", model);
        }

        /// <summary>
        /// Edit Work flow.
        /// </summary>
        /// <param name="criteria">Workflow Update Criteria.</param>
        /// <returns>Action Result.</returns>
        [HttpPost]
        public ActionResult EditWorkflow(WorkflowUpdateCriteria criteria)
        {
            criteria.CreatorId = 1;
            var result = _workflowService.UpdateWorkflow(criteria);

            return new JsonResult { Data = new { ErrCode = result.Code, ErrMsg = result.Message } };
        }

        /// <summary>
        /// Update a work flow status.
        /// </summary>
        /// <param name="workflowId">The work flow ID.</param>
        /// <param name="isActive">The new status.</param>
        /// <returns>The ActionResult.</returns>
        [HttpPost]
        public ActionResult EditWorkflowStatus(int workflowId, bool isActive)
        {
            var criteria = new WorkflowUpdateStatusCriteria
            {
                CreatorId = 1,
                WorkflowId = workflowId,
                IsActive = isActive
            };

            var result = _workflowService.UpdateWorkflow(criteria);

            return new JsonResult { Data = new { ErrCode = result.Code, ErrMsg = result.Message } };
        }
    }
}
