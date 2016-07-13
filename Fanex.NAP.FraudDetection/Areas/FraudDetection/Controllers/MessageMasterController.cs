
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
    using Fanex.NAP.FraudDetection.Service.Core;
    using System.Configuration;
    using Fanex.NAP.Core.Service.Impl;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Model;

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
                IsActive = model.IsActive,
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

        [HttpPost]
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

        [HttpGet]
        public ActionResult EditMessage(int? messageId)
        {
            var criteria = new MessageMasterGetByIdCriteria
            {
                MessageId = messageId == null ? 0 : (int)messageId
            };

            var message = messMasterService.GetMessageById(criteria);
            message.UsernameRecipient = MapIdToUsername(message.Recipient);
            message.UsernameOnlineRecipient = MapIdToUsername(message.OnlineRecipient);

            return View("~/Areas/FraudDetection/Views/MessageMaster/EditMessage.cshtml", message);
        }

        [HttpPost]
        public ActionResult EditMessage(MessageMaster model)
        {
            var criteria = new MessageMasterUpdateCriteria() 
            {
                MessageId = model.MessageId,
                MessageCode = model.MessageCode,
                MessageDesc = model.MessageDesc,
                MessageContent = model.MessageContent,
                Recipient = model.Recipient,
                IsActive = model.IsActive,
                OnlineRecipient = model.OnlineRecipient
            };

            var result = messMasterService.UpdateMessage(criteria);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAllUsers()
        {
            var result = GetUsers();
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        private string MapIdToUsername(string listId)
        {
            var idArray = listId.Split(';');
            var users = GetUsers();
            string result = string.Empty;

            foreach (var item in idArray)
            {
                if (item != string.Empty)
                {
                    result += users.SingleOrDefault(x => x.Id == int.Parse(item)).Username + ';';
                }
            }

            return result;
        }

        private List<User> GetUsers()
        {
            const string FunctionKey = FDFunctionKeys.SuspiciousCustomer;
            var siteId = int.Parse(ConfigurationManager.AppSettings["SiteId"]);
            var notificationFunction = new FunctionService().GetByKeyAndSite(FunctionKey, siteId);
            var users = new UserService().GetByFunctionAndSite(notificationFunction.Id, siteId);
            var result = new List<User>();

            foreach (var user in users)
            {
                if (user.Policy != (decimal)Constant.Policy.Read && user.Policy != (decimal)Constant.Policy.Host)
                {
                    continue;
                }

                if (user.User.Group == null)
                {
                    result.Add(user.User);
                }
                else if (!user.User.Group.Name.Equals("IT"))
                {
                    result.Add(user.User);
                }
            }

            return result;
        }
    }
}