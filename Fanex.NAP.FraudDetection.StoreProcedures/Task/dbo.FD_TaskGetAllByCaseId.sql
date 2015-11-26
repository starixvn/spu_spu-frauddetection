USE [SPU_FraudDetection]
GO

/****** Object:  StoredProcedure [dbo].[FD_TaskGetAllByCaseId]    Script Date: 11/26/2015 10:20:53 ******/
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
ALTER Procedure [dbo].[FD_TaskGetAllByCaseId]
	@CaseId int,
	@PageSize int = 30,  
	@PageIndex int = 1,  
	
	@PageCount int = 0 OUTPUT,  
	@RowCount int = 0 OUTPUT  
AS
BEGIN
	SET NOCOUNT ON

	SELECT @RowCount = count(1)   
	FROM Tasks t WITH(NOLOCK)
	WHERE t.CaseId = @CaseId

	SELECT @PageCount=@RowCount/@PageSize + case when @RowCount%@PageSize>0 then 1 else 0 end;  
	  
	WITH Results AS  
	( 
		SELECT top (@PageSize*@PageIndex)  ROW_NUMBER() OVER (ORDER BY TaskId ASC) AS Row
			,t.TaskId, t.TaskName, t.TaskDesc, e.EventName as Type, t.Active
		FROM dbo.Tasks t WITH (NOLOCK)
			INNER JOIN dbo.Events e WITH(NOLOCK) on e.EventId = t.EventId
		WHERE CaseId = @CaseId
	)

	SELECT  [Row], TaskId, TaskName, TaskDesc, Type, Active
	FROM Results  
	WHERE  [Row] BETWEEN @PageSize * (@PageIndex-1) + 1 and @PageIndex*@PageSize  
	ORDER BY [Row]  
END


GO

