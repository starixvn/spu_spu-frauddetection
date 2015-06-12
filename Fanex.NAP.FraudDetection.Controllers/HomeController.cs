// ----------------------------------------------------------------------
// <copyright file="HomeController.cs" company="Nexcel Solutions Vietnam">
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
    using Core.Web.Attribute;

    /// <summary>
    /// Home controller.
    /// </summary>
    [NapSuperAuth]
    public class HomeController : BaseController
    {
        public ActionResult Index()
        {
            return View();
        }

        [ChildActionOnly]
        public PartialViewResult Menu()
        {
            ViewBag.MenuItemList = CurrentSession.MenuItemList;
            return PartialView("~/Views/Shared/_Menu.cshtml");
        }
    }
}