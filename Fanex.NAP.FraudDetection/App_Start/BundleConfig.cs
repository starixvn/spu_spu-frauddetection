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

    /// <summary>
    /// Bundle configuration.
    /// </summary>
    public static class BundleConfig
    {
        /// <summary>
        /// Register JS , CSS in a bundle.
        /// </summary>
        /// <param name="bundles">The bundle collection.</param>
        [SuppressMessage("StyleCop.CSharp.Nexcel.NexcelCustomRules", "SP2101:MethodMustNotContainMoreLinesThan", Justification = "Reviewed. Suppression is OK here.")]
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/bundles/coreCss").Include(
                "~/Content/jquery-ui/base/jquery-ui.css",
                "~/Content/Plugin/multi-select-control.css",
                "~/Content/Fanex.Grid/Fanex.Grid.css",
                "~/Content/Fanex.Grid/Fanex.Pagination.css",
                "~/Areas/FraudDetection/App_Themes/site.css"));

            bundles.AddAndInclude(
                "~/bundles/coreLess",
                "~/Content/bootstrap/bootstrap.less",
                "~/Content/Core/site.less");

            bundles.Add(new StyleBundle("~/bundles/FraudDetectionCss").IncludeDirectory(
                "~/Areas/FraudDetection/App_Themes/Core", "*.css", true));

            bundles.Add(new StyleBundle("~/bundles/FanexBetListCss").IncludeDirectory(
                "~/Content/betlist", "*.css", true));

            bundles.Add(new ScriptBundle("~/bundles/coreJs").Include(
                "~/Scripts/jquery-1.9.0.js",
                "~/Scripts/jquery-ui-1.11.4.js",
                "~/Scripts/jquery.number.js",
                "~/Scripts/Plugin/multi-select-control.js",
                "~/Scripts/bootstrap.js",
                "~/Scripts/Core/site.js",
                "~/Scripts/Core/AlertService.js",
                "~/Scripts/Core/DialogService.js",
                "~/Scripts/Core/waiting-dialog.js",
                "~/Scripts/tinymce/tinymce.min.js",
                "~/Scripts/jquery.validate.js",
                "~/Scripts/jquery.validate.unobtrusive.js",
                "~/Scripts/jquery.confirm.js",
                "~/Scripts/Fanex.Grid/Fanex.Grid.js",
                "~/Scripts/Fanex.Grid/Fanex.Pagination.js",
                "~/Scripts/Fanex.Grid/moment.min.js",
                "~/Scripts/Fanex.Grid/numeral.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/angularJs").Include(
                "~/Scripts/angular.js",
                "~/Scripts/angular-ui/ui-bootstrap.js",
                "~/Scripts/angular-ui/ui-bootstrap-tpls.js",
                "~/Scripts/smart-table.js"));

            bundles.Add(new ScriptBundle("~/bundles/alertServiceOnPopup").Include(
                "~/Scripts/Core/AlertServiceOnPopup.js"));

            bundles.Add(new ScriptBundle("~/bundles/App/CustomerBettingGroup").Include(
                "~/Areas/FraudDetection/Scripts/CustomerBettingGroup/customer-betting-group-factory.js",
                "~/Areas/FraudDetection/Scripts/CustomerBettingGroup/customer-betting-group-model.js",
                "~/Areas/FraudDetection/Scripts/CustomerBettingGroup/customer-betting-group-controller.js"));

            bundles.Add(new ScriptBundle("~/bundles/App/Case").Include(
                "~/Areas/FraudDetection/Scripts/Case/case-factory.js",
                "~/Areas/FraudDetection/Scripts/Case/case-service.js",
                "~/Areas/FraudDetection/Scripts/Case/case-detail-service.js"));

            bundles.Add(new ScriptBundle("~/bundles/App/Group").Include(
                "~/Areas/FraudDetection/Scripts/Group/group-factory.js",
                "~/Areas/FraudDetection/Scripts/Group/group-service.js"));

            bundles.Add(new ScriptBundle("~/bundles/App/MailMaster").Include(
                "~/Areas/FraudDetection/Scripts/MailMaster/mailmaster-factory.js",
                "~/Areas/FraudDetection/Scripts/MailMaster/mailmaster-service.js"));

            bundles.Add(new ScriptBundle("~/bundles/App/SuspiciousCustomerReport").Include(
                 "~/Scripts/jquery-ui-1.11.4.js",
                "~/Areas/FraudDetection/Scripts/Reports/customer-report-factory.js",
                "~/Areas/FraudDetection/Scripts/Reports/customer-report-service.js",
                "~/Areas/FraudDetection/Scripts/Reports/customer-report.js"));

            bundles.Add(new ScriptBundle("~/bundles/App/MatchMonitoringReport").Include(
                "~/Areas/FraudDetection/Scripts/Reports/matchmonitoring-report-factory.js",
                "~/Areas/FraudDetection/Scripts/Reports/matchmonitoring-report-service.js"));

            bundles.Add(new ScriptBundle("~/bundles/App/Task").Include(
                "~/Areas/FraudDetection/Scripts/Task/task-factory.js",
                "~/Areas/FraudDetection/Scripts/Task/task-service.js"));

            bundles.Add(new ScriptBundle("~/bundles/App/Parameter").Include(
                "~/Areas/FraudDetection/Scripts/Parameter/parameter-factory.js",
                "~/Areas/FraudDetection/Scripts/Parameter/parameter-service.js"));

            bundles.Add(new ScriptBundle("~/bundles/App/CaseGroup").Include(
                "~/Areas/FraudDetection/Scripts/CaseGroup/casegroup-factory.js",
                "~/Areas/FraudDetection/Scripts/CaseGroup/casegroup-service.js"));

            bundles.Add(new ScriptBundle("~/bundles/App/FraudCaseDetail").Include(
                "~/Areas/FraudDetection/Scripts/FraudCaseDetail/fraudcasedetail-factory.js",
                "~/Areas/FraudDetection/Scripts/FraudCaseDetail/fraudcasedetail-service.js"));

            bundles.Add(new ScriptBundle("~/bundles/HomeJs").Include(
                "~/Scripts/Page/Home/home.js"));

            bundles.Add(new ScriptBundle("~/bundles/DefaultBetSettingJs").Include(
                "~/Scripts/Page/DefaultBetSetting/addnew.js",
                "~/Scripts/Page/DefaultBetSetting/default.js",
                "~/Scripts/Page/DefaultBetSetting/edit.js",
                "~/Scripts/Page/DefaultBetSetting/viewlog.js"));

            bundles.Add(new ScriptBundle("~/bundles/FraudDetectionJs").IncludeDirectory(
                "~/Areas/FraudDetection/Scripts/Core", "*.js", true));
        }
    }
}