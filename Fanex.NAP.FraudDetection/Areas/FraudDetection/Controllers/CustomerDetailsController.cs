// --------------------------------------------------------------------------
// <copyright file="CustomerDetailsController.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015.12.11">Created</change>
// </history>

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using Core.Business;
    using Core.Service.Impl;
    using Core.Web.Attribute;
    using FD.Lib.Criteria.Reports.CustomerDetails;
    using FD.Lib.Service.Implement;
    using NAP.FraudDetection.Controllers;
    using Service;
    using Service.Core;
    using Service.Utilities;
    using System;
    using System.Linq;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Web.Mvc;
    using System.Web.SessionState;

    /// <summary>
    /// The controller of Customer Details Report.
    /// </summary>
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class CustomerDetailsController : BaseController
    {
        private readonly CustomerDetailsReportService _customerDetailsReportService;

        public CustomerDetailsController()
        {
            _customerDetailsReportService = new CustomerDetailsReportService();
        }

        /// <summary>
        /// Main page.
        /// </summary>
        /// <returns>The ActionResult.</returns>
        [NapAuth(FunctionKey = FDFunctionKeys.SuspiciousCustomer, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            return View("~/Areas/FraudDetection/Views/Reports/CustomerDetailsReport.cshtml");
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.SuspiciousCustomer, Policy = Constant.Policy.Read)]
        public ActionResult GetCustInfoById(int custId)
        {
            var criteria = new CustomerDetailsReportCustInfoCriteria(custId);
            var custInfo = _customerDetailsReportService.GetCustomerInfo(criteria);

            return Json(custInfo, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.SuspiciousCustomer, Policy = Constant.Policy.Read)]
        public ActionResult GetFraudCaseDetails(int custId, DateTime fromDate, DateTime toDate)
        {
            var criteria = new CustomerDetailsReportFraudCaseCriteria(custId, fromDate, toDate);
            var fraudCaseDetails = _customerDetailsReportService.GetFraudCasesDetails(criteria);

            return Json(fraudCaseDetails, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.SuspiciousCustomer, Policy = Constant.Policy.Read)]
        public ActionResult GetLogNotes(int custId)
        {
            var criteria = new CustomerDetailsReportLogNoteCriteria(custId);
            var logNotes = _customerDetailsReportService.GetLogsNotes(criteria);
            var users = GetAllUsers();

            foreach (var logNote in logNotes)
            {
                if (logNote.AuthorName == null)
                {
                    logNote.AuthorName = users.Where(t => t.Id == logNote.AuthorId).FirstOrDefault().Username;
                }
            }

            return Json(logNotes, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.SuspiciousCustomer, Policy = Constant.Policy.Read)]
        public ActionResult GetWinlossStatistic(int custId, DateTime fromDate, DateTime toDate)
        {
            var criteria = new CustomerDetailsReportWinlossStatisticCriteria(custId, fromDate, toDate);
            var result = _customerDetailsReportService.GetWinlossStatistic(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.SuspiciousCustomer, Policy = Constant.Policy.Read)]
        public ActionResult GetDailyViolatedTickets(int custId, DateTime fromDate, DateTime toDate)
        {
            var result = _customerDetailsReportService.GetFraudTickets(custId, fromDate, toDate);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.SuspiciousCustomer, Policy = Constant.Policy.Read)]
        public ActionResult AddNote(int custId, string note)
        {
            var criteria = new CustomerNoteInsertCriteria
            {
                CustId = custId,
                AuthorId = AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0,
                CaseId = 0,
                LogDesc = note
            };

            var result = _customerDetailsReportService.InsertCustomerNote(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.SuspiciousCustomer, Policy = Constant.Policy.Read)]
        public ActionResult VerifyCustomer(int custId, int caseId)
        {
            var criteria = new CustomerVerifyInsertCriteria
            {
                CustId = custId,
                AuthorId = AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0,
                CaseId = caseId,
                AuthorName = AppSession.CurrentUser != null ? AppSession.CurrentUser.Username : string.Empty
            };

            var result = _customerDetailsReportService.InsertCustomerLog(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.SuspiciousCustomer, Policy = Constant.Policy.Read)]
        public ActionResult UpdateDelinquency(int custId, bool isDelinquent)
        {
            var criteria = new CustomerDelinquentUpdateCriteria
            {
                CustId = custId,
                AuthorId = AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0,
                IsDelinquent = isDelinquent
            };

            var result = _customerDetailsReportService.UpdateCustomerDelinquent(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.SuspiciousCustomer, Policy = Constant.Policy.Read)]
        public ActionResult UpdateHedgeAccount(int custId, bool isHedge)
        {
            var criteria = new CustomerHedgeUpdateCriteria
            {
                CustId = custId,
                AuthorId = AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0,
                IsHedge = isHedge
            };

            var result = _customerDetailsReportService.UpdateCustomerHedge(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.SuspiciousCustomer, Policy = Constant.Policy.Host)]
        public ActionResult GetUsers()
        {
            var result = GetAllUsers();

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.SuspiciousCustomer, Policy = Constant.Policy.Read)]
        public ActionResult GetAssigneesById(int custId)
        {
            var assignees = _customerDetailsReportService.GetAssignees(new CustomerDetailsAssigneesGetByIdCriteria
            {
                CustId = custId
            });

            return Json(assignees, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.SuspiciousCustomer, Policy = Constant.Policy.Host)]
        public ActionResult InsertAssignees(int custId, string assignees)
        {
            var criteria = new CustomerDetailsAssigneesInsertCriteria
            {
                CustId = custId,
                Assignees = assignees,
                AuthorId = AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0
            };

            var result = _customerDetailsReportService.InsertAssignees(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.SuspiciousCustomer, Policy = Constant.Policy.Read)]
        public ActionResult GetHostPermission()
        {
            var permission = PermissionService.HasHostPermission(FDFunctionKeys.SuspiciousCustomer);

            return Json(permission, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.RemoveLogNote, Policy = Constant.Policy.Host)]
        public ActionResult RemoveCustomerLog(int customerLogId)
        {
            var criteria = new CustomerLogNoteRemoveCriteria
            {
                CustomerLogId = customerLogId,
                CreatorId = AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0
            };

            var result = _customerDetailsReportService.RemoveCustomerLogNote(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = FDFunctionKeys.SuspiciousCustomer, Policy = Constant.Policy.Read)]
        public ActionResult GetRemoveLogNotePermission()
        {
            var permission = PermissionService.HasHostPermission(FDFunctionKeys.RemoveLogNote);

            return Json(permission, JsonRequestBehavior.AllowGet);
        }

        private List<Core.Domain.IUser> GetAllUsers()
        {
            const string FunctionKey = FDFunctionKeys.SuspiciousCustomer;
            var siteId = int.Parse(ConfigurationManager.AppSettings["SiteId"]);
            var suspiciousCustomerFunction = new FunctionService().GetByKeyAndSite(FunctionKey, siteId);
            var users = new UserService().GetByFunctionAndSite(suspiciousCustomerFunction.Id, siteId);
            var result = new List<Core.Domain.IUser>();

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