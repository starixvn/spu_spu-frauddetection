// ----------------------------------------------------------------------
// <copyright file="GetAllDefaultBetSettingCriteria.cs" company="Nexcel Solutions Vietnam">
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
    using Fanex.Data.Repository;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    [Serializable]
    public class GetAllDefaultBetSettingCriteria : CriteriaBase
    {
        public string Licensee { get; set; }

        public string Currency { get; set; }

        public bool ShowSportBook { get; set; }

        public bool ShowNumberGame { get; set; }

        public bool ShowVirtualSport { get; set; }

        public bool ShowKeno { get; set; }

        public override string GetSettingKey()
        {
            return "NAP_SpecialCustSetting_List";
        }

        public override bool IsValid()
        {
            return !string.IsNullOrEmpty(Licensee) && !string.IsNullOrEmpty(Currency)
                && (ShowSportBook || ShowNumberGame || ShowVirtualSport || ShowKeno);
        }
    }
}