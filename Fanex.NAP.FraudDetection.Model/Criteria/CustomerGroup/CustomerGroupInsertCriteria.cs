// ----------------------------------------------------------------------
// <copyright file="CustomerGroupInsertCriteria.cs" company="Nexcel Solutions Vietnam">
//     Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// ------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015/04/22">Created</change>
//   <change who="" date=""></change>
// </history>

namespace Fanex.NAP.FraudDetection.Model.Criteria.CustomerGroup
{
    using System;
    using Fanex.NAP.Framework.Data;

    /// <summary>
    /// Customer Group Insert Criteria.
    /// </summary>
    public class CustomerGroupInsertCriteria : CriteriaBase
    {
        public int CreatorId { get; set; }

        public string GroupName { get; set; }

        public string GroupDesc { get; set; }

        public bool IsActive { get; set; }

        // Output parameters
        public int GroupId { get; set; }

        public override string GetSettingKey()
        {
            return "SPU_GroupIns";
        }

        public override bool IsValid()
        {
            return !string.IsNullOrEmpty(GroupName) && CreatorId > 0;
        }
    }
}
