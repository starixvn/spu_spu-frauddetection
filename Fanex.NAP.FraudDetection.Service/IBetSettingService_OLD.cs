// ----------------------------------------------------------------------
// <copyright file="IBetSettingService.cs" company="Nexcel Solutions Vietnam">
//     Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// ------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015/04/22">Created</change>
//   <change who="" date=""></change>
// </history>

namespace Fanex.NAP.SPU.Service
{
    using System.Collections.Generic;
    using Fanex.NAP.SPU.Model.Criteria.DefaultBetSetting;
    using Fanex.NAP.SPU.Model.DTO;
    using Fanex.NAP.SPU.Model.DTO.DefaultBetSetting;
    using Fanex.NAP.SPU.Model.ViewModel.DefaultBetSetting;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public interface IBetSettingService
    {
        IList<DefaultBetSetting> GetAll(GetAllDefaultBetSettingCriteria criteria);

        SingleDefaultBetSettingViewModel SingleSetting(GetSingleDefaultBetSettingCriteria criteria);
      
        ResultInfo InsertOrUpdate(InsertOrUpdateDefaultBetSetting criteria);

        IList<AgentItem> GetAgents(GetAgentListCriteria criteria);

        IList<SettingLogItem> GetLogs(GetSettingLogCriteria criteria);
    }
}