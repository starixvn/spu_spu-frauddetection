namespace Fanex.NAP.FraudDetection.Areas.FraudDetection.Models
{
    using System.Collections.Generic;
    using SPU.Lib.FraudDetection.DTO;

    public class AddCustomerGroupToCaseViewModel
    {
        public int CaseId { get; set; }

        public IList<Group> Groups { get; set; }
    }
}