USE [SPU_FraudDetection]
GO

/****** Object:  StoredProcedure [dbo].[FD_TaskGetAll]    Script Date: 11/26/2015 10:21:54 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

/*
Created: 20150511@LongLuu
Task : Select all active tasks
DB: DB052.SPU_FraudDetection

*/
ALTER Procedure [dbo].[FD_TaskGetAll]	
AS
BEGIN
	SET NOCOUNT ON

	SELECT t.TaskId,
			t.TaskName,
			t.TaskDesc,
			t.TaskPreconditions,
			t.TaskPreconditionsOriginal,
			t.TaskPreconditionsFormatted,
			t.TaskRules,
			t.TaskRulesOriginal,
			t.TaskRulesFormatted,
			t.CaseId,
			t.ActivityId,
			t.EventId,
			t.Interval,
			t.IntervalType,
			t.Active as IsActive,
			t.NextActionIdList,
			t.NextActionTargetIdList
	FROM dbo.Tasks t WITH(NOLOCK)
		INNER JOIN dbo.Cases w WITH(NOLOCK) ON t.CaseId = w.CaseId
	 WHERE w.Active = 1
END


GO

