// --------------------------------------------------------------------------
// <copyright file="TaskModel.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015.11.13">Created</change>
// </history>

namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Models.ViewModel.Task
{
    using System;

    /// <summary>
    /// Task View Model.
    /// </summary>
    [Serializable]
    public class TaskModel
    {
        public int UserId { get; set; }

        public int CaseId { get; set; }

        public int TaskId { get; set; }
    }
}