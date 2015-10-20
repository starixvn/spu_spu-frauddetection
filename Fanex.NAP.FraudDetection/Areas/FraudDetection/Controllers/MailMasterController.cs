// --------------------------------------------------------------------------
// <copyright file="MailMasterController.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Aarom.Cao" date="2015.06.09">Created</change>
//   <change who="Long.Luu" date="2015.07.24">Refactored</change>
// </history>

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using System.Linq;
    using System.Web.Mvc;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.FraudDetection.Service.Core;
    using FD.Lib.Criteria.MailMaster;
    using FD.Lib.Service.Implement;
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
                criteria.CreatorId = 1;
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
            var viewModel = new MailMasterUpdateCriteria
            {
                IsActive = mail.IsActive,
                MailCode = mail.MailCode,
                MailContent = mail.MailContent,
                MailDesc = mail.MailDesc,
                MailId = mail.MailId,
                MailingListId = mail.MailingListId,
                MailSubject = mail.MailSubject
            };

            return View("~/Areas/FraudDetection/Views/MailMaster/MailMasterEdit.cshtml", viewModel);
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
            if (ModelState.IsValid)
            {
                criteria.CreatorId = 1;
                var result = _mailMasterService.UpdateMail(criteria);

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
    }
}