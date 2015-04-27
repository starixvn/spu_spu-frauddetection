// --------------------------------------------------------------------------
// <copyright file="FanexGridHelper.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Thai.Tran" date="2015.4.27">Create</change>
// </history>
namespace Fanex.NAP.SPU.Core
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Diagnostics.CodeAnalysis;        
    using System.Drawing;
    using System.Text;    

    /// <summary>
    /// Generate data grid from data table.
    /// </summary>    
    [SuppressMessage(
         "StyleCop.CSharp.Nexcel.NexcelCustomRules",
         "SP2101:MethodMustNotContainMoreLinesThan",
         Justification = "Reviewed. Suppression is OK here.")]
    public static class FanexGridHelper
    {
        /// <summary>
        /// Data for FANEX grid.
        /// </summary>
        /// <param name="dr">The IDataReader.</param>
        /// <returns>Object System.String.</returns>
        public static string DataForFanexGrid(IDataReader dr)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append("[");
            while (dr.Read())
            {
                builder.Append("{");
                builder.Append("Columns:");
                builder.Append("[");
                for (int j = 0; j < dr.FieldCount; j++)
                {
                    builder.Append("{");
                    builder.Append("Name:");
                    builder.Append("\"");
                    builder.Append(dr.GetName(j));
                    builder.Append("\"");
                    builder.Append(",");
                    builder.Append("Value:");
                    builder.Append("\"");
                    builder.Append(dr[j].ConvertToString());
                    builder.Append("\"");
                    builder.Append("}");
                    builder.Append(",");
                }

                builder.Remove(builder.Length - 1, 1);
                builder.Append("]");
                builder.Append("}");
                builder.Append(",");
            }

            if (builder.Length > 1)
            {
                builder.Remove(builder.Length - 1, 1);
            }

            builder.Append("]");

            return builder.ToString();
        }

        /// <summary>
        /// Data for FANEX grid.
        /// </summary>
        /// <param name="col">The DataCollection.</param>
        /// <returns>Object System.String.</returns>
        public static string DataForFanexGrid(DataCollection col)
        {
            bool flag = false;
            StringBuilder builder = new StringBuilder();
            builder.Append("[");
            builder.Append("{");
            builder.Append("data:[");

            if (col != null && col.Data != null && col.Data.Tables.Count > 0)
            {
                DataTable dt = col.Data.Tables[0];                
                foreach (DataRow row in dt.Rows)
                {
                    if (!flag)
                    {
                        flag = true;
                    }

                    builder.Append("{");
                    builder.Append("Columns:");
                    builder.Append("[");
                    for (int j = 0; j < dt.Columns.Count; j++)
                    {
                        builder.Append("{");
                        builder.Append("Name:");
                        builder.Append("\"");
                        builder.Append(dt.Columns[j].ColumnName);
                        builder.Append("\"");
                        builder.Append(",");
                        builder.Append("Value:");
                        builder.Append("\"");
                        builder.Append(row[j].ConvertToString());
                        builder.Append("\"");
                        builder.Append("}");
                        builder.Append(",");
                    }

                    builder.Remove(builder.Length - 1, 1);
                    builder.Append("]");
                    builder.Append("}");
                    builder.Append(",");
                }

                if (dt.Rows.Count > 0)
                {
                    builder.Remove(builder.Length - 1, 1);
                }                
            }

            builder.Append("]");
            builder.Append("}");

            builder.Append(",");
            builder.Append("{");
            builder.Append("totalItem:");
            builder.Append("\"");
            builder.Append(col.TotalItem.ConvertToString());
            builder.Append("\"");
            builder.Append("}");
            builder.Append("]");

            return builder.ToString();
        }

        /// <summary>
        /// Data for FANEX grid_ prevent contain quote.
        /// </summary>
        /// <param name="col">The DataCollection.</param>
        /// <returns>Object System.String.</returns>
        public static string DataForFanexGrid_PreventContainQuote(DataCollection col)
        {
            bool flag = false;
            StringBuilder builder = new StringBuilder();
            builder.Append("[");
            builder.Append("{");
            builder.Append("data:[");

            if (col != null && col.Data != null && col.Data.Tables.Count > 0)
            {
                DataTable dt = col.Data.Tables[0];               
                foreach (DataRow row in dt.Rows)
                {
                    if (!flag)
                    {
                        flag = true;
                    }

                    builder.Append("{");
                    builder.Append("Columns:");
                    builder.Append("[");
                    for (int j = 0; j < dt.Columns.Count; j++)
                    {
                        var value = row[j].ConvertToString();
                        value = value.Replace("\\", "\\\\");
                        if (value.Contains("\""))
                        {
                            value = value.Replace("\"", "\\\"");
                        }

                        builder.Append("{");
                        builder.Append("Name:");
                        builder.Append("\"");
                        builder.Append(dt.Columns[j].ColumnName);
                        builder.Append("\"");
                        builder.Append(",");
                        builder.Append("Value:");
                        builder.Append("\"");
                        builder.Append(value);
                        builder.Append("\"");
                        builder.Append("}");
                        builder.Append(",");
                    }

                    builder.Remove(builder.Length - 1, 1);
                    builder.Append("]");
                    builder.Append("}");
                    builder.Append(",");
                }

                if (dt.Rows.Count > 0)
                {
                    builder.Remove(builder.Length - 1, 1);
                }                
            }

            builder.Append("]");
            builder.Append("}");
            builder.Append(",");
            builder.Append("{");
            builder.Append("totalItem:");
            builder.Append("\"");
            builder.Append(col.TotalItem.ConvertToString());
            builder.Append("\"");
            builder.Append("}");
            builder.Append("]");

            return builder.ToString();
        }

        /// <summary>
        /// Converts to string.
        /// </summary>
        /// <param name="obj">The object.</param>
        /// <returns>Object System.String.</returns>
        public static string ConvertToString(this object obj)
        {
            if (obj.GetType().Equals(typeof(DBNull)))
            {
                return string.Empty;
            }

            if (obj.GetType().Equals(typeof(DateTime)))
            {
                return ((DateTime)obj).ToString("dd MMM yyyy HH:mm:ss");
            }

            return obj.ToString();
        }
    }
}
