
SET QUOTED_IDENTIFIER ON 
GO
SET ANSI_NULLS ON 
GO

/****** Object:  Stored Procedure dbo.FD_GroupMemberInsert    Script Date: 9/18/2017 9:11:05 AM ******/




CREATE PROCEDURE [dbo].[FD_GroupMemberInsert]   

 @CreatorId int,   

 @Username nvarchar(200),    

 @GroupId nvarchar(200) = '',    

     

 @ErrCode int = 0 OUTPUT,    

 @ErrMsg nvarchar(200) = '' OUTPUT    

AS  

BEGIN

	/*      

	Created: 20170914@Aaron   

	Task : Add new member to group

	Original: [FD_GroupInsert]    

	Revisions:      

	  

	Param's Explanation:      

	• @ErrCode:      

		= 0: Create group successfully.      

		> 0: Specific Error.      

	        

	• @ErrMsg: Error description.      

	*/     

	SET NOCOUNT ON  

	  

	IF NOT EXISTS(Select 1 From dbo.Groups with (nolock) where GroupId=@GroupId)    

	BEGIN    

	 SELECT @ErrMsg = 'Group does not exist!'  

		  , @ErrCode = 0901  

	 return  

	END



	DECLARE @custId INT



	SELECT @custId = custid FROM bodb02.dbo.Customer c WITH(NOLOCK) WHERE c.username = @Username AND c.roleid = 1

	

	IF @custId IS NULL OR @custId = 0    

	BEGIN    

	 SELECT @ErrMsg = 'Member name does not exist!'  

		  , @ErrCode = 0902  

	 return  

	END    

	

	IF EXISTS(SELECT 1 FROM dbo.CustomerGroups WITH(NOLOCK) WHERE GroupId=@GroupId AND CustId = @custId)    

	BEGIN    

	 SELECT @ErrMsg = 'Member existed!'  

		  , @ErrCode = 0903  

	 return  

	END 

	  

	INSERT INTO dbo.CustomerGroups(CustId, CaseId, CreatedBy, CreatedDate, GroupId)

	VALUES (@custId, 0, @CreatorId, GETDATE(), @GroupId)  



	if @@error <> 0  

	BEGIN    

	 SELECT @ErrMsg = 'Insert Member failed. Please try again.' 

	 ,@ErrCode = 0904    

	 return    

	END    

	  

	Declare @LogData varchar(500), @SPName varchar(100)   

	select @SPName = OBJECT_NAME(@@ProcID)  



	Select @LogData = 'Insert new Member with 

	Username='+ dbo.SPU_ToString(@Username) + ',  

	GroupId'+ dbo.SPU_ToString(@GroupId) + ',  

	Creator='+ dbo.SPU_ToString(@CreatorId)  



	EXEC [dbo].[FD_WriteLog]  

	 @LogTypeId = 9,   

	 @CreatorId = @CreatorId,  

	 @SPName=@SPName,  

	 @Details=@LogData  

END

/*

GO

GRANT EXECUTE ON [dbo].[FD_GroupMemberInsert] TO [bodbSPUNet]

GO

GRANT VIEW DEFINITION ON [dbo].[FD_GroupMemberInsert] TO [bodbSPUNet]

GO

*/

GO

SET QUOTED_IDENTIFIER OFF 
GO
SET ANSI_NULLS ON 
GO


GO 
 GRANT EXECUTE ON [dbo].[FD_GroupMemberInsert] TO [bodbSPUNet]
GO 
 GRANT VIEW DEFINITION ON [dbo].[FD_GroupMemberInsert] TO [bodbSPUNet]
GO 
