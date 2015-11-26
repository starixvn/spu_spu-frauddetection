USE [SPU_FraudDetection]
GO

/****** Object:  StoredProcedure [dbo].[FD_EventGetAll]    Script Date: 11/26/2015 10:22:16 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

/*
Created: 20150513@LongLuu 
Task : select all actions/events
DB: DB052.SPU_FraudDetection
Original:

Param's Explanation (filtered by):

*/
ALTER Procedure [dbo].[FD_EventGetAll]
AS
BEGIN
	SET NOCOUNT ON

	SELECT act.EventId, act.EventName, act.EventDesc, act.Active as IsActive
	FROM dbo.Events act WITH(NOLOCK)
	WHERE act.Active = 1
	ORDER BY act.EventId
END


GO

