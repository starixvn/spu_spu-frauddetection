// ----------------------------------------------------------------------
// <copyright file="CustomerGroupService.cs" company="Nexcel Solutions Vietnam">
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
    using Fanex.NAP.FraudDetection.Model.DTO.CustomerGroup;
    using Fanex.NAP.FraudDetection.Model.Criteria.CustomerGroup;
   
    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class CustomerGroupService
    {
        public CustomerGroupService(int objectDbGenerator)
        {
        }

        public IList<Group> GetAllGroups(CustomerGroupsSelectCriteria criteria)
        {
            return null; // GetData<Group>(criteria);
        }

        public int InsertGroup(CustomerGroupInsertCriteria criteria)
        {
            return 1;
        }

        public int UpdateGroup(CustomerGroupUpdateCriteria criteria)
        {
            return 1;
        }
    }
}