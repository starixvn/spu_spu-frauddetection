USE [SPU_FraudDetection]
GO

/****** Object:  StoredProcedure [dbo].[FD_DataCaptureUpdate]    Script Date: 10/05/2015 09:28:57 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[FD_DataCaptureUpdate] 
    @CreatorId INT = 0,
    @DataIdList VARCHAR(50) = '',
    @MatchIdList VARCHAR(4000) = '',
         
    @ErrCode INT = 0 OUTPUT,    
    @ErrMsg NVARCHAR(200) = '' OUTPUT    
AS  
BEGIN
	/*      
	Created: 20150929@Aaron.Cao   
	Task : 
	Original: [FD_DataCaptureUpdate]   
	Revisions:      
	  
	Param's Explanation:      
	• @ErrCode:      
		= 0: Insert successfully.      
		> 0: Specific Error.      
	        
	• @ErrMsg: Error description.      
	*/     
	SET NOCOUNT ON
	  
    DECLARE @tblMatchId AS TABLE (MatchId INT)
    INSERT INTO @tblMatchId
    SELECT CAST(VAL AS INT) AS MatchId
    FROM dbo.strSplit(@MatchIdList,',')
    
    DECLARE @tblDataId AS TABLE (DataId INT)
    INSERT INTO @tblDataId
    SELECT CAST(VAL AS INT) AS DataId
    FROM dbo.strSplit(@DataIdList,',')
    
    
    UPDATE [dbo].[CapturedData]
    SET OldDate = NewDate, OldValue = NewValue
    WHERE	  MatchId IN (SELECT * FROM @tblMatchId) 
		  AND DataId in (SELECT * FROM @tblDataId)
		  
    DECLARE @LogData VARCHAR(500), @SPName VARCHAR(100)   
	SELECT @SPName = OBJECT_NAME(@@ProcID)  
			  
    SELECT @LogData = 'Data Capture Update with
	@DataIdList =' + @DataIdList  + ',	
	@MatchIdList = ' + @MatchIdList + ' 
	Creator='+ dbo.SPU_ToString(@CreatorId)  

	EXEC [dbo].[FD_WriteLog]  
	 @LogTypeId = 67,   
	 @CreatorId = @CreatorId,  
	 @SPName=@SPName,  
	 @Details=@LogData
END


GO

