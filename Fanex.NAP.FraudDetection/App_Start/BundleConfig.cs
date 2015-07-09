// ----------------------------------------------------------------------
// <copyright file="BundleConfig.cs" company="Nexcel Solutions Vietnam">
//     Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// ------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015/04/22">Created</change>
//   <change who="" date=""></change>
// </history>

namespace Fanex.NAP.FraudDetection.AppStart
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
            var cssTransformer = new StyleTransformer { CombineFilesBeforeMinification = true };

            var scriptTransformer = new ScriptTransformer { CombineFilesBeforeMinification = true };
            BundleResolver.Current = new CustomBundleResolver();

            var css = new Bundle("~/bundles/coreCss")
            .IncludeDirectory("~/Content/jquery-ui/base/", "*.css")
            .Include("~/Content/bootstrap/bootstrap.less")
            .Include("~/Content/Plugin/multi-select-control.css")
            .Include("~/Content/Core/site.less");

            css.Transforms.Add(cssTransformer);

            bundles.Add(css);

            var cssFanexGrid = new Bundle("~/bundles/FanexGridCss")
             .IncludeDirectory("~/Content/Fanex.Grid", "*.css");
            cssFanexGrid.Transforms.Add(cssTransformer);
            bundles.Add(cssFanexGrid);

            bundles.Add(new StyleBundle("~/bundles/FanexGrid/FanexGridCss").Include(
                "~/Content/Fanex.Grid/Fanex.Grid.css",
                "~/Content/Fanex.Grid/Fanex.Pagination.css"));

            var fraudDetectionCss = new Bundle("~/bundles/FraudDetectionCss")
            .IncludeDirectory("~/Areas/FraudDetection/App_Themes/Core", "*.css");
            fraudDetectionCss.Transforms.Add(cssTransformer);
            bundles.Add(fraudDetectionCss);

            var coreJs = new Bundle("~/bundles/coreJs")
                .Include(
                "~/Scripts/jquery-1.9.0.js",
                "~/Scripts/jquery-ui-1.11.1.js",
                "~/Scripts/jquery.number.js",
                "~/Scripts/Plugin/multi-select-control.js",
                "~/Scripts/bootstrap.js",
                "~/Scripts/Core/site.js",
                "~/Scripts/Core/AlertService.js",
                "~/Scripts/Core/DialogService.js",
                "~/Scripts/tinymce/tinymce.min.js",
                "~/Scripts/jquery.validate.js",
                "~/Scripts/jquery.validate.unobtrusive.js",
                "~/Scripts/jquery.confirm.min.js",
                "~/Scripts/numeral.min.js"
                );

            var angularJs = new Bundle("~/bundles/angularJs")
            .Include(
                "~/Scripts/angular.js",
                "~/Scripts/angular-ui/ui-bootstrap.js",
                "~/Scripts/angular-ui/ui-bootstrap-tpls.js",
                "~/Scripts/smart-table.js"
                );

            coreJs.Transforms.Add(scriptTransformer);

            angularJs.Transforms.Add(scriptTransformer);

            bundles.Add(coreJs);
            bundles.Add(angularJs);

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

            var fraudDetectionJs = new Bundle("~/bundles/FraudDetectionJs")
            .IncludeDirectory("~/Areas/FraudDetection/Scripts/Core", "*.js", true);
            fraudDetectionJs.Transforms.Add(scriptTransformer);
            bundles.Add(fraudDetectionJs);

            /*If you'd like to test the optimization locally,
            you can use this line to force it.*/
            BundleTable.EnableOptimizations = false;
        }
    }
}