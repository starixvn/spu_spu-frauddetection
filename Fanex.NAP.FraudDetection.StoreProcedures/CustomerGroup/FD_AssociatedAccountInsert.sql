SET QUOTED_IDENTIFIER ON 
GO
SET ANSI_NULLS ON 
GO


ALTER PROCEDURE [dbo].[FD_AssociatedAccountInsert]   
	@CustNameList nvarchar(MAX),
	@GroupId int,
	@CaseId int,  
   
	@ErrCode int = 0 OUTPUT,    
	@ErrMsg nvarchar(200) = '' OUTPUT    
AS  
BEGIN
	/*      
	Created: 20171012@Aaron   
	Task : Assign customers to group
	Original: 
	Revisions:
		- 20171025@Aaron: get custid by username, username2
	  
	Param's Explanation:      
	• @ErrCode:      
		= 0: Assign customer to group successfully.      
		> 0: Specific Error.      
	        
	• @ErrMsg: Error description.      
	*/     
	SET NOCOUNT ON  

	DECLARE @custIds AS TABLE (custId INT)

	SELECT t.val
	INTO #tmp
	FROM dbo.SPU_StrSplit(@CustNameList,',') t

	INSERT INTO @custIds (custId)
	SELECT c.custid
	FROM #tmp
	 INNER JOIN bodb02.dbo.Customer c WITH(NOLOCK) ON VAL = c.username 
	WHERE c.roleid = 1
	UNION
	SELECT c.custid
	FROM #tmp
	 INNER JOIN bodb02.dbo.Customer c WITH(NOLOCK) ON VAL = c.username2
	WHERE c.roleid = 1

	DROP TABLE #tmp

	-- Delete accounts not associated anymore
	DELETE cg
	FROM dbo.CustomerGroups cg
	WHERE cg.CaseId = @CaseId AND cg.CustId NOT IN (SELECT custId FROM @custIds)
			AND cg.CreatedBy = 0 AND GroupId = @GroupId

	-- Determine old customer in that case
	DECLARE @OldCustomers AS TABLE (custId INT)

	INSERT INTO @OldCustomers(custId)
	SELECT CustId
	FROM dbo.CustomerGroups WITH(NOLOCK)
	WHERE CustId IN (SELECT custId FROM @custIds)
			 AND GroupId = @GroupId

	-- Determine new customer in that case
	DECLARE @NewCustomers AS TABLE (custId INT)

	INSERT INTO @NewCustomers(custId)
	SELECT custId FROM @custIds
	EXCEPT
	SELECT custId FROM @OldCustomers

	DECLARE @NewCustomerGroups AS TABLE (custId INT, groupId INT, caseId INT)
	DECLARE @createddate DATETIME
	SET @createddate = GETDATE()

	INSERT dbo.CustomerGroups(CustId, GroupId, CaseId, CreatedBy, CreatedDate)
	SELECT custId, @GroupId, @CaseId, 0, @createddate
	FROM @NewCustomers	
 	  
	Declare @LogData varchar(500), @SPName varchar(100)   
	select @SPName = OBJECT_NAME(@@ProcID)  

	Select @LogData = 'Assign customer to group with
	CustNameList='+ @CustNameList + ',	
	GroupId = ' + dbo.SPU_ToString(@GroupId) + ', 
	CaseId = ' + dbo.SPU_ToString(@CaseId) + ', 
	Creator='+ dbo.SPU_ToString(0)  

	EXEC [dbo].[FD_WriteLog]  
	 @LogTypeId = 16,   
	 @CreatorId = 0,  
	 @SPName=@SPName,  
	 @Details=@LogData  
 END

 /*
GO
GRANT EXECUTE ON [dbo].[FD_AssociatedAccountInsert] TO [bodbSPUNet]
GO
GRANT VIEW DEFINITION ON [dbo].[FD_AssociatedAccountInsert] TO [bodbSPUNet]
GO
*/

GO

SET QUOTED_IDENTIFIER OFF 
GO
SET ANSI_NULLS ON 
GO


GO 
 GRANT EXECUTE ON [dbo].[FD_AssociatedAccountInsert] TO [bodbSPUNet]
GO 
 GRANT VIEW DEFINITION ON [dbo].[FD_AssociatedAccountInsert] TO [bodbSPUNet]
GO 
