// --------------------------------------------------------------------------
// <copyright file="MailMasterController.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Aarom.Cao" date="2015.06.09">Created</change>
//   <change who="Long.Luu" date="2015.07.24">Refactored</change>
//   <change who="Long.Luu" date="2015.11.04">Modify to receive emails from user</change>
// </history>

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using System.Configuration;
    using System.Linq;
    using System.Web.Mvc;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.FraudDetection.Service.Core;
    using FD.Lib.Criteria.MailMaster;
    using FD.Lib.DTO;
    using FD.Lib.Service.Implement;
    using MailDelivery.Admin.Handlers;
    using MailDelivery.Client.Messages.MailManage;
    using MailDelivery.Client.Messages.Recipient;
    using MailDelivery.Client.Models;
    using NAP.FraudDetection.Controllers;

    /// <summary>
    /// The controller of mail master.
    /// </summary>
    public class MailMasterController : BaseController
    {
        private readonly MailMasterService _mailMasterService;

        public MailMasterController()
        {
            _mailMasterService = new MailMasterService();
        }

        [NapAuth(FunctionKey = FDFunctionKeys.MailMaster, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            return View("~/Areas/FraudDetection/Views/MailMaster/MailMasterList.cshtml");
        }

        [NapAuth(FunctionKey = FDFunctionKeys.MailMaster, Policy = Constant.Policy.Host)]
        public ActionResult AddMail()
        {
            return View("~/Areas/FraudDetection/Views/MailMaster/MailMasterAdd.cshtml");
        }

        #region Mail List

        /// <summary>
        /// The method to get all mail templates.
        /// </summary>
        /// <returns>The ActionResult.</returns>
        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.MailMaster, Policy = Constant.Policy.Read)]
        public ActionResult GetAllMails()
        {
            var criteria = new MailMasterGetAllCriteria();
            var mailTemplates = _mailMasterService.GetMails(criteria);

            return Json(mailTemplates, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Add Mail
        /// <summary>
        /// Add new mail template.
        /// </summary>
        /// <param name="criteria">The criteria.</param>
        /// <returns>The ActionResult.</returns>
        [HttpPost]
        [ValidateInput(false)]
        [NapAuth(FunctionKey = FDFunctionKeys.MailMaster, Policy = Constant.Policy.Host)]
        public ActionResult AddMail(MailMasterInsertCriteria criteria)
        {
            if (ModelState.IsValid)
            {
                MailAdminHandler.Start();
                var mailModel = MailAdminHandler.RequestGetMailMessage(criteria.MailCode);
                if (mailModel.Count > 0)
                {
                    MailAdminHandler.Stop();
                    return Json(new { ErrCode = 1, IsSuccessful = false, Message = "This Mail Master has existed!" }, JsonRequestBehavior.AllowGet);
                }

                var mailRegisterResult = MailAdminHandler.RequestCreateMailMessage(GenerateInsertMailModel(criteria));
                if (mailRegisterResult.ErrCode > 0)
                {
                    MailAdminHandler.Stop();
                    return Json(new { mailRegisterResult.ErrCode, IsSuccessful = false, Message = mailRegisterResult.ErrMsg }, JsonRequestBehavior.AllowGet);
                }

                var mailInfo = MailAdminHandler.RequestGetMailMessage(criteria.MailCode);
                criteria.CreatorId = 1;
                criteria.MailingListId = mailInfo[0].MailId;
                var result = _mailMasterService.InsertMail(criteria);
                MailAdminHandler.Stop();

                return Json(result, JsonRequestBehavior.AllowGet);
            }

            var errorMessage = string.Empty;
            foreach (var value in ModelState.Values.Where(value => value.Errors.Count > 0))
            {
                errorMessage = value.Errors[0].ErrorMessage;
                break;
            }

            return new JsonResult { Data = new { IsSuccessful = ModelState.IsValid, Message = errorMessage } };
        }

        private string GenerateRecipientIdList(string emailList)
        {
            var emails = emailList.Split(';');
            var emailIds = string.Empty;
            foreach (var email in emails)
            {
                var recipientInfo = MailAdminHandler.RequestGetRecipientMessage(email);
                if (recipientInfo.Count <= 0)
                {
                    MailAdminHandler.RequestCreateRecipientMessage(new CreateRecipientMessage
                        {
                            Email1 = email,
                            Status = true
                        });
                    recipientInfo = MailAdminHandler.RequestGetRecipientMessage(email);
                }

                emailIds += recipientInfo[0].EmailID1 + ",";
            }

            return emailIds.Remove(emailIds.Length - 1);
        }

        private CreateMailMessage GenerateInsertMailModel(MailMasterInsertCriteria criteria)
        {
            return new CreateMailMessage
                {
                    MailName = criteria.MailCode,
                    Description = criteria.MailDesc,
                    MailFrom = "Fraud Sensor",
                    MailTo = string.IsNullOrEmpty(criteria.To) ? string.Empty : GenerateRecipientIdList(criteria.To),
                    MailCc = string.IsNullOrEmpty(criteria.CcTo) ? string.Empty : GenerateRecipientIdList(criteria.CcTo),
                    MailBcc = string.IsNullOrEmpty(criteria.BccTo) ? string.Empty : GenerateRecipientIdList(criteria.BccTo),
                    MailGroupId = int.Parse(ConfigurationManager.AppSettings["MailGroupId"]),
                    SiteId = int.Parse(ConfigurationManager.AppSettings["SiteId"]),
                    IsActive = true
                };
        }

        #endregion

        #region Delete Mail

        /// <summary>
        /// Delete mail template.
        /// </summary>
        /// <param name="mailId">The Mail ID.</param>
        /// <returns>The ActionResult.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = FDFunctionKeys.MailMaster, Policy = Constant.Policy.Host)]
        public ActionResult DeleteMail(int mailId)
        {
            var criteria = new MailMasterDeleteCriteria
            {
                CreatorId = 1,
                MailId = mailId
            };

            var result = _mailMasterService.DeleteMail(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Edit Mail
        /// <summary>
        /// Edit mail template.
        /// </summary>
        /// <param name="mailId">The Mail ID.</param>
        /// <returns>The ActionResult.</returns>
        [NapAuth(FunctionKey = FDFunctionKeys.MailMaster, Policy = Constant.Policy.Read)]
        public ActionResult EditMail(int? mailId)
        {
            var criteria = new MailMasterGetByIdCriteria
            {
                MailId = mailId == null ? 0 : (int)mailId
            };

            var mail = _mailMasterService.GetMailById(criteria);
            var viewModel = GenerateMailMasterModel(mail);

            return View("~/Areas/FraudDetection/Views/MailMaster/MailMasterEdit.cshtml", viewModel);
        }

        private MailMasterUpdateCriteria GenerateMailMasterModel(MailMasterInfo mailMasterInfo)
        {
            MailAdminHandler.Start();
            var mailInfo = MailAdminHandler.RequestGetMailMessage(mailMasterInfo.MailCode);
            var mailMasterUpdateCriteria = new MailMasterUpdateCriteria
            {
                IsActive = mailMasterInfo.IsActive,
                MailCode = mailMasterInfo.MailCode,
                MailContent = mailMasterInfo.MailContent,
                MailDesc = mailMasterInfo.MailDesc,
                MailId = mailMasterInfo.MailId,
                MailingListId = mailMasterInfo.MailingListId,
                MailSubject = mailMasterInfo.MailSubject,
                To = mailInfo[0].MailTo,
                CcTo = mailInfo[0].MailCc,
                BccTo = mailInfo[0].MailBcc
            };
            MailAdminHandler.Stop();

            return mailMasterUpdateCriteria;
        }

        /// <summary>
        /// Update mail template.
        /// </summary>
        /// <param name="criteria">The criteria.</param>
        /// <returns>The ActionResult.</returns>
        [HttpPost]
        [ValidateInput(false)]
        [NapAuth(FunctionKey = FDFunctionKeys.MailMaster, Policy = Constant.Policy.Host)]
        public ActionResult EditMail(MailMasterUpdateCriteria criteria)
        {
            MailAdminHandler.Start();
            var mailRegisterResult = MailAdminHandler.RequestUpdateMailMessage(GenerateUpdateMailModel(criteria));
            if (mailRegisterResult.ErrCode > 0)
            {
                MailAdminHandler.Stop();
                return Json(new { mailRegisterResult.ErrCode, IsSuccessful = false, Message = mailRegisterResult.ErrMsg }, JsonRequestBehavior.AllowGet);
            }

            criteria.CreatorId = 1;
            var result = _mailMasterService.UpdateMail(criteria);
            MailAdminHandler.Stop();

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        private UpdateMailMessage GenerateUpdateMailModel(MailMasterUpdateCriteria criteria)
        {
            var a = new UpdateMailMessage
            {
                MailId = criteria.MailingListId,
                MailName = criteria.MailCode,
                Description = criteria.MailDesc,
                MailFrom = "Fraud Sensor",
                MailTo = string.IsNullOrEmpty(criteria.To) ? string.Empty : GenerateRecipientIdList(criteria.To),
                MailCc = string.IsNullOrEmpty(criteria.CcTo) ? string.Empty : GenerateRecipientIdList(criteria.CcTo),
                MailBcc = string.IsNullOrEmpty(criteria.BccTo) ? string.Empty : GenerateRecipientIdList(criteria.BccTo),
                MailGroupId = int.Parse(ConfigurationManager.AppSettings["MailGroupId"]),
                SiteId = int.Parse(ConfigurationManager.AppSettings["SiteId"]),
                IsActive = true
            };
            return a;
        }

        /// <summary>
        /// Activate mail template.
        /// </summary>
        /// <param name="mailId">The Mail ID.</param>
        /// <param name="isActive">True or False.</param>
        /// <returns>The ActionResult.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = FDFunctionKeys.MailMaster, Policy = Constant.Policy.Host)]
        public ActionResult EditMailStatus(int mailId, bool isActive)
        {
            var criteria = new MailMasterUpdateStatusCriteria
            {
                CreatorId = 1,
                MailId = mailId,
                IsActive = isActive
            };

            var result = _mailMasterService.UpdateMail(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
        
        #endregion
    }
}