USE [SPU_FraudDetection]
GO

/****** Object:  StoredProcedure [dbo].[FD_DailyDataMonitoringReportGetAll]    Script Date: 11/27/2015 10:17:54 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


ALTER PROCEDURE [dbo].[FD_DailyDataMonitoringReportGetAll]
     @EventDateFrom			DATE
    ,@EventDateTo			DATE
    ,@MoveBetDate			DATE
    ,@BalanceUpDate			DATE
AS

BEGIN

    /*      
	Created: 20151028@Long.Luu
	Task : Daily Data Monitoring report
	Original: [FD_DailyDataMonitoringReportGetAll]
	Revisions:      
	  
	Param's Explanation:    
	*/     
	SET NOCOUNT ON;

	DECLARE @Data TABLE (HomeId INT, AwayId INT, EventDate DATE, DataType VARCHAR(100), OldDate DATE, OldValue DECIMAL(18, 4), NewDate DATE, NewValue DECIMAL(18, 4))
	
	IF @EventDateFrom >= @MoveBetDate
		BEGIN
			INSERT INTO @Data
			SELECT m.homeid, 
				m.awayid,
				m.eventdate,
				dtc.DataName,
				scd.OldDate,
				scd.OldValue,
				scd.NewDate,
				scd.NewValue
			FROM SuspiciousCapturedData scd WITH(NOLOCK)
				LEFT JOIN DataTypeCapture dtc WITH(NOLOCK) ON scd.DataId = dtc.DataId
				LEFT JOIN bodb02.dbo.match m WITH(NOLOCK) ON scd.MatchId = m.matchid
			WHERE m.eventdate BETWEEN @EventDateFrom AND @EventDateTo
		END	
	ELSE IF @EventDateFrom >= @BalanceUpDate AND @EventDateTo <@MoveBetDate
		BEGIN
			SELECT m14.homeid, 
				m14.awayid,
				m14.eventdate,
				dtc.DataName,
				scd.OldDate,
				scd.OldValue,
				scd.NewDate,
				scd.NewValue
			FROM SuspiciousCapturedData scd WITH(NOLOCK)
				LEFT JOIN DataTypeCapture dtc WITH(NOLOCK) ON scd.DataId = dtc.DataId
				LEFT JOIN bodb02.dbo.match14 m14 WITH(NOLOCK) ON scd.MatchId = m14.matchid
			WHERE m14.eventdate BETWEEN @EventDateFrom AND @EventDateTo
		END
	ELSE IF @EventDateTo < @BalanceUpDate
		BEGIN
			SELECT mbk.homeid, 
				mbk.awayid,
				mbk.eventdate,
				dtc.DataName,
				scd.OldDate,
				scd.OldValue,
				scd.NewDate,
				scd.NewValue
			FROM SuspiciousCapturedData scd WITH(NOLOCK)
				LEFT JOIN DataTypeCapture dtc WITH(NOLOCK) ON scd.DataId = dtc.DataId
				LEFT JOIN DBARC.bodb_Archive.dbo.match_bk mbk WITH(NOLOCK) ON scd.MatchId = mbk.matchid
			WHERE mbk.eventdate BETWEEN @EventDateFrom AND @EventDateTo
		END
	ELSE
		BEGIN
			INSERT INTO @Data
			SELECT ISNULL(m.homeid,ISNULL(m14.homeid,mbk.homeid)), 
				ISNULL(m.awayid,ISNULL(m14.awayid,mbk.awayid)), 
				ISNULL(m.eventdate,ISNULL(m14.eventdate,mbk.eventdate)),
				dtc.DataName,
				scd.OldDate,
				scd.OldValue,
				scd.NewDate,
				scd.NewValue
			FROM SuspiciousCapturedData scd WITH(NOLOCK)
				LEFT JOIN DataTypeCapture dtc WITH(NOLOCK) ON scd.DataId = dtc.DataId
				LEFT JOIN bodb02.dbo.match m WITH(NOLOCK) on scd.MatchId = m.matchid
				LEFT JOIN bodb02.dbo.match14 m14 WITH(NOLOCK) on scd.MatchId = m14.matchid
				LEFT JOIN DBARC.bodb_Archive.dbo.match_bk mbk WITH(NOLOCK) ON scd.MatchId = mbk.matchid
			WHERE (m.eventdate BETWEEN @EventDateFrom AND @EventDateTo)
				OR (m14.eventdate BETWEEN @EventDateFrom AND @EventDateTo)
				OR (mbk.eventdate BETWEEN @EventDateFrom AND @EventDateTo)
		END	
			
	SELECT *
	FROM @Data		
END




GO

