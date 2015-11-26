USE [SPU_FraudDetection]
GO

/****** Object:  StoredProcedure [dbo].[FD_ConfigsGetByActivity]    Script Date: 11/26/2015 10:20:11 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

/*
Created: 20150513@LongLuu 
Task : select all configurations
DB: DB052.SPU_FraudDetection
Original:

Param's Explanation (filtered by):

*/
CREATE Procedure [dbo].[FD_ConfigsGetByActivity]
    @ActivityId INT
AS
BEGIN
	SET NOCOUNT ON

	SELECT config.ConfigId, 
		config.ConfigName, 
		config.ConfigCategory, 
		config.ConfigControlType, 
		config.ConfigSQLTable, 
		config.ConfigSQLField, 
		config.ConfigSQLReturn
	FROM dbo.Configurations config WITH(NOLOCK)
	WHERE config.ActivityIds LIKE '%' + CAST(@ActivityId AS NVARCHAR) + '%'
END


GO

