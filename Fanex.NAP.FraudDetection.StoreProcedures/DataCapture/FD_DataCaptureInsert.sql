USE [SPU_FraudDetection]
GO

/****** Object:  StoredProcedure [dbo].[FD_DataCaptureInsert]    Script Date: 10/05/2015 09:28:42 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[FD_DataCaptureInsert]
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
	Original: [FD_DataCaptureInsert]    
	Revisions:      
	  
	Param's Explanation:      
	• @ErrCode:      
		= 0: Insert successfully.      
		> 0: Specific Error.      
	        
	• @ErrMsg: Error description.      
	*/     
	SET NOCOUNT ON
	  
	IF Exists(SELECT 1 FROM CapturedData WITH(NOLOCK) WHERE MatchId = @MatchId AND DataId = @DataId)    
	   BEGIN
		  UPDATE CapturedData SET NewValue = @NewValue, NewDate = GETDATE() WHERE MatchId = @MatchId AND DataId = @DataId
	   END
	ELSE 
	   BEGIN
		  INSERT INTO CapturedData 
		  VALUES (@DataId, @MatchId, @NewValue, @NewValue, GETDATE(), GETDATE())
	   END 
	   
	DECLARE @LogData VARCHAR(500), @SPName VARCHAR(100)   
	SELECT @SPName = OBJECT_NAME(@@ProcID)  

	SELECT @LogData = 'Data Capture Insert with
	@DataId =' + dbo.SPU_ToString(@DataId)  + ',	
	@MatchId = ' + dbo.SPU_ToString(@MatchId) + ', 
	@NewValue = ' + dbo.SPU_ToString(@NewValue) + ', 
	Creator='+ dbo.SPU_ToString(@CreatorId)  

	EXEC [dbo].[FD_WriteLog]  
	 @LogTypeId = 66,   
	 @CreatorId = @CreatorId,  
	 @SPName=@SPName,  
	 @Details=@LogData
END


GO

