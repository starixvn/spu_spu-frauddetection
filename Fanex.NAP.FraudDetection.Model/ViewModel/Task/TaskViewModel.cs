// --------------------------------------------------------------------------
// <copyright file="TaskViewModel.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015.05.13">Created</change>
// </history>

namespace Fanex.NAP.FraudDetection.Model.ViewModel
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;
    using SPU.Lib.FraudDetection.DTO;

    /// <summary>
    /// Task View Model.
    /// </summary>
    [Serializable]
    public class TaskViewModel
    {
        public TaskViewModel(
            List<SPU.Lib.FraudDetection.DTO.Action> actions, 
            List<Config> configs,
            List<Group> groups,
            List<Sport> sportList,
            List<Bettype> bettypeList)
        {
            ActionList = actions;
            ConfigurationList = configs;
            GroupList = groups;
            SportList = sportList;
            BettypeList = bettypeList;
        }

        //=========================================================================
        // Actions
        public List<SPU.Lib.FraudDetection.DTO.Action> ActionList { get; set; }

        public string ActionName { get; set; }

        public IEnumerable<SelectListItem> ActionListItem
        {
            get
            {
                var countryItemList = ActionList.Select(action => new SelectListItem
                {
                    Value = action.ActionId.ToString(),
                    Text = action.ActionName
                }).ToList<SelectListItem>();

                return countryItemList;
            }
        }

        //=========================================================================
        // Bettypes and Sports
        public List<Bettype> BettypeList { get; set; }

        public string Bettype { get; set; }

        public List<Sport> SportList { get; set; }

        public string Sport { get; set; }

        //=========================================================================
        // Configurations
        public List<Config> ConfigurationList { get; set; }

        public string PreconditionConfigKey { get; set; }

        public string PreconditionConfigOperator { get; set; }

        public string PreconditionConfigValue { get; set; }

        public List<Config> PreconditionConfigurations
        {
            get
            {
                return ConfigurationList.Where(l => l.ConfigCategory.Trim() == "Match").ToList();
            }
        }

        public string RuleConfigKey { get; set; }

        public string RuleConfigOperator { get; set; }

        public string RuleConfigValue { get; set; }

        public List<Config> RuleConfigurations
        {
            get
            {
                return ConfigurationList.Where(l => l.ConfigCategory.Trim() == "Ticket").ToList();
            }
        }

        //=========================================================================
        // Customer Groups
        public List<Group> GroupList { get; set; }

        public string Group { get; set; }
    }
}