// --------------------------------------------------------------------------
// <copyright file="CompressAttribute.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Thai.Tran" date="2013.03.12">Created</change>
// </history>

namespace Fanex.NAP.SPU.Core
{
    using System.Web;
    using System.Web.Mvc;

    /// <summary>
    /// Class CompressAttribute.
    /// </summary>
    public class CompressAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            GZipEncodePage();
        }

        /// <summary>
        /// Determines if GZip is supported.
        /// </summary>
        /// <returns>Return true if success.</returns>
        private bool IsGZipSupported()
        {
            string acceptEncoding = HttpContext.Current.Request.Headers["Accept-Encoding"];
            if (!string.IsNullOrEmpty(acceptEncoding) &&
                    (acceptEncoding.Contains("gzip") || acceptEncoding.Contains("deflate")))
            {
                return true;
            }

            return false;
        }

        /// <summary>
        /// Sets up the current page or handler to use GZip through a Response.Filter
        /// IMPORTANT:  
        /// You have to call this method before any output is generated!.
        /// </summary>
        private void GZipEncodePage()
        {
            HttpResponse response = HttpContext.Current.Response;

            if (IsGZipSupported())
            {
                string acceptEncoding = HttpContext.Current.Request.Headers["Accept-Encoding"];

                if (acceptEncoding.Contains("gzip"))
                {
                    response.Filter = new System.IO.Compression.GZipStream(response.Filter, System.IO.Compression.CompressionMode.Compress);                    
                    response.AppendHeader("Content-Encoding", "gzip");
                }
                else
                {
                    response.Filter = new System.IO.Compression.DeflateStream(response.Filter, System.IO.Compression.CompressionMode.Compress);                    
                    response.AppendHeader("Content-Encoding", "deflate");
                }
            }

            // Allow proxy servers to cache encoded and unencoded versions separately
            response.AppendHeader("Vary", "Content-Encoding");
        }
    }
}
