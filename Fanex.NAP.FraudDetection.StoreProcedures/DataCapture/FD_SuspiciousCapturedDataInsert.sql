USE [SPU_FraudDetection]
GO

/****** Object:  StoredProcedure [dbo].[FD_SuspiciousCapturedDataInsert]    Script Date: 10/05/2015 09:29:23 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[FD_SuspiciousCapturedDataInsert]
 @CreatorId INT = 0,
 @DataId INT,    
 @MatchId INT,    
 @NewValue DECIMAL(18,4),
 @OldValue DECIMAL(18,4),
 @NewDate DATE,
 @OldDate DATE,
     
 @ErrCode INT = 0 OUTPUT,    
 @ErrMsg NVARCHAR(200) = '' OUTPUT    
AS  
BEGIN
	/*      
	Created: 20150929@Aaron.Cao   
	Task : Register new Group
	Original: [FD_SuspiciousCapturedDataInsert]    
	Revisions:      
	  
	Param's Explanation:      
	• @ErrCode:      
		= 0: Insert successfully.      
		> 0: Specific Error.      
	        
	• @ErrMsg: Error description.      
	*/     
	SET NOCOUNT ON
	  
	INSERT INTO SuspiciousCapturedData 
		  VALUES (@DataId, @MatchId, @NewValue, @OldValue, @NewDate, @OldDate, GETDATE())
		    
    DECLARE @LogData VARCHAR(500), @SPName VARCHAR(100)   
	SELECT @SPName = OBJECT_NAME(@@ProcID)  

	SELECT @LogData = 'Insert suspicious match
	@DataId='+ dbo.SPU_ToString(@DataId) + ',
	@MatchId='+ dbo.SPU_ToString(@MatchId) + ',
	@NewValue='+ dbo.SPU_ToString(@NewValue) + ',
	@OldValue='+ dbo.SPU_ToString(@OldValue) + ',
	@NewDate='+ dbo.SPU_ToString(@NewDate) + ',
	@OldDate='+ dbo.SPU_ToString(@OldDate) + ',	
	Creator='+ dbo.SPU_ToString(@CreatorId)  

	EXEC [dbo].[FD_WriteLog]  
	 @LogTypeId = 68,   
	 @CreatorId = @CreatorId,  
	 @SPName=@SPName,  
	 @Details=@LogData		  
END


GO

