USE [SPU_FraudDetection]
GO

/****** Object:  StoredProcedure [dbo].[FD_DataCaptureGetAllNotComparedMatches]    Script Date: 10/05/2015 09:28:08 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


/****** Object:  Stored Procedure dbo.SPU_CaseIns    Script Date: 04/24/2015 09:39:26 ******/  
CREATE PROCEDURE [dbo].[FD_DataCaptureGetAllNotComparedMatches]    
	@DataIdList VARCHAR(50) = '',
	@MatchIdList VARCHAR(4000) = ''
AS  
BEGIN
	/*      
	Created: 20151001@Aaron.Cao 
	Task : 
	Original: [FD_DataCaptureGetAllNotComparedMatches]
	Revisions:      	  	 
	*/     
	
    DECLARE @tblMatchId AS TABLE (MatchId INT)
    INSERT INTO @tblMatchId
    SELECT CAST(VAL AS INT) AS MatchId
    FROM dbo.strSplit(@MatchIdList,',')
    
    DECLARE @tblDataId AS TABLE (DataId INT)
    INSERT INTO @tblDataId
    SELECT CAST(VAL AS INT) AS DataId
    FROM dbo.strSplit(@DataIdList,',')
    
    SELECT DISTINCT CAST(cd.MatchId AS NVARCHAR(20)) AS MatchId
    FROM [dbo].[CapturedData] cd WITH(NOLOCK)
    WHERE	  cd.MatchId IN (SELECT * FROM @tblMatchId) 
		  AND cd.DataId IN (SELECT * FROM @tblDataId)
		  AND (cd.NewDate <> cd.OldDate
		  OR cd.NewValue <> cd.OldValue)
 END



GO

