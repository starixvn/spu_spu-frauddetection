// --------------------------------------------------------------------------
// <copyright file="MailMasterController.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Aarom.Cao" date="2015.06.09">Created</change>
// </history>

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using System.Web.Mvc;
    using NAP.FraudDetection.Controllers;
    using SPU.Lib.FraudDetection.Criteria.MailMaster;
    using SPU.Lib.FraudDetection.Service.Implement;

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

        public ActionResult Index()
        {
            return View("~/Areas/FraudDetection/Views/MailMaster/MailMasterList.cshtml");
        }

        public ActionResult Add()
        {
            return View("~/Areas/FraudDetection/Views/MailMaster/MailMasterAdd.cshtml");
        }

        /// <summary>
        /// The method to get all mail templates.
        /// </summary>
        /// <returns>The ActionResult.</returns>
        [HttpGet]
        public ActionResult Search()
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
        public ActionResult AddNewMail(MailMasterInsertCriteria criteria)
        {
            if (ModelState.IsValid)
            {
                criteria.CreatorId = 1;
                var result = _mailMasterService.InsertMail(criteria);

                if (result.IsSuccessful)
                {
                    return RedirectToAction("Index");
                }
                else
                {
                    ModelState.AddModelError("error", result.Message);
                }
            }

            return View("~/Areas/FraudDetection/Views/MailMaster/MailMasterAdd.cshtml");
        }

        /// <summary>
        /// Delete mail template.
        /// </summary>
        /// <param name="mailId">The Mail ID.</param>
        /// <returns>The ActionResult.</returns>
        [HttpPost]
        public ActionResult DeleteMail(int mailId)
        {
            var criteria = new MailMasterDeleteCriteria()
            {
                CreatorId = 1,
                MailId = mailId
            };

            var result = _mailMasterService.DeleteMail(criteria);

            return new JsonResult { Data = new { ErrCode = result.Code, ErrMsg = result.Message } };
        }

        /// <summary>
        /// Update mail template.
        /// </summary>
        /// <param name="mailId">The Mail ID.</param>
        /// <returns>The ActionResult.</returns>
        public ActionResult Update(int? mailId)
        {
            var criteria = new MailMasterGetByIdCriteria()
            {
                MailId = mailId == null ? 0 : (int)mailId
            };
            var mail = _mailMasterService.GetMailById(criteria);
            var model = new MailMasterUpdateCriteria()
            {
                IsActive = mail.IsActive,
                MailCode = mail.MailCode,
                MailContent = mail.MailContent,
                MailDesc = mail.MailDesc,
                MailId = mail.MailId,
                MailingListId = mail.MailingListId,
                MailSubject = mail.MailSubject
            };

            return View("~/Areas/FraudDetection/Views/MailMaster/MailMasterUpdate.cshtml", model);
        }

        /// <summary>
        /// Update mail template.
        /// </summary>
        /// <param name="criteria">The criteria.</param>
        /// <returns>The ActionResult.</returns>
        [HttpPost]
        [ValidateInput(false)]
        public ActionResult UpdateMail(MailMasterUpdateCriteria criteria)
        {
            if (ModelState.IsValid)
            {
                criteria.CreatorId = 1;

                var result = _mailMasterService.UpdateMail(criteria);

                if (result.IsSuccessful)
                {
                    return RedirectToAction("Index");
                }
                else
                {
                    ModelState.AddModelError("error", result.Message);
                }
            }

            return View("~/Areas/FraudDetection/Views/MailMaster/MailMasterUpdate.cshtml");
        }

        /// <summary>
        /// Activate mail template.
        /// </summary>
        /// <param name="mailId">The Mail ID.</param>
        /// <param name="isActive">True or False.</param>
        /// <returns>The ActionResult.</returns>
        [HttpPost]
        public ActionResult ActivateMail(int mailId, bool isActive)
        {
            var criteria = new MailMasterActivateCriteria()
            {
                CreatorId = 1,
                MailId = mailId,
                IsActive = isActive
            };

            var result = _mailMasterService.UpdateMail(criteria);

            return new JsonResult { Data = new { ErrCode = result.Code, ErrMsg = result.Message } };
        }
    }
}