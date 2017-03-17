
SET QUOTED_IDENTIFIER ON 
GO
SET ANSI_NULLS ON 
GO

/****** Object:  Stored Procedure dbo.FD_SuspiciousBetCountInsert    Script Date: 3/17/2017 11:20:07 AM ******/

CREATE PROCEDURE [dbo].[FD_SuspiciousBetCountInsert] 
	@CreatorId INT = 0
	,@suspiciousDoc VARCHAR(MAX)
	
	,@ErrCode INT = 0 OUTPUT
	,@ErrMsg NVARCHAR(200) = '' OUTPUT
AS
BEGIN
	/*      
	Created: 20161205@Aaron
	Task : Insert suspicious bet count for live matches.
	Original: [FD_SuspiciousBetCountInsert]
	Revisions:      
	  
	Param's Explanation:      
	• @ErrCode:      
		= 0: Insert list of suspicious info successfully.      
		> 0: Specific Error.      
	        
	• @ErrMsg: Error description.      
	*/
	SET NOCOUNT ON

	DECLARE @tblSuspicions TABLE (
		MatchId INT
		,CaseId INT
		,BetCount INT
		,IsDone BIT DEFAULT(0)
		)
	DECLARE @idoc INT

	--Create an internal representation of the XML document.
	EXEC sp_xml_preparedocument @idoc OUTPUT
		,@suspiciousDoc

	-- Execute a SELECT statement that uses the OPENXML rowset provider.
	INSERT INTO @tblSuspicions (
		MatchId
		,CaseId
		,BetCount
		)
	SELECT 
		Data.MatchId
		,Data.CaseId
		,Data.BetCount
	FROM OPENXML(@idoc, '/Root/Row', 2) WITH (
			MatchId INT
			,CaseId INT
			,BetCount INT
			) AS Data
	
	DECLARE @matchId INT, @caseId INT, @betCount INT
	
	WHILE 1 = 1
	BEGIN
		SELECT @matchId = NULL, @caseId = NULL, @betCount = NULL
		
		SELECT TOP 1 
			@matchId = MatchId
			,@caseId = CaseId
			,@betCount = BetCount
		FROM @tblSuspicions
		WHERE IsDone = 0
		
		IF @@ROWCOUNT = 0
		BEGIN
			DECLARE @LogData VARCHAR(500)
					,@SPName VARCHAR(100)

			SELECT @SPName = OBJECT_NAME(@@ProcID)

			SELECT @LogData = 'Insert list of bet count with
					suspicionDoc=' + @suspiciousDoc + ',		
					Creator=' + dbo.SPU_ToString(@CreatorId)

			EXEC [dbo].[FD_WriteLog] 
				@LogTypeId = 96
				,@CreatorId = @CreatorId
				,@SPName = @SPName
				,@Details = @LogData
				
			RETURN
		END
		
		UPDATE @tblSuspicions
		SET IsDone = 1
		WHERE MatchId = @matchId
		
		DECLARE @oldBetCount INT = 0
		
		IF EXISTS(SELECT TOP 1 1 FROM dbo.LiveMonitoringReport lr (NOLOCK) WHERE lr.MatchId = @matchId AND lr.CaseId = @caseId)
		BEGIN
			SELECT @oldBetCount = NewBetCount
			FROM dbo.LiveMonitoringReport WITH(NOLOCK)
			WHERE MatchId = @matchId AND CaseId = @caseId
			
			IF @oldBetCount <> @betCount
			BEGIN
				UPDATE	dbo.LiveMonitoringVerification WITH (ROWLOCK, UPDLOCK)
				SET		IsVerified = 0
				WHERE	MatchId = @matchId
			END 
		
			UPDATE dbo.LiveMonitoringReport WITH(ROWLOCK, UPDLOCK)
			SET BetCount = NewBetCount, NewBetCount = @betCount
			WHERE MatchId = @matchId AND CaseId = @caseId
		END
		ELSE
		BEGIN
			INSERT INTO dbo.LiveMonitoringReport (MatchId, CaseId, BetCount, NewBetCount)
			VALUES(@matchId, @caseId, 0, @betCount)
		END		
	END
END

/*
GO
GRANT EXECUTE ON [dbo].[FD_SuspiciousBetCountInsert] TO [bodbSPUNet]
GO
GRANT VIEW DEFINITION ON [dbo].[FD_SuspiciousBetCountInsert] TO [bodbSPUNet]
GO
*/

GO

SET QUOTED_IDENTIFIER OFF 
GO
SET ANSI_NULLS ON 
GO


GO 
 GRANT EXECUTE ON [dbo].[FD_SuspiciousBetCountInsert] TO [bodbSPUNet]
GO 
 GRANT VIEW DEFINITION ON [dbo].[FD_SuspiciousBetCountInsert] TO [bodbSPUNet]
GO 
