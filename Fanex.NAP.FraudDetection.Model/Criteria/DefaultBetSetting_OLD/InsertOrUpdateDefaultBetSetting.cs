// ----------------------------------------------------------------------
// <copyright file="InsertOrUpdateDefaultBetSetting.cs" company="Nexcel Solutions Vietnam">
//     Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// ------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015/04/22">Created</change>
//   <change who="" date=""></change>
// </history>

namespace Fanex.NAP.FraudDetection.Model.Criteria.DefaultBetSetting
{
    using Fanex.NAP.Framework.Data;

    /// <summary>
    /// Insert or update  - criterion.
    /// </summary>
    public class InsertOrUpdateDefaultBetSetting : CriteriaBase
    {
        public string Licensee { get; set; }

        public int CurrencyID { get; set; }

        public int? AgentID { get; set; }

        public string Settings { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public string IP { get; set; }

        public int UserID { get; set; }

        public override string GetSettingKey()
        {
            return "NAP_SpecialCustSetting_Modify";
        }

        public override bool IsValid()
        {
            return !string.IsNullOrEmpty(Licensee) && CurrencyID > 0 && !string.IsNullOrEmpty(Settings);
        }
    }
}