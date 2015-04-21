// -----------------------------------------------------------------------
// <copyright file="IBetSettingService.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

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