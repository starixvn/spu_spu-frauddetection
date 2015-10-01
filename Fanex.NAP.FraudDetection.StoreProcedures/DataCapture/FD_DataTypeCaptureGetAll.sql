USE [SPU_FraudDetection]
GO

/****** Object:  StoredProcedure [dbo].[FD_DataTypeCaptureGetAll]    Script Date: 10/05/2015 09:29:11 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[FD_DataTypeCaptureGetAll] 
AS  
BEGIN
	/*      
	Created: 20150929@Aaron.Cao   
	Task : Get all data types
	Original: [FD_DataTypeCaptureGetAll]    
	Revisions:      
	  
	Param's Explanation:     
	*/     
	SET NOCOUNT ON  
	  
	SELECT dtc.DataId,
		  dtc.DataName
	FROM DataTypeCapture dtc WITH(NOLOCK)
END


GO

