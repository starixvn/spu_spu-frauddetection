USE [SPU_FraudDetection]
GO

/****** Object:  StoredProcedure [dbo].[FD_TaskInsert]    Script Date: 11/26/2015 10:21:07 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


ALTER PROCEDURE [dbo].[FD_TaskInsert]   
 @CreatorId int,   
 @TaskName nvarchar(100),    
 @TaskDesc nvarchar(200) = '',     
 @TaskPreconditions nvarchar(1500) = '',    
 @TaskPreconditionsOriginal nvarchar(300) = '',
 @TaskPreconditionsFormatted nvarchar(300) = '',
 @TaskRules nvarchar(max),    
 @TaskRulesOriginal nvarchar(2000),
 @TaskRulesFormatted nvarchar(2000),
 @CaseId int,    
 @Interval int,    
 @IsActive bit = null,   
 @IntervalType nvarchar(10),
 @EventId int,
 @ActivityId int,
 @BackGroundTaskId int,
 @NextActionIdList nvarchar(20), 
 @NextActionTargetIdList nvarchar(20), 
     
 @ErrCode int = 0 OUTPUT,    
 @ErrMsg nvarchar(200) = '' OUTPUT    
AS  
BEGIN
	/*      
	Created: 20150426@LongLuu   
	Task : Register new Task
	Original: [FD_TaskInsert]    
	Revisions:      
	  
	Param's Explanation:      
	• @ErrCode:      
		= 0: Create task successfully.      
		> 0: Specific Error.      
	        
	• @ErrMsg: Error description.      
	*/     
	SET NOCOUNT ON  
	  
	IF Exists(Select 1 From Tasks with (nolock) where TaskName=@TaskName)    
	BEGIN    
	 SELECT @ErrMsg = 'Task has existed. Please choose another one!'  
		  , @ErrCode = 1101  
	 return  
	END     
	  
	Insert into Tasks(  
	 [TaskName]
	 , [TaskDesc]
	 , [TaskPreconditions]
	 , [TaskPreconditionsOriginal]
	 , [TaskPreconditionsFormatted]
	 , [TaskRules]
	 , [TaskRulesOriginal]
	 , [TaskRulesFormatted]
	 , [CaseId]
	 , [Interval]
	 , [Active]
	 , [IntervalType]
	 , [EventId]
	 , [ActivityId]
	 , [NextActionIdList]
	 , [NextActionTargetIdList]
	)
	Values  
	(  
	 @TaskName
	 , @TaskDesc
	 , @TaskPreconditions
	 , @TaskPreconditionsOriginal
	 , @TaskPreconditionsFormatted
	 , @TaskRules
	 , @TaskRulesOriginal
	 , @TaskRulesFormatted
	 , @CaseId
	 , @Interval
	 , @IsActive
	 , @IntervalType
	 , @EventId
	 , @ActivityId
	 , @NextActionIdList
	 , @NextActionTargetIdList
	)  

	select @ErrMsg = @@IDENTITY 
	
	DECLARE @Taskid INT = @@IDENTITY
	
    IF @EventId = 2
    BEGIN         
	    Insert into TaskTrigger (  
		  ActivatorId,
		  ActivatedId
	    )
	    Values (
		  @BackGroundTaskId,
		  @TaskId
	    )
	END 

	if @@error <> 0  
	BEGIN    
	 SELECT @ErrMsg = 'Insert Task failed. Please try again.' 
	 , @ErrCode = 1102    
	      
	 -- ROLLBACK MANUALLY
	 Delete From Tasks With (ROWLOCK) Where TaskName = @TaskName
	      
	 return    
	END    
	  
	Declare @LogData nvarchar(max), @SPName varchar(100)   
	select @SPName = OBJECT_NAME(@@ProcID)  

	Select @LogData = N'Add new Task with 
	TaskName='+ dbo.SPU_ToString(@TaskName) + ',  
	TaskDesc'+ dbo.SPU_ToString(@TaskDesc) + ',  
	TaskPreconditions='+ dbo.SPU_ToString(@TaskPreconditions) + ',
	TaskPreconditionsOriginal='+ dbo.SPU_ToString(@TaskPreconditionsOriginal) + ',
	TaskPreconditionsFormatted='+ dbo.SPU_ToString(@TaskPreconditionsFormatted) + ',
	TaskRules='+ dbo.SPU_ToString(@TaskRules) + ',  
	TaskRulesOriginal='+ dbo.SPU_ToString(@TaskRulesOriginal) + ',  
	TaskRulesFormatted='+ dbo.SPU_ToString(@TaskRulesFormatted) + ',
	CaseId'+ dbo.SPU_ToString(@CaseId) + ',  
	Interval='+ dbo.SPU_ToString(@Interval) + ',
	IntervalType='+ dbo.SPU_ToString(@IntervalType) + ',  
	EventId='+ dbo.SPU_ToString(@EventId) + ',
	ActivityId='+ dbo.SPU_ToString(@ActivityId) + ',  
	NextActionIdList='+ dbo.SPU_ToString(@NextActionIdList) + ',  
	NextActionTargetIdList='+ dbo.SPU_ToString(@NextActionTargetIdList) + ',  
	IsActive='+ dbo.SPU_ToString(@IsActive)   + ', 
	CreatorId='+ dbo.SPU_ToString(@CreatorId)

	EXEC [dbo].[FD_WriteLog]  
	 @LogTypeId = 11,   
	 @CreatorId = @CreatorId,  
	 @SPName=@SPName,  
	 @Details=@LogData  
END	 



GO

