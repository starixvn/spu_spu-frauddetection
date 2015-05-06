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
    using System.IO;

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

        /// <summary>
        /// Return the HTML string of a View.
        /// </summary>
        /// <param name="context">Controller context.</param>
        /// <param name="viewPath">View path.</param>
        /// <param name="viewModel">View model.</param>
        /// <param name="partial">View partial.</param>
        /// <returns>HTML string.</returns>
        public string RenderViewToString(
            ControllerContext context,
            string viewPath,
            object viewModel = null,
            bool partial = false)
        {
            ViewEngineResult viewEngineResult = null;
            if (partial)
            {
                viewEngineResult = ViewEngines.Engines.FindPartialView(context, viewPath);
            }
            else
            {
                viewEngineResult = ViewEngines.Engines.FindView(context, viewPath, null);
            }

            if (viewEngineResult == null)
                throw new FileNotFoundException("View cannot be found.");

            // get the view and attach the model to view data
            var view = viewEngineResult.View;
            context.Controller.ViewData.Model = viewModel;

            string htmlStringFromView = string.Empty;
            using (var stringWriter = new StringWriter())
            {
                var viewContext = new ViewContext(context, view,
                                            context.Controller.ViewData,
                                            context.Controller.TempData,
                                            stringWriter);
                view.Render(viewContext, stringWriter);
                htmlStringFromView = stringWriter.ToString();
            }

            return htmlStringFromView;
        }

    }
}