USE [SPU_FraudDetection]
GO

/****** Object:  StoredProcedure [dbo].[FD_TaskBackGroundGetByCaseId]    Script Date: 11/26/2015 10:20:32 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

/*
Created: 20151116@LongLuu
Task : Select tasks by case id
DB: DB052.SPU_FraudDetection
Original:

Param's Explanation (filtered by):

*/
CREATE Procedure [dbo].[FD_TaskBackGroundGetByCaseId]
	@CaseId int
AS
BEGIN
	SET NOCOUNT ON
	SELECT t.TaskId, t.TaskName
	FROM Tasks t WITH(NOLOCK)
	WHERE t.CaseId = @CaseId
END


GO

