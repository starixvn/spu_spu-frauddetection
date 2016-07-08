
namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using Fanex.NAP.FraudDetection.Controllers;
    using FD.Lib.Criteria.MessageMaster;
    using FD.Lib.Service.Implement;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;

    public class MessageMasterController : BaseController
    {
        private readonly MessageMasterService messMasterService;

        public MessageMasterController()
        {
            messMasterService = new MessageMasterService();
        }

        public ActionResult Index()
        {
            return View("~/Areas/FraudDetection/Views/MessageMaster/ListMessage.cshtml");
        }

        public ActionResult Add()
        {
            return View("~/Areas/FraudDetection/Views/MessageMaster/AddMessage.cshtml");
        }

        public JsonResult GetAllMessages()
        {
            var messages = messMasterService.GetAllMessage(new MessageMasterGetAllCriteria());
            return Json(messages, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult EditMessageStatus(int messageId, bool isActive)
        {
            var criteria = new MessageMasterUpdateStatusCriteria
            {
                CreatorId = 1,
                MessageId = messageId,
                IsActive = isActive
            };

            var result = messMasterService.UpdateMessage(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteMessage(int messageId)
        {
            var criteria = new MessageMasterDeleteCriteria
            {
                CreatorId = 1,
                MessageId = messageId
            };

            var result = messMasterService.DeleteMessage(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult EditMail(int? messageId)
        {
            var criteria = new MessageMasterGetByIdCriteria
            {
                MessageId = messageId == null ? 0 : (int)messageId
            };

            var mail = messMasterService.GetMessageById(criteria);
            //var viewModel = GenerateMailMasterModel(mail);

            return View("~/Areas/FraudDetection/Views/MessageMaster/AddMessage.cshtml", mail);
        }
    }
}