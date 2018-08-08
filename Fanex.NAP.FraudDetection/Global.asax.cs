namespace Fanex.NAP.FraudDetection
{
    using Fanex.Data.Configuration;
    using Fanex.Logging;
    using Fanex.NAP.FraudDetection.AppStart;
    using Fanex.RemotingRef;
    using System;
    using System.Configuration;
    using System.Data.SqlClient;
    using System.Web;
    using System.Web.Http;
    using System.Web.Mvc;
    using System.Web.Optimization;
    using System.Web.Routing;

    /// <summary>
    /// MVC application.
    /// </summary>
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            DbSettingProviderManager.Current.Start();

            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            RefDataTypeContainer
             .ConnectTo(new Uri(ConfigurationManager.AppSettings["Fanex.RemotingRef.Service.Url"]))
             .FromApplication("Your Application Name");
        }

        protected void Session_End(object sender, EventArgs e)
        {
            AuthConfig.SignOut();
        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {
            AuthConfig.RegisterAuth(Context);
        }

        protected void Application_Error(object sender, EventArgs e)
        {
            Exception ex = Server.GetLastError().GetBaseException();
            SqlException sqlEx = ex as SqlException;
            string exceptionFormat = "{0}\r\nType: {1}" +
                                     "\r\nSource: {2}" +
                                     "\r\nDomain: {3}" +
                                     "\r\nReferrer: {4}" +
                                     "\r\nIP: {5}" +
                                     "\r\nUserAgent: {6}" +
                                     "\r\nForm Variable: {7}" +
                                     "\r\nQueryString: {8}" +
                                     "\r\nTargetSite: {9}" +
                                     "\r\nStackTrace: {10}";

            if (!Request.IsLocal)
            {
                string message = string.Format(
                                            exceptionFormat,
                                            ex.Message + "\r\n" + ex.InnerException.Message,
                                            ex.GetType().ToString(),
                                            ex.Source,
                                            HttpContext.Current.Request.Headers["Host"],
                                            HttpContext.Current.Request.UrlReferrer,
                                            HttpContext.Current.Request.UserHostAddress,
                                            HttpContext.Current.Request.UserAgent,
                                            Request.Form.ToString(),
                                            Request.QueryString.ToString(),
                                            ex.TargetSite,
                                            ex.StackTrace);

                // Get additional exception data for SqlException.
                if (sqlEx != null)
                {
                    message += string.Format(
                                          "\r\nProcedure: {0}\r\nLine Number: {1}\r\nServer: {2}",
                                          sqlEx.Procedure,
                                          sqlEx.LineNumber,
                                          sqlEx.Server);
                }

                LogService.Error(message);
            }
        }
    }
}