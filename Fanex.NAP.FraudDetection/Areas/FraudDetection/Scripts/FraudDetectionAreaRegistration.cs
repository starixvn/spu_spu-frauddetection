namespace Fanex.NAP.FraudDetection.Areas.FraudDetection
{
    using System.Web.Mvc;

    public class FraudDetectionAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "FraudDetection";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "FraudDetection_default",
                "FraudDetection/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional });
        }
    }
}
