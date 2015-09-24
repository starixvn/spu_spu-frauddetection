// ----------------------------------------------------------------------
// <copyright file="BundleExtensions.cs" company="Nexcel Solutions Viet Nam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// ------------------------------------------------------------------------
// <history>
//   <change who="Aaron.Cao" date="2015/09/24">Created.</change>
// </history>

namespace Fanex.NAP.FraudDetection.AppStart
{
    using System.Web.Optimization;
    using BundleTransformer.Core.Orderers;
    using BundleTransformer.Core.Transformers;

    /// <summary>
    /// Bundle extensions.
    /// </summary>
    public static class BundleExtensions
    {
        /// <summary>
        /// Add and include bundle.
        /// </summary>
        /// <param name="bundles">The bundles.</param>
        /// <param name="bundleVirtualPath">The bundle virtual path.</param>
        /// <param name="virtualPaths">The virtual paths.</param>
        public static void AddAndInclude(this BundleCollection bundles, string bundleVirtualPath, params string[] virtualPaths)
        {
            bundles.Add(new Bundle(bundleVirtualPath)
            {
                Transforms = { new StyleTransformer(), new CssMinify() },
                Orderer = new NullOrderer()
            }.Include(virtualPaths));
        }
    }
}