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
    using Data;
    using Framework.Data;

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

        /// <summary>
        /// Get Data by template.
        /// </summary>
        /// <typeparam name="T">Delegate object.</typeparam>
        /// <param name="criteria">Input criteria.</param>
        /// <param name="totalPages">Total Pages.</param>
        /// <returns>List of delegate objects.</returns>
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
