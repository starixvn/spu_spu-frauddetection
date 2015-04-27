// ----------------------------------------------------------------------
// <copyright file="ObjectDbGenerator.cs" company="Nexcel Solutions Vietnam">
//     Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// ------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015/04/22">Created</change>
//   <change who="" date=""></change>
// </history>

namespace Fanex.NAP.FraudDetection.Service.Core
{
    using Fanex.Data;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class ObjectDbGenerator : IObjectDbGenerator
    {
        #region IObjectDbWrapper Members

        public IObjectDb Create(string key, int commandTimeOut = 120)
        {
            return new ObjectDb(key, commandTimeOut);
        }

        public IObjectDb Create(IDbSetting setting, bool ignoreExceptionIsNotParameter = false, int commandTimeOut = 120)
        {
            return new ObjectDb(setting, ignoreExceptionIsNotParameter, commandTimeOut);
        }

        #endregion
    }
}
