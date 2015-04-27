// ----------------------------------------------------------------------
// <copyright file="GetAgentListCriteria.cs" company="Nexcel Solutions Vietnam">
//     Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// ------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015/04/22">Created</change>
//   <change who="" date=""></change>
// </history>

namespace Fanex.NAP.FraudDetection.Model.Criteria.DefaultBetSetting
{
    using System;
    using Fanex.NAP.Framework.Data;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    [Serializable]
    public class GetAgentListCriteria : CriteriaBase
    {
        public string Licensee { get; set; }

        public int CurrencyID { get; set; }

        public override string GetSettingKey()
        {
            return "NAP_SpecialCustSettingAgent_SelByCurrencyAndLicensee";
        }

        public override bool IsValid()
        {
            return !string.IsNullOrEmpty(Licensee) && CurrencyID > 0;
        }
    }
}
