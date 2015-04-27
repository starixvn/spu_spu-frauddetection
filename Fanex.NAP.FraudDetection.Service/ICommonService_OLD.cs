// ----------------------------------------------------------------------
// <copyright file="ICommonService.cs" company="Nexcel Solutions Vietnam">
//     Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// ------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015/04/22">Created</change>
//   <change who="" date=""></change>
// </history>

namespace Fanex.NAP.FraudDetection.Service
{
    using System.Collections.Generic;
    using Fanex.NAP.FraudDetection.Model.DTO;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public interface ICommonService
    {
        IList<LicenseeItem> GetLicenseeList { get; }

        IList<CurrencyItem> GetCurrencyList { get; }

        IDictionary<int, string> GetKenoGameType { get; }
    }
}