USE [SPU_FraudDetection]
GO

/****** Object:  StoredProcedure [dbo].[FD_TaskGetByCaseId]    Script Date: 11/26/2015 10:21:43 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


/*
Created: 20150511@LongLuu
Task : Select tasks by case id
DB: DB052.SPU_FraudDetection
Original:

Param's Explanation (filtered by):

*/
ALTER Procedure [dbo].[FD_TaskGetByCaseId]
	@CaseId int
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
			tt.ActivatorId as BackGroundTaskId,
			t.Active as IsActive,
			t.NextActionIdList,
			t.NextActionTargetIdList
	FROM dbo.Tasks t WITH(NOLOCK)
	LEFT JOIN TaskTrigger tt on t.TaskId = tt.ActivatedId
	WHERE CaseId = @CaseId and t.EventId = 1 and t.Active = 1
END


GO

