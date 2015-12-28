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
    using Core.Business;
    using Core.Web.Attribute;
    using FD.Lib.Criteria.MailMaster;
    using FD.Lib.DTO;
    using FD.Lib.Service.Implement;
    using MailDelivery.Admin.Messaging.ManageMail;
    using MailDelivery.Admin.Messaging.ManageRecipient;
    using MailDelivery.Admin.Services.Mail;
    using MailDelivery.Admin.Services.Recipient;
    using NAP.FraudDetection.Controllers;
    using Service.Core;

    /// <summary>
    /// The controller of mail master.
    /// </summary>
    public class MailMasterController : BaseController
    {
        private readonly MailMasterService _mailMasterService;

        private readonly IMailService _mailService;

        private readonly IRecipientService _recipientService;

        public MailMasterController()
        {
            _mailMasterService = new MailMasterService();
            _mailService = new MailService();
            _recipientService = new RecipientService();
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
                var mailListRequest = GenerateMailListRequest(criteria.MailCode);
                var mailListResponse = _mailService.GetMailList(mailListRequest);
                if (mailListResponse.MailModels.Count > 0)
                {
                    return Json(new { ErrCode = 1, IsSuccessful = false, Message = "This Mail Master has existed!" }, JsonRequestBehavior.AllowGet);
                }

                var mailRegisterRequest = GenerateFunctionMailRequest(criteria);
                var mailRegisterResponse = _mailService.CreateFunctionMail(mailRegisterRequest);
                if (mailRegisterResponse.ErrCode > 0)
                {
                    return Json(new { mailRegisterResponse.ErrCode, IsSuccessful = false, Message = mailRegisterResponse.ErrMsg }, JsonRequestBehavior.AllowGet);
                }

                mailListResponse = _mailService.GetMailList(mailListRequest);
                criteria.CreatorId = 1;
                criteria.MailingListId = mailListResponse.MailModels[0].MailId;
                var result = _mailMasterService.InsertMail(criteria);

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

        private GetMailListRequest GenerateMailListRequest(string mailName)
        {
            return new GetMailListRequest
            {
                MailName = mailName,
                Status = 1,
                TriggerType = -1,
                SiteId = int.Parse(ConfigurationManager.AppSettings["SiteId"])
            };
        }

        private string GenerateRecipientIdList(string emailList)
        {
            var emails = emailList.Split(';');
            var emailIds = string.Empty;
            foreach (var email in emails)
            {
                var recipientInfoRequest = new GetRecipientListRequest { Emails = email };
                var recipientInfoResponse = _recipientService.GetRecipientList(recipientInfoRequest);
                if (recipientInfoResponse.RecipientModels.Count <= 0)
                {
                    _recipientService.CreateRecipient(new CreateRecipientRequest
                    {
                        Email1 = email,
                        Status = true
                    });
                    recipientInfoResponse = _recipientService.GetRecipientList(recipientInfoRequest);
                }
                emailIds += recipientInfoResponse.RecipientModels[0].EmailId1 + ",";
            }

            return emailIds.Remove(emailIds.Length - 1);
        }

        private CreateFunctionMailRequest GenerateFunctionMailRequest(MailMasterInsertCriteria criteria)
        {
            return new CreateFunctionMailRequest
            {
                MailName = criteria.MailCode,
                Description = criteria.MailDesc,
                MailTo = string.IsNullOrEmpty(criteria.To) ? string.Empty : GenerateRecipientIdList(criteria.To),
                MailCc = string.IsNullOrEmpty(criteria.CcTo) ? string.Empty : GenerateRecipientIdList(criteria.CcTo),
                MailBcc = string.IsNullOrEmpty(criteria.BccTo) ? string.Empty : GenerateRecipientIdList(criteria.BccTo),
                GroupId = int.Parse(ConfigurationManager.AppSettings["MailGroupId"]),
                SiteId = int.Parse(ConfigurationManager.AppSettings["SiteId"]),
                IsActive = true,

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
            var mailListRequest = GenerateMailListRequest(mailMasterInfo.MailCode);
            var mailListResponse = _mailService.GetMailList(mailListRequest);
            var mailMasterUpdateCriteria = new MailMasterUpdateCriteria
            {
                IsActive = mailMasterInfo.IsActive,
                MailCode = mailMasterInfo.MailCode,
                MailContent = mailMasterInfo.MailContent,
                MailDesc = mailMasterInfo.MailDesc,
                MailId = mailMasterInfo.MailId,
                MailingListId = mailMasterInfo.MailingListId,
                MailSubject = mailMasterInfo.MailSubject,
                To = mailListResponse.MailModels[0].MailTo,
                CcTo = mailListResponse.MailModels[0].MailCc,
                BccTo = mailListResponse.MailModels[0].MailBcc
            };

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
            var updateMailRequest = GenerateUpdateMailRequest(criteria);
            var updateMailResponse = _mailService.UpdateFunctionMail(updateMailRequest);
            if (updateMailResponse.ErrCode > 0)
            {
                return Json(new { updateMailResponse.ErrCode, IsSuccessful = false, Message = updateMailResponse.ErrMsg }, JsonRequestBehavior.AllowGet);
            }

            criteria.CreatorId = 1;
            var result = _mailMasterService.UpdateMail(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        private UpdateFunctionMailRequest GenerateUpdateMailRequest(MailMasterUpdateCriteria criteria)
        {
            var a = new UpdateFunctionMailRequest
            {
                MailId = criteria.MailingListId,
                MailName = criteria.MailCode,
                Description = criteria.MailDesc,
                MailTo = string.IsNullOrEmpty(criteria.To) ? string.Empty : GenerateRecipientIdList(criteria.To),
                MailCc = string.IsNullOrEmpty(criteria.CcTo) ? string.Empty : GenerateRecipientIdList(criteria.CcTo),
                MailBcc = string.IsNullOrEmpty(criteria.BccTo) ? string.Empty : GenerateRecipientIdList(criteria.BccTo),
                GroupId = int.Parse(ConfigurationManager.AppSettings["MailGroupId"]),
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

        protected override void Dispose(bool disposing)
        {
            _mailService.Dispose();
            base.Dispose(disposing);
        }

        #endregion
    }
}