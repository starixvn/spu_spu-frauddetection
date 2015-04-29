// --------------------------------------------------------------------------
// <copyright file="QueryService.cs" company="Nexcel Solutions Vietnam">
// Copyright (coffee) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015.03.25">Created</change>
// </history>

namespace Fanex.NAP.FraudDetection.Service
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using Fanex.Data;
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.Framework.Data;

    /// <summary>
    /// Query Service.
    /// </summary>
    public class QueryService
    {
        private readonly IDynamicRepository _repository;

        public QueryService(IDynamicRepository repository = null)
        {
            _repository = repository ?? new DynamicRepository();
        }

        public virtual IEnumerable<T> GetData<T>(ICriteria criteria)
        {
            return _repository.Fetch<T>(criteria);
        }

        public IEnumerable<T> GetData<T>(ICriteria criteria, ref int totalPages)
        {
            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                var param = criteria.GetSpParams();
                var list = objectDb.Query<T>(param);
                totalPages = Convert.ToInt32(param["totalpages"]);

                return list;
            }
        }
    }
}
