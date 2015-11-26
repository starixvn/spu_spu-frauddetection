USE [SPU_FraudDetection]
GO

/****** Object:  StoredProcedure [dbo].[FD_ActivityGetAll]    Script Date: 11/26/2015 10:19:34 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

/*
Created: 20151113@Aaron
Task : select all activities
DB: DB052.SPU_FraudDetection
Original:

Param's Explanation (filtered by):

*/
CREATE Procedure [dbo].[FD_ActivityGetAll]
AS
BEGIN
	SET NOCOUNT ON

	SELECT act.ActivityId, act.ActivityName, act.ActivityDesc, act.Active as IsActive
	FROM dbo.Activities act WITH(NOLOCK)
	WHERE act.Active = 1
	ORDER BY act.ActivityId
END


GO

