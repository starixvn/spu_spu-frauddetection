
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
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.Framework.Command;

    public class MessageMasterController : BaseController
    {
        private readonly MessageMasterService messMasterService;

        public MessageMasterController()
        {
            messMasterService = new MessageMasterService();
        }

        [NapAuth(FunctionKey = FDFunctionKeys.MessageMaster, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            return View("~/Areas/FraudDetection/Views/MessageMaster/ListMessage.cshtml");
        }

        [NapAuth(FunctionKey = FDFunctionKeys.MessageMaster, Policy = Constant.Policy.Host)]
        public string AddMessage()
        {
            return RenderViewToString(ControllerContext, "~/Areas/FraudDetection/Views/MessageMaster/AddMessage.cshtml");
        }

        [NapAuth(FunctionKey = FDFunctionKeys.MessageMaster, Policy = Constant.Policy.Host)]
        [HttpPost]
        public JsonResult AddMessage(MessageMaster model)
        {
            JsonResult returnResult = new JsonResult();
            var errorMessage = string.Empty;

            if (ModelState.IsValid)
            {
                if (model.Recipient != null || model.OnlineRecipient != null)
                {
                    MessageMasterInsertCriteria criteria = new MessageMasterInsertCriteria()
                    {
                        MessageCode = model.MessageCode,
                        MessageDesc = model.MessageDesc,
                        MessageContent = model.MessageContent,
                        Recipient = model.Recipient == null ? "" : model.Recipient,
                        IsActive = model.IsActive,
                        OnlineRecipient = model.OnlineRecipient == null ? "" : model.OnlineRecipient
                    };

                    ICommandResult result = messMasterService.InsertMessage(criteria);
                    returnResult = Json(result, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    errorMessage = "Recipient Required";
                    returnResult = new JsonResult { Data = new { IsSuccessful = false, Message = errorMessage } };
                }
            }
            else
            {
                foreach (var value in ModelState.Values.Where(value => value.Errors.Count > 0))
                {
                    errorMessage = value.Errors[0].ErrorMessage;
                    break;
                }

                returnResult = new JsonResult{ Data = new { IsSuccessful = ModelState.IsValid, Message = errorMessage }};
            }

            return returnResult;
        }

        [NapAuth(FunctionKey = FDFunctionKeys.MessageMaster, Policy = Constant.Policy.Read)]
        public JsonResult GetAllMessages()
        {
            var messages = messMasterService.GetAllMessage(new MessageMasterGetAllCriteria());
            return Json(messages, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = FDFunctionKeys.MessageMaster, Policy = Constant.Policy.Host)]
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

        [NapAuth(FunctionKey = FDFunctionKeys.MessageMaster, Policy = Constant.Policy.Host)]
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

        [NapAuth(FunctionKey = FDFunctionKeys.MessageMaster, Policy = Constant.Policy.Read)]
        [HttpGet]
        public string EditMessage(int messageId)
        {
            var criteria = new MessageMasterGetByIdCriteria
            {
                MessageId = messageId == null ? 0 : (int)messageId
            };

            var message = messMasterService.GetMessageById(criteria);
            message.UsernameRecipient = MapIdToUsername(message.Recipient);
            message.UsernameOnlineRecipient = MapIdToUsername(message.OnlineRecipient);

            return RenderViewToString(ControllerContext, "~/Areas/FraudDetection/Views/MessageMaster/EditMessage.cshtml", message);
        }

        [NapAuth(FunctionKey = FDFunctionKeys.MessageMaster, Policy = Constant.Policy.Host)]
        [HttpPost]
        public ActionResult EditMessage(MessageMaster model)
        {
            JsonResult returnResult = new JsonResult();
            var errorMessage = string.Empty;

            if (ModelState.IsValid)
            {
                if (model.Recipient != null || model.OnlineRecipient != null)
                {
                    var criteria = new MessageMasterUpdateCriteria()
                    {
                        MessageId = model.MessageId,
                        MessageCode = model.MessageCode,
                        MessageDesc = model.MessageDesc,
                        MessageContent = model.MessageContent,
                        Recipient = model.Recipient == null ? "" : model.Recipient,
                        IsActive = model.IsActive,
                        OnlineRecipient = model.OnlineRecipient == null ? "" : model.OnlineRecipient
                    };

                    ICommandResult result = messMasterService.UpdateMessage(criteria);
                    returnResult = Json(result, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    errorMessage = "Recipient Required";
                    returnResult = new JsonResult { Data = new { IsSuccessful = false, Message = errorMessage } };
                }
            }
            else
            {
                foreach (var value in ModelState.Values.Where(value => value.Errors.Count > 0))
                {
                    errorMessage = value.Errors[0].ErrorMessage;
                    break;
                }

                returnResult = new JsonResult { Data = new { IsSuccessful = ModelState.IsValid, Message = errorMessage } };
            }

            return returnResult;
        }

        [NapAuth(FunctionKey = FDFunctionKeys.MessageMaster, Policy = Constant.Policy.Read)]
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
                    var filteredItem = users.SingleOrDefault(x => x.Id == int.Parse(item));
                    if (filteredItem != null)
                    {
                        result += filteredItem.Username + ';';
                    }
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
                if (user.Policy != (decimal)Constant.Policy.Read &&
                    user.Policy != (decimal)Constant.Policy.Host)
                {
                    continue;
                }

                result.Add(new User() 
                { 
                    Id = user.User.Id, 
                    Username = user.User.Username 
                });
                //if (user.User.Group == null)
                //{
                //    result.Add(user.User);
                //}
                //else if (!user.User.Group.Name.Equals("IT"))
                //{
                //    result.Add(user.User);
                //}
            }

            return result;
        }
    }
}