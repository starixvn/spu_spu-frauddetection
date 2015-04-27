// ----------------------------------------------------------------------
// <copyright file="LogActionType.cs" company="Nexcel Solutions Vietnam">
//     Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// ------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015/04/22">Created</change>
//   <change who="" date=""></change>
// </history>

namespace Fanex.NAP.FraudDetection.Model.DataDomain
{
    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public enum LogActionType : int
    {
        /// <summary>
        /// None action.
        /// </summary>
        None = 0,

        /// <summary>
        /// Insert Licensee hard code Setting.
        /// </summary>
        Insert = 1,

        /// <summary>
        /// Update Licensee hard code Setting.
        /// </summary>
        Update = 2,

        /// <summary>
        /// Delete Licensee Hard code Setting.
        /// </summary>
        Delete = 3
    }
}