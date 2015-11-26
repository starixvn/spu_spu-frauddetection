USE [SPU_FraudDetection]
GO

/****** Object:  StoredProcedure [dbo].[FD_TaskGetForTriggering]    Script Date: 11/26/2015 10:20:42 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


/*
Created: 20150511@LongLuu
Task : Select task info by task id
DB: DB052.SPU_FraudDetection
Original:

Param's Explanation (filtered by):

*/
CREATE Procedure [dbo].[FD_TaskGetForTriggering]
	@TaskId INT
AS
BEGIN
	SET NOCOUNT ON
		SELECT 
			t.TaskId,
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
			t.EventId,
			t.Interval,
			t.IntervalType,
			(CASE
				WHEN w.Active = 0 THEN 0
				ELSE t.Active
			END) as IsActive,
			t.NextActionIdList,
			t.NextActionTargetIdList
	FROM dbo.Tasks t WITH(NOLOCK)
		INNER JOIN Cases w WITH(NOLOCK) on w.CaseId = t.CaseId
		INNER JOIN TaskTrigger tt WITH(NOLOCK) on tt.ActivatorId = @TaskId
	WHERE tt.ActivatedId = t.TaskId and t.Active = 1
END



GO

