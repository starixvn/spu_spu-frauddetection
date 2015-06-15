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
    using System.Collections.Generic;
    using System.Web.Mvc;
    using NAP.FraudDetection.Controllers;
    using SPU.Lib.FraudDetection.Criteria.MailMaster;
    using SPU.Lib.FraudDetection.DTO;
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
            var mailTemplates = new List<MailMasterInfo>();

            for (var i = 0; i < 20; i++)
            {
                var model = new MailMasterInfo()
                {
                    IsActive = true,
                    MailCode = "Mail_01"
                };
                mailTemplates.Add(model);
            }

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
                //// _mailMasterService.InsertMail(criteria);

                return RedirectToAction("Index");
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
                MailId = mailId
            };

            //// _mailMasterService.DeleteMail(criteria);

            return new JsonResult { Data = new { ErrCode = 1, ErrMsg = "Test choi" } };
        }

        /// <summary>
        /// Update mail template.
        /// </summary>
        /// <param name="mailId">The Mail ID.</param>
        /// <returns>The ActionResult.</returns>
        public ActionResult Update(int? mailId)
        {
            var model = new MailMasterUpdateCriteria()
            {
                MailId = 100,
                IsActive = true,
                MailCode = "Mail_01",
                MailDescription = "Aaron test mail template",
                MailAddressSentTo = "cuong.caohung@gmail.com; aaron.cao@nexcel.vn",
                MailAddressCc = "cuong.caohung@gmail.com; aaron.cao@nexcel.vn",
                MailAddressBcc = "cuong.caohung@gmail.com; aaron.cao@nexcel.vn",
                MailContent = string.Empty,
                MailSubject = "Test"
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
                //// _mailMasterService.UpdateMail(criteria);

                return RedirectToAction("Index");
            }

            return View("~/Areas/FraudDetection/Views/MailMaster/MailMasterUpdate.cshtml");
        }
    }
}