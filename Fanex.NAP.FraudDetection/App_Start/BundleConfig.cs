// ----------------------------------------------------------------------
// <copyright file="BundleConfig.cs" company="Nexcel Solutions Vietnam">
//     Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// ------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015/04/22">Created</change>
//   <change who="" date=""></change>
// </history>

namespace Fanex.NAP.SPU.AppStart
{
    using System.Diagnostics.CodeAnalysis;
    using System.Web.Optimization;
    using BundleTransformer.Core.Resolvers;
    using BundleTransformer.Core.Transformers;

    /// <summary>
    /// Bundle configuration.
    /// </summary>
    public static class BundleConfig
    {
        /// <summary>
        /// Register JS , CSS in a bundle.
        /// </summary>
        /// <param name="bundles">The bundle collection.</param>
        [SuppressMessage(
                     "StyleCop.CSharp.Nexcel.NexcelCustomRules",
                     "SP2101:MethodMustNotContainMoreLinesThan",
                     Justification = "Reviewed. Suppression is OK here.")]
        public static void RegisterBundles(BundleCollection bundles)
        {
            var cssTransformer = new StyleTransformer();
            cssTransformer.CombineFilesBeforeMinification = true;

            var scriptTransformer = new ScriptTransformer();
            scriptTransformer.CombineFilesBeforeMinification = true;
            BundleResolver.Current = new CustomBundleResolver();

            var css = new Bundle("~/bundles/coreCss")
            .IncludeDirectory("~/Content/jquery-ui/base/", "*.css")
            .Include("~/Content/bootstrap/bootstrap.less")
           .Include("~/Content/Plugin/multi-select-control.css")
           .Include("~/Content/Core/site.less");

            css.Transforms.Add(cssTransformer);
            /*var css = new ScriptBundle("~/bundles/coreCss")
            .IncludeDirectory("~/Content/jquery-ui/base/", "*.css")
            .Include("~/Content/bootstrap/bootstrap.less")
           .Include("~/Content/Plugin/multi-select-control.css")
           .Include("~/Content/Core/site.less");*/

            bundles.Add(css);

            var cssFanexGrid = new Bundle("~/bundles/FanexGridCss")
             .IncludeDirectory("~/Content/Fanex.Grid", "*.css");

            cssFanexGrid.Transforms.Add(cssTransformer);

            bundles.Add(cssFanexGrid);

            var coreJs = new Bundle("~/bundles/coreJs")
                .Include(
                "~/Scripts/jquery-1.9.0.js",
                "~/Scripts/jquery-ui-1.11.1.js",
                "~/Scripts/jquery.number.js",
                 "~/Scripts/Plugin/multi-select-control.js",
                "~/Scripts/bootstrap.js",
                "~/Scripts/Core/site.js");

            coreJs.Transforms.Add(scriptTransformer);

            bundles.Add(coreJs);

            var homeJs = new Bundle("~/bundles/HomeJs")
                .Include(
                "~/Scripts/Page/Home/home.js");

            homeJs.Transforms.Add(scriptTransformer);
            bundles.Add(homeJs);

            var defaultBetSettingJs = new Bundle("~/bundles/DefaultBetSettingJs")
                .Include(
                "~/Scripts/Page/DefaultBetSetting/addnew.js",
                 "~/Scripts/Page/DefaultBetSetting/default.js",
                "~/Scripts/Page/DefaultBetSetting/edit.js",
                 "~/Scripts/Page/DefaultBetSetting/viewlog.js");
         
            defaultBetSettingJs.Transforms.Add(scriptTransformer);
            bundles.Add(defaultBetSettingJs);

            var fanexGridJs = new Bundle("~/bundles/FanexGridJs")
            .IncludeDirectory("~/Scripts/Fanex.Grid", "*.js", true);

            fanexGridJs.Transforms.Add(scriptTransformer);

            bundles.Add(fanexGridJs);
            /*If you'd like to test the optimization locally,
            you can use this line to force it.*/
            BundleTable.EnableOptimizations = false;
        }
    }
}