
SET QUOTED_IDENTIFIER ON 
GO
SET ANSI_NULLS ON 
GO

/****** Object:  Stored Procedure dbo.FD_GroupMemberDelete    Script Date: 9/18/2017 9:11:05 AM ******/

CREATE PROCEDURE [dbo].[FD_GroupMemberDelete]   
 @CreatorId int,
 @GroupId int,   
 @CustId int,   
     
 @ErrCode int = 0 OUTPUT,    
 @ErrMsg nvarchar(200) = '' OUTPUT    
AS  
BEGIN
	/*      
	Created: 20170914@Aaron.Cao  
	Task : Remove member from group
	Original:
	Revisions:      
	  
	Param's Explanation:      
	• @ErrCode:      
		= 0: Update mail successfully.      
		> 0: Specific Error.      
	        
	• @ErrMsg: Error description.      
	*/  
	SET NOCOUNT ON;
	   
	DELETE FROM dbo.CustomerGroups
	WHERE CustId = @CustId AND GroupId = @GroupId

    Declare @LogData varchar(500), @SPName varchar(100)   

    select @SPName = OBJECT_NAME(@@ProcID)  

    Select @LogData = 'Remove member with 
    GroupId='+ dbo.SPU_ToString(@GroupId) + ',
    CustId='+ dbo.SPU_ToString(@CustId) + ',  
    Creator='+ dbo.SPU_ToString(@CreatorId)

    EXEC [dbo].[FD_WriteLog]  
	   @LogTypeId = 10,   
	   @CreatorId = @CreatorId,  
	   @SPName=@SPName,  
	   @Details=@LogData  
 END
 
 /*
GO
GRANT EXECUTE ON [dbo].[FD_GroupMemberDelete] TO [bodbSPUNet]
GO
GRANT VIEW DEFINITION ON [dbo].[FD_GroupMemberDelete] TO [bodbSPUNet]
GO
*/

GO

SET QUOTED_IDENTIFIER OFF 
GO
SET ANSI_NULLS ON 
GO


GO 
 GRANT EXECUTE ON [dbo].[FD_GroupMemberDelete] TO [bodbSPUNet]
GO 
 GRANT VIEW DEFINITION ON [dbo].[FD_GroupMemberDelete] TO [bodbSPUNet]
GO 
