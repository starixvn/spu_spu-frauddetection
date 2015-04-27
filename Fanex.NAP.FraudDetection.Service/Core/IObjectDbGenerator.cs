// ----------------------------------------------------------------------
// <copyright file="IObjectDbGenerator.cs" company="Nexcel Solutions Vietnam">
//     Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// ------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015/04/22">Created</change>
//   <change who="" date=""></change>
// </history>

namespace Fanex.NAP.FraudDetection.Service
{
    using Fanex.Data;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public interface IObjectDbGenerator
    {
        IObjectDb Create(string key, int commandTimeOut = 120);

        IObjectDb Create(IDbSetting setting, bool ignoreExceptionIsNotParameter = false, int commandTimeOut = 120);
    }
}
