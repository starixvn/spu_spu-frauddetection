// ----------------------------------------------------------------------
// <copyright file="TrackLoginsFilter.cs" company="Nexcel Solutions Vietnam">
//     Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// ------------------------------------------------------------------------
// <history>
//   <change who="Aaron" date="2016/07/11">Created</change>
// </history>

namespace Fanex.NAP.FraudDetection.AppStart
{
    using Fanex.NAP.FraudDetection.Service;
    using FD.Lib.Criteria.UserMesssage;
    using FD.Lib.Service.Implement;
    using System;
    using System.Web;
    using System.Web.Mvc;
    using System.Web.Routing;

    public class TrackLoginsFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (HttpContext.Current.User.Identity.IsAuthenticated)
            {
                if (filterContext.ActionDescriptor.ControllerDescriptor.ControllerName.ToLower() == "login")
                {
                    var service = new NotificationService();

                    if (filterContext.ActionDescriptor.ActionName.ToLower() == "logout")
                    {
                        if (AppSession.CurrentUser != null)
                        {
                            service.InsertUserAction(new NotificationInsertUserActionCriteria 
                            {
                                UserId = AppSession.CurrentUser.Id,
                                IsLogin = false
                            }); 
                        }
                    }

                    if (filterContext.ActionDescriptor.ActionName.ToLower() == "rechecklogin")
                    {
                        if (AppSession.CurrentUser != null)
                        {
                            service.InsertUserAction(new NotificationInsertUserActionCriteria
                            {
                                UserId = AppSession.CurrentUser.Id,
                                IsLogin = true
                            }); 
                        }
                    }
                }
            }
        }
    }
}