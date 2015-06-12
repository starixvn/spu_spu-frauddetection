// --------------------------------------------------------------------------
// <copyright file="ParameterViewModel.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015.06.11">Created</change>
// </history>

namespace Fanex.NAP.FraudDetection.Model.ViewModel
{
    using System;
    using System.Collections.Generic;
    using SPU.Lib.FraudDetection.DTO;

    /// <summary>
    /// Task View Model.
    /// </summary>
    [Serializable]
    public class ParameterViewModel
    {
        public ParameterViewModel(
            List<Parameter> paramList,
            int currentOnlineUser)
        {
            ParameterList = paramList;
            OnUserID = currentOnlineUser;
        }

        // On User ID
        public int OnUserID { get; set; }

        // Bettypes and Sports
        public List<Parameter> ParameterList { get; set; }
    }
}