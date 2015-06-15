// ----------------------------------------------------------------------
// <copyright file="FilterConfig.cs" company="Nexcel Solutions Vietnam">
//     Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// ------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015/04/22">Created</change>
//   <change who="" date=""></change>
// </history>

namespace Fanex.NAP.FraudDetection.AppStart
{
    using System.Web.Mvc;
    using Controllers.Attributes;

    public static class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new CustomHandleErrorAttribute { View = "Error.cshtml:" }); // by default added
        }
    }
}