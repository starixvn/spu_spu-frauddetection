SET QUOTED_IDENTIFIER ON 
GO
SET ANSI_NULLS ON 
GO

/****** Object:  Stored Procedure dbo.FD_GroupMemberGetById    Script Date: 10/24/2017 10:41:54 AM ******/

/*
Created: 20170914@Aaron.Cao 
Task : Get member of group by ID
DB: DB052.SPU_FraudDetection
Original:
	- 2017.10.23@Aaron: return SYSTEM or FPS

Param's Explanation:

*/
CREATE PROCEDURE [dbo].[FD_GroupMemberGetById]
    @GroupId INT
AS
BEGIN
	SET NOCOUNT ON
	SELECT
	  cg.CustId
	  ,c.username
	  ,CASE WHEN cg.CreatedBy IS NULL THEN 'SYSTEM' ELSE
			CASE WHEN cg.CreatedBy = 0 THEN 'FPS'
			ELSE c1.username END 
	   END AS CreatedBy
	  ,cg.CreatedDate
  FROM [dbo].[CustomerGroups] cg WITH(NOLOCK)
  INNER JOIN bodb02.dbo.Customer c WITH(NOLOCK) ON c.custid = cg.CustId AND c.roleid = 1
  LEFT JOIN bodb02.dbo.Customer c1 WITH(NOLOCK) ON c1.custid = cg.CreatedBy AND c1.roleid > 4
  WHERE [GroupId] = @GroupId
  ORDER BY cg.CreatedDate DESC
END

/*
GO
GRANT EXECUTE ON [dbo].[FD_GroupMemberGetById] TO [bodbSPUNet]
GO
GRANT VIEW DEFINITION ON [dbo].[FD_GroupMemberGetById] TO [bodbSPUNet]
GO
*/
GO

SET QUOTED_IDENTIFIER OFF 
GO
SET ANSI_NULLS ON 
GO


GO 
 GRANT EXECUTE ON [dbo].[FD_GroupMemberGetById] TO [bodbSPUNet]
GO 
 GRANT VIEW DEFINITION ON [dbo].[FD_GroupMemberGetById] TO [bodbSPUNet]
GO 
