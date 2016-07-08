
namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Controllers
{
    using Fanex.NAP.FraudDetection.Controllers;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
using System.Web.Mvc;

    public class MessageMasterController : BaseController
    {
        public ActionResult Index()
        {
            return View("~/Areas/FraudDetection/Views/MessageMaster/ListMessage.cshtml");
        }

        public ActionResult Add()
        {
            return View("~/Areas/FraudDetection/Views/MessageMaster/AddMessage.cshtml");
        }
    }
}