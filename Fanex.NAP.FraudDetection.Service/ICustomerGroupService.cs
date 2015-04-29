// ----------------------------------------------------------------------
// <copyright file="ICustomerGroupService.cs" company="Nexcel Solutions Vietnam">
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
    using Fanex.NAP.Framework.Data;
    using Fanex.NAP.FraudDetection.Model.DTO.CustomerGroup;

    /// <summary>
    /// Interface Customer Group Service.
    /// </summary>
    public interface ICustomerGroupService
    {
        IList<Group> GetAllGroups(ICriteria criteria);

        int InsertGroup(ICriteria criteria);

        int UpdateGroup(ICriteria criteria);
    }
}