// ----------------------------------------------------------------------
// <copyright file="BaseController.cs" company="Nexcel Solutions Vietnam">
//     Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// ------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015/04/22">Created</change>
//   <change who="" date=""></change>
// </history>

namespace Fanex.NAP.FraudDetection.Controllers
{
    using System.Web.Mvc;
    using Fanex.NAP.Core.Configuration;
    using Fanex.NAP.Core.Service.Impl;
    using Fanex.NAP.Core.Service.Interface;
    using Fanex.NAP.Core.Web.Context;
    using Fanex.NAP.Core.Web.Session;

    /// <summary>
    /// Base controller.
    /// </summary>
    public class BaseController : Controller
    {
        private readonly string _environment = NapSettings.Settings == null ? string.Empty : NapSettings.Settings.Environment;
        private readonly int _siteId = NapSettings.Settings == null ? 0 : NapSettings.Settings.SiteId;
        private readonly bool _isSiteLogin = NapSettings.Settings == null ? false : NapSettings.Settings.EnableDirectLogin;

        public BaseController()
        {
            CurrentContext = new CurrentContext();

            if (NapSettings.Settings != null)
            {
                CurrentSession = new CurrentSession();
                ViewBag.Session = CurrentSession;
                ServiceContext = new ServiceContext
                {
                    UserId = CurrentSession.UserId,
                    Ip = CurrentContext.IP
                };
            }
        }

        public int SiteId
        {
            get { return _siteId; }
        }

        public bool IsSiteLogin
        {
            get { return _isSiteLogin; }
        }

        public string Environment
        {
            get { return _environment; }
        }

        public IServiceContext ServiceContext
        {
            get;
            set;
        }

        public ICurrentContext CurrentContext
        {
            get;
            set;
        }

        public ICurrentSession CurrentSession
        {
            get;
            set;
        }
    }
}