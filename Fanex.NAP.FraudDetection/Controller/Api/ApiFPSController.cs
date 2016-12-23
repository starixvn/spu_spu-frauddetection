namespace Fanex.NAP.FraudDetection.Controller.Api
{
    using Fanex.NAP.Framework.Command;
    using FD.Lib.Criteria.Case;
    using FD.Lib.Service.Interface;
    using System.Web.Http;

    public class ApiFPSController : ApiController
    {
        private readonly IFlaggedAccountService _flaggedAccountService;

        public ApiFPSController()
        {
            _flaggedAccountService = new FlaggedAccountService();
        }

        [HttpPost]
        public ICommandResult AddEvidence([FromBody]FlaggedAccountInsertCriteria criteria)
        {
            criteria.EviCode = criteria.EviCode ?? string.Empty;
            criteria.IndirectAccounts = criteria.IndirectAccounts ?? string.Empty;
            criteria.DirectAccounts = criteria.DirectAccounts ?? string.Empty;
            return _flaggedAccountService.InsertAccounts(criteria);
        }

        [HttpPost]
        public ICommandResult RemoveEvidence([FromBody]FlaggedAccountDeleteCriteria criteria)
        {
            criteria.EviCode = criteria.EviCode ?? string.Empty;
            criteria.IndirectAccounts = criteria.IndirectAccounts ?? string.Empty;
            criteria.DirectAccounts = criteria.DirectAccounts ?? string.Empty;
            return _flaggedAccountService.DeleteAccounts(criteria);
        }
    }
}