// -----------------------------------------------------------------------
// <copyright file="IObjectDbGenerator.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.SPU.Service
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
