// --------------------------------------------------------------------------
// <copyright file="TaskAdditionalInfo.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015.04.05">Created</change>
// </history>

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Models
{
    public class TaskAdditionalInfo
    {
        public string PreconConfigs { get; set; }

        public string RuleConfigs { get; set; }

        public bool IsCheckNotScanned { get; set; }
    }
}