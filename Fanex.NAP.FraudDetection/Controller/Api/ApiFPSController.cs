namespace Fanex.NAP.FraudDetection.Controller.Api
{
    using Fanex.NAP.Framework.Command;
    using System.Web.Http;

    public class ApiFPSController : ApiController
    {
        [HttpPost]
        public CommandResult AddEvidence([FromBody]string data)
        {
            return new CommandResult() 
            {
                Code = 1,
                Message = "Add - Con ga Harvey"
            };
        }

        [HttpPost]
        public CommandResult RemoveEvidence([FromBody]string data)
        {
            return new CommandResult()
            {
                Code = 2,
                Message = "Remove - Con ga Harvey"
            };
        }
    }
}