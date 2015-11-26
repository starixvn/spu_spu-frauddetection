USE [SPU_FraudDetection]
GO

/****** Object:  StoredProcedure [dbo].[FD_TaskUpdate]    Script Date: 11/26/2015 10:21:27 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


ALTER PROCEDURE [dbo].[FD_TaskUpdate]   
 @CreatorId int,   
 @TaskId int,
 @TaskName nvarchar(100),    
 @TaskDesc nvarchar(200),    
 @TaskPreconditions nvarchar(1500) = '',    
 @TaskPreconditionsOriginal nvarchar(300) = '',
 @TaskPreconditionsFormatted nvarchar(300) = '',
 @TaskRules nvarchar(max),    
 @TaskRulesOriginal nvarchar(2000),
 @TaskRulesFormatted nvarchar(2000),
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
	Task : update Task
	Original: [FD_TaskUpdate]   
	Revisions:      
	  
	Param's Explanation:      
	• @ErrCode:      
		= 0: update task successfully.      
		> 0: Specific Error.      
	        
	• @ErrMsg: Error description.      
	*/     
	SET NOCOUNT ON  
	  
	IF not Exists(Select 1 From Tasks with (nolock) where TaskId = @TaskId)    
	BEGIN    
	 SELECT @ErrMsg = 'Task is not existed. Please choose another one!'  
		  , @ErrCode = 1201  
	 return  
	END   
	
	update Tasks
	set [TaskName] = @TaskName
	 , [TaskDesc] = @TaskDesc
	 , [TaskPreconditions] = @TaskPreconditions
	 , [TaskPreconditionsOriginal] = @TaskPreconditionsOriginal
	 , [TaskPreconditionsFormatted] = @TaskPreconditionsFormatted
	 , [TaskRules] = @TaskRules
	 , [TaskRulesOriginal] = @TaskRulesOriginal
	 , [TaskRulesFormatted] = @TaskRulesFormatted
	 , [Interval] = @Interval
	 , [Active] = @IsActive
	 , [IntervalType] = @IntervalType
	 , [EventId] = @EventId
	 , [ActivityId] = @ActivityId
	 , [NextActionIdList] = @NextActionIdList
	 , [NextActionTargetIdList] = @NextActionTargetIdList
	where [TaskId] = @TaskId
	
    IF @EventId = 2
    BEGIN
	    DELETE FROM TaskTrigger
	    WHERE ActivatedId = @TaskId;
         
	    Insert into TaskTrigger (  
		  ActivatorId,
		  ActivatedId
	    )
	    Values (
		  @BackGroundTaskId,
		  @TaskId
	    )
	END
	
	IF @EventId = 1
     BEGIN
	    DELETE FROM TaskTrigger
	    WHERE ActivatedId = @TaskId;
	END
	

	select @ErrMsg = @@IDENTITY  

	IF @@error <> 0  
	BEGIN    
	 SELECT @ErrMsg = 'Update Task failed. Please try again.' 
	 , @ErrCode = 1202    
	      
	 -- ROLLBACK If there is any error
	 ROLLBACK
	      
	 return    
	END    
	  
	Declare @LogData nvarchar(max), @SPName varchar(100)   
	select @SPName = OBJECT_NAME(@@ProcID)  

	Select @LogData = N'Update Task with 
	TaskId='+ dbo.SPU_ToString(@TaskId) + ',  
	TaskName='+ dbo.SPU_ToString(@TaskName) + ',
	TaskDesc='+ dbo.SPU_ToString(@TaskDesc) + ',  
	TaskPreconditions='+ dbo.SPU_ToString(@TaskPreconditions) + ',
	TaskPreconditionsOriginal='+ dbo.SPU_ToString(@TaskPreconditionsOriginal) + ',
	TaskPreconditionsFormatted='+ dbo.SPU_ToString(@TaskPreconditionsFormatted) + ',
	TaskRules='+ dbo.SPU_ToString(@TaskRules) + ',  
	TaskRulesOriginal='+ dbo.SPU_ToString(@TaskRulesOriginal) + ',  
	TaskRulesFormatted='+ dbo.SPU_ToString(@TaskRulesFormatted) + ',
	Interval='+ dbo.SPU_ToString(@Interval) + ',
	IntervalType='+ dbo.SPU_ToString(@IntervalType) + ',  
	EventId='+ dbo.SPU_ToString(@EventId) + ', 
	ActivityId='+ dbo.SPU_ToString(@ActivityId) + ',
	NextActionIdList='+ dbo.SPU_ToString(@NextActionIdList) + ',  
	NextActionTargetIdList='+ dbo.SPU_ToString(@NextActionTargetIdList) + ',  
	IsActive='+ dbo.SPU_ToString(@IsActive)   + ', 
	CreatorId='+ dbo.SPU_ToString(@CreatorId)

	EXEC [dbo].[FD_WriteLog]  
	 @LogTypeId = 12,   
	 @CreatorId = @CreatorId,  
	 @SPName=@SPName,  
	 @Details=@LogData  
END	 



GO

