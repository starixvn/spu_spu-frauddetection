namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using FD.Lib.BusinessManager.MessageGenerator;
    using FD.Lib.Criteria.Notification;
    using FD.Lib.DTO;
    using FD.Lib.Service.Implement;
    using NAP.FraudDetection.Controllers;
    using NAP.FraudDetection.Service;
    using System.Linq;
    using System.Web.Mvc;

    /// <summary>
    /// The NotificationController.
    /// </summary>
    public class NotificationController : BaseController
    {
        private readonly NotificationService _notificationService;

        public NotificationController()
        {
            _notificationService = new NotificationService();
        }

        #region List Notify Messages
        [HttpPost]
        public JsonResult ReCheckNotification(bool updateStatus)
        {
            var userId = AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0;
            var rawMessages = _notificationService.GetMessageByUserId(new NotificationMessageByUserIdGetCriteria { UserId = userId, GetTop = 10 }).ToList();
            if (updateStatus)
            {
                _notificationService.UpdateAllMessageStatusByUserId(new NotificationMessageByUserIdUpdateCriteria { UserId = userId, IsViewed = true });
            }

            var formattedMessages = (new MessageGenerator()).GenerateMessages(rawMessages);
            var numNewMessage = rawMessages[0].UnreadMsgCount;

            return Json(new { MessageList = formattedMessages, NumNewMessage = numNewMessage }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        
        #region List Fraud Case's Details
        /// <summary>
        /// Fanex.NAP.FraudDetection
        /// </summary>
        /// <returns>Action Result.</returns>
        [HttpGet]
        public ActionResult Index()
        {
            return View("~/Areas/FraudDetection/Views/Notification/MessageList.cshtml");
        }

        /// <summary>
        /// Display all messages by UserId.
        /// </summary>
        /// <returns>Represents a JSON-formatted content for displaying.</returns>
        [HttpPost]
        public JsonResult GetAllMessages()
        {
            var userId = AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0;
            var rawMessages = _notificationService.GetMessageByUserId(new NotificationMessageByUserIdGetCriteria { UserId = userId, GetTop = -1 }).ToList();
            var formattedMessages = (new MessageGenerator()).GenerateMessages(rawMessages);

            return Json(formattedMessages, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}
