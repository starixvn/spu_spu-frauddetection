// ----------------------------------------------------------------------
// <copyright file="CommonService.cs" company="Nexcel Solutions Vietnam">
//     Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// ------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2015/04/22">Created</change>
//   <change who="" date=""></change>
// </history>

namespace Fanex.NAP.FraudDetection.Service
{
    using System.Collections.Generic;
    using System.Linq;
    using Fanex.Caching;
    using Fanex.Data;
    using Fanex.NAP.FraudDetection.Model.DTO;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class CommonService : ICommonService
    {
        private const string KENOGAMETYPECACHEKEY = "NAP_LICENSEE_MANAGEMENTKENOGAMETYPECACHEKEY";

        private ICache _cache = CacheService.CreateInstance(CacheType.MemoryCache);

        /// <summary>
        /// Gets licensee list.
        /// </summary>
        /// <value>A dictionary.</value>
        public IList<LicenseeItem> GetLicenseeList
        {
            get
            {
                using (var db = new ObjectDb("NAP_SpecialCustSetting_LicenseeList"))
                {
                    return db.Query<LicenseeItem>().ToList();
                }
            }
        }

        /// <summary>
        /// Gets currency list.
        /// </summary>
        /// <value>A dictionary.</value>
        public IList<CurrencyItem> GetCurrencyList
        {
            get
            {
                using (var db = new ObjectDb("NAP_SpecialCustSetting_CurrencyList"))
                {
                    return db.Query<CurrencyItem>().ToList();
                }
            }
        }

        public IDictionary<int, string> GetKenoGameType
        {
            get
            {
                IDictionary<int, string> result = null;
                if (_cache.Contains(KENOGAMETYPECACHEKEY))
                {
                    result = _cache.Get<IDictionary<int, string>>(KENOGAMETYPECACHEKEY);
                }

                if (result == null)
                {
                    using (var db = new ObjectDb("NAP_SpecialCustSettingGameType_Sel"))
                    {
                        result = new Dictionary<int, string>();
                        using (var reader = db.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                result.Add(int.Parse(reader["GameTypeID"].ToString()), reader["GameTypeName"].ToString());
                            }
                        }

                        _cache.Set<IDictionary<int, string>>(KENOGAMETYPECACHEKEY, result);
                    }
                }

                return result;
            }
        }
    }
}