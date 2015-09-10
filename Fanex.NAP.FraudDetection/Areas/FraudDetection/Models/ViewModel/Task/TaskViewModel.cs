// --------------------------------------------------------------------------
// <copyright file="TaskViewModel.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015.05.13">Created</change>
// </history>

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Models.ViewModel.Task
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using FD.Lib.DTO;

    /// <summary>
    /// Task View Model.
    /// </summary>
    [Serializable]
    public class TaskViewModel
    {
        public TaskViewModel(
            List<Event> events,
            List<Config> configs,
            List<CaseGroup> groups,
            List<Sport> sportList,
            List<Bettype> bettypeList,
            List<MailMasterInfo> mailMasterList,
            List<Currency> currencyList)
        {
            EventList = events;
            ConfigurationList = configs;
            GroupList = groups;
            SportList = sportList;
            BettypeList = bettypeList;
            MaiMasterList = mailMasterList;
            CurrencyList = currencyList;
        }

        // On User ID
        public int OnUserId { get; set; }

        // Task
        public Task TaskInformation { get; set; }

        // Actions
        public List<Event> EventList { get; set; }

        // Currencies
        public List<Currency> CurrencyList { get; set; }
        
        // Bettypes and Sports
        public List<Bettype> BettypeList { get; set; }

        public List<Sport> SportList { get; set; }

        // Configurations
        public List<Config> ConfigurationList { get; set; }

        public List<Config> PreconditionConfigurations
        {
            get
            {
                return ConfigurationList.Where(l => l.ConfigCategory == "Match").ToList();
            }
        }

        public List<Config> RuleConfigurations
        {
            get
            {
                return ConfigurationList.Where(l => l.ConfigCategory != "Match").ToList();
            }
        }

        // Customer Groups
        public List<CaseGroup> GroupList { get; set; }

        // Mail Masters
        public List<MailMasterInfo> MaiMasterList { get; set; }

        public int AssignedToGroup { get; set; }

        // Mail Pattern
        public int MailPattern { get; set; }
    }
}