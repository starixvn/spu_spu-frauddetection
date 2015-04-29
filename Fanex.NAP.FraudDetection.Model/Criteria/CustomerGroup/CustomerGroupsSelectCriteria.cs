// ----------------------------------------------------------------------
// <copyright file="CustomerGroupsSelectCriteria.cs" company="Nexcel Solutions Vietnam">
//     Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// ------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015/04/22">Created</change>
//   <change who="" date=""></change>
// </history>

namespace Fanex.NAP.FraudDetection.Model.Criteria.CustomerGroup
{
    using Fanex.NAP.Framework.Data;

    /// <summary>
    /// Customer Group Select Criteria.
    /// </summary>
    public class CustomerGroupsSelectCriteria : CriteriaBase
    {
        public override string GetSettingKey()
        {
            return "SPU_GroupSelectAll";
        }
    }
}
