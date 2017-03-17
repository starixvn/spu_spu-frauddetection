SET QUOTED_IDENTIFIER ON 
GO
SET ANSI_NULLS ON 
GO

/****** Object:  Stored Procedure dbo.FD_LiveMatchMonitoringReportGetAll    Script Date: 3/17/2017 11:20:07 AM ******/

CREATE PROCEDURE [dbo].[FD_LiveMatchMonitoringReportGetAll] 
	 @EventDate DATE = '2016-12-03'
	,@LeagueIds NVARCHAR(MAX) = '3'
	,@MatchCode NVARCHAR(50) = ''
	,@IsMainMarket BIT = NULL
	,@IsVerified BIT = NULL
	,@MatchStatus NVARCHAR(20) = 'All'
	,@IsTest    BIT = 1
	,@NumberOfCases INT = 0 OUTPUT
AS
BEGIN
	/*      
	Created: 20160622@Harvey.Nguyen
	Task : Live Match Monitoring report
	Original: 
	Revisions:
				- 20170308@Aaron: Added IsVerified parameter
	  
	Param's Explanation:    
	*/
	DECLARE @sql NVARCHAR(max)

	SELECT @NumberOfCases = COUNT(*)
	FROM dbo.Cases s WITH (NOLOCK)
	WHERE s.TypeId = 2 AND s.IsTest <= @IsTest

	--get all active bettype from fact table (for dynamic pivot)
	SELECT DISTINCT s.CaseId, s.CaseName
	INTO #livecases
	FROM dbo.Cases s WITH (NOLOCK)
	WHERE s.TypeId = 2 AND s.IsTest <= @IsTest AND s.Active = 1

	SELECT @sql = 'DECLARE @LeagueTable AS TABLE (leagueid INT)
					INSERT INTO @LeagueTable (leagueid)
					SELECT CAST(VAL as INT)  AS leagueid
					FROM dbo.SPU_StrSplit(''' + @LeagueIds + ''','','')
					DECLARE @Suspicious AS TABLE(matchid int, caseid int)
					INSERT INTO @Suspicious
					SELECT DISTINCT si.MatchId, si.CaseId
					FROM dbo.SuspiciousInfo si WITH(NOLOCK)
					WHERE si.eventdate = ''' + dbo.SPU_ToString(@EventDate) + '''
					
					SELECT m.matchid, l.leaguename, m.matchcode, lmv.IsVerified,lmv.LastVerifiedBy, lmv.LastVerifiedDate, m.homeid, m.awayid, m.kickofftime, m.livehomescore, m.liveawayscore, m.eventstatus,'

	--generate pivot bettype column list for count no. of bettype offered for each match
	SELECT @sql = @sql + 'SUM(CASE WHEN mid IS NULL THEN -1 ELSE CASE WHEN cid = ' + convert(VARCHAR(3), c.CaseId) + ' THEN
		CASE WHEN s.CaseId IS NULL THEN 0 ELSE CASE WHEN cid = s.Caseid THEN lr.NewBetCount ELSE 0 END END ELSE null END END) [' + c.CaseName + '],'
	FROM #livecases c WITH(NOLOCK)
	
	SELECT @sql = left(@sql, len(@sql) - 1)

	SELECT @sql = @sql + '
			FROM @Suspicious AS s
				RIGHT JOIN bodb02.dbo.match m WITH(NOLOCK) ON s.matchid = m.matchid
				LEFT JOIN (SELECT DISTINCT sm.MatchId as mid, t.CaseId as cid
					FROM dbo.ScannedMatches sm WITH(NOLOCK)
						INNER JOIN dbo.Tasks t WITH(NOLOCK) ON sm.TaskId = t.TaskId) temp on temp.mid = m.matchid
				INNER JOIN bodb02.dbo.league l WITH(NOLOCK) ON m.leagueid = l.leagueid
				LEFT JOIN dbo.LiveMonitoringVerification lmv WITH(NOLOCK) ON m.matchid = lmv.MatchId
				LEFT JOIN dbo.LiveMonitoringReport lr WITH(NOLOCK) ON m.matchid = lr.MatchId AND s.caseid = lr.CaseId'

	SELECT @sql = @sql + ' WHERE m.eventdate = ''' + dbo.SPU_ToString(@EventDate) + ''' AND m.leagueid IN ('+ @LeagueIds + ')'

	IF @IsMainMarket IS NOT NULL
	BEGIN
		SELECT @sql = @sql + ' AND l.IsMainMarket = ' + dbo.SPU_ToString(@IsMainMarket)
	END

	IF @MatchCode <> ''
	BEGIN
		SELECT @sql = @sql + ' AND m.matchcode = ''' + @MatchCode + ''''
	END
	
	IF @MatchStatus <> 'All'
	BEGIN
		SELECT @sql = @sql + ' AND m.eventstatus = ''' + @MatchStatus + ''''
	END
	ELSE
	BEGIN
		SELECT @sql = @sql + ' AND m.eventstatus in (''completed'', ''running'')'
	END

	IF @IsVerified IS NOT NULL
	BEGIN
		SELECT @sql = @sql + ' AND CAST(ISNULL(lmv.IsVerified,0) AS BIT) = ' + dbo.SPU_ToString(@IsVerified)
	END
	
	SELECT @sql = @sql + ' GROUP BY m.matchid, l.leaguename, m.matchcode, m.homeid, m.awayid, m.kickofftime, m.livehomescore, m.liveawayscore, m.eventstatus,lmv.IsVerified,lmv.LastVerifiedBy, lmv.LastVerifiedDate'

	--SELECT @sql = @sql + ' ORDER BY CAST(ISNULL(lmv.IsVerified,0) AS BIT), m.kickofftime, m.matchid'

	DROP TABLE #livecases

	--PRINT (@sql)
	EXEC (@sql)
END

/*
GO
GRANT EXECUTE ON [dbo].[FD_LiveMatchMonitoringReportGetAll] TO [bodbSPUNet]
GO
GRANT VIEW DEFINITION ON [dbo].[FD_LiveMatchMonitoringReportGetAll] TO [bodbSPUNet]
GO
*/
GO

SET QUOTED_IDENTIFIER OFF 
GO
SET ANSI_NULLS ON 
GO


GO 
 GRANT EXECUTE ON [dbo].[FD_LiveMatchMonitoringReportGetAll] TO [bodbSPUNet]
GO 
 GRANT VIEW DEFINITION ON [dbo].[FD_LiveMatchMonitoringReportGetAll] TO [bodbSPUNet]
GO 
