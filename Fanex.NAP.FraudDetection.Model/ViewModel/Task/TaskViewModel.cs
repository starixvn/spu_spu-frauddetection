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

        // On User ID
        public int OnUserID { get; set; }

        // Actions
        public int WorkflowID { get; set; }

        // Actions
        public List<SPU.Lib.FraudDetection.DTO.Action> ActionList { get; set; }

        public int ActionID { get; set; }

        public int IntervalValue { get; set; }

        public string IntervalUnit { get; set; }

        // Bettypes and Sports
        public List<Bettype> BettypeList { get; set; }

        public List<Sport> SportList { get; set; }

        // Configurations
        public List<Config> ConfigurationList { get; set; }

        public string PreconditionConfigSQLQuery { get; set; }

        public List<Config> PreconditionConfigurations
        {
            get
            {
                return ConfigurationList.Where(l => l.ConfigCategory.Trim() == "Match").ToList();
            }
        }

        public string RuleConfigSQLQuery { get; set; }

        public List<Config> RuleConfigurations
        {
            get
            {
                return ConfigurationList.Where(l => l.ConfigCategory.Trim() == "Ticket" || l.ConfigCategory.Trim() == "Counter").ToList();
            }
        }

        // Customer Groups
        public List<Group> GroupList { get; set; }

        public int AssignedToGroup { get; set; }

        // Mail Pattern
        public int MailPattern { get; set; }
    }
}