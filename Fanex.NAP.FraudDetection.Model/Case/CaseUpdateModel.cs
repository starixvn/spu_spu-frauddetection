// --------------------------------------------------------------------------
// <copyright file="CaseUpdateModel.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Aaron.Cao" date="2016.06.24">Created</change>
// </history>

namespace Fanex.NAP.FraudDetection.Model.Case
{
    using FD.Lib.Criteria.Case;
    using FD.Lib.DTO;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    public class CaseUpdateModel
    {
        public CaseUpdateModel()
        {
            CaseModel = new CaseUpdateCriteria();

            CaseTypes = new List<CaseType>();
        }

        public CaseUpdateCriteria CaseModel { get; set; }

        public IEnumerable<CaseType> CaseTypes { get; set; }
    }
}
