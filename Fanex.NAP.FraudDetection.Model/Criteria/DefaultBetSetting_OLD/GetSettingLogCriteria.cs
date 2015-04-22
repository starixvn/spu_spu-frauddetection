// ----------------------------------------------------------------------
// <copyright file="GetSettingLogCriteria.cs" company="Nexcel Solutions Vietnam">
//     Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// ------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015/04/22">Created</change>
//   <change who="" date=""></change>
// </history>

namespace Fanex.NAP.SPU.Model.Criteria.DefaultBetSetting
{
    using System;
    using Fanex.NAP.Framework.Data;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    [Serializable]
    public class GetSettingLogCriteria : CriteriaBase
    {
        public int LicenseeID { get; set; }

        public int CurrencyID { get; set; }

        public int? AgentID { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override string GetSettingKey()
        {
            return "NAP_SpecialCustSetting_LogSel";
        }

        public override bool IsValid()
        {
            return LicenseeID > 0 && CurrencyID > 0 && FromDate <= ToDate && FromDate > DateTime.MinValue && ToDate > DateTime.MinValue;
        }
    }
}