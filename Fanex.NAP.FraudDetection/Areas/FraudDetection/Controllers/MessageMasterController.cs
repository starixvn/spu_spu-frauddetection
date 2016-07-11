
namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using Fanex.NAP.FraudDetection.Controllers;
    using FD.Lib.Criteria.MessageMaster;
    using FD.Lib.Service.Implement;
    using FD.Lib.DTO;
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

        public ActionResult AddMessage()
        {
            return View("~/Areas/FraudDetection/Views/MessageMaster/AddMessage.cshtml");
        }

        [HttpPost]
        public JsonResult AddMessage(MessageMaster model)
        {
            MessageMasterInsertCriteria criteria = new MessageMasterInsertCriteria()
            {
                MessageCode = model.MessageCode,
                MessageDesc = model.MessageDesc,
                MessageContent = model.MessageContent,
                Recipient = model.Recipient,
                OnlineRecipient = model.OnlineRecipient
            };

            var result = messMasterService.InsertMessage(criteria);
            return Json(result, JsonRequestBehavior.AllowGet);

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

        public ActionResult EditMessage(int? messageId)
        {
            var criteria = new MessageMasterGetByIdCriteria
            {
                MessageId = messageId == null ? 0 : (int)messageId
            };

            var message = messMasterService.GetMessageById(criteria);
            //var viewModel = GenerateMailMasterModel(mail);

            return View("~/Areas/FraudDetection/Views/MessageMaster/EditMessage.cshtml", message);
        }

        [HttpPost]
        public JsonResult EditMessage(MessageMaster model)
        {
            MessageMasterUpdateCriteria criteria = new MessageMasterUpdateCriteria() 
            {
                MessageId = model.MessageId,
                MessageCode = model.MessageCode,
                MessageDesc = model.MessageDesc,
                MessageContent = model.MessageContent,
                Recipient = model.Recipient,
                OnlineRecipient = model.OnlineRecipient
            };

            var result = messMasterService.UpdateMessage(criteria);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}