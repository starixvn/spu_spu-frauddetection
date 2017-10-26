
SET QUOTED_IDENTIFIER ON 
GO
SET ANSI_NULLS ON 
GO

/****** Object:  Stored Procedure dbo.FD_FlaggedAccountInsert    Script Date: 10/25/2017 2:48:15 PM ******/
CREATE PROCEDURE [dbo].[FD_FlaggedAccountInsert] 

	@EviCode NVARCHAR(10)

	,@DirectAccounts NVARCHAR(MAX)

	,@IndirectAccounts NVARCHAR(MAX)

	

	,@ErrCode INT = 0 OUTPUT

	,@ErrMsg NVARCHAR(200) = '' OUTPUT

AS

/*

	Created: 20161208@Aaron 

	Task : Insert Flagged Accounts

	DB: DB052.SPU_FraudDetection

	Original:

	Revisions:

			- 20171025@Aaron: get custid by username, username2


	Param's Explanation (filtered by):

*/

BEGIN

	SET NOCOUNT ON;



	DECLARE @tblFlaggedAccount TABLE (

		CustName NVARCHAR(50)

		,EviCode NVARCHAR(50)

		,LevelId TINYINT

		)

	DECLARE @tblCustomer TABLE (CustName NVARCHAR(50))



	IF ISNULL(@DirectAccounts, '') <> ''

	BEGIN

		INSERT INTO @tblCustomer (CustName)

		SELECT VAL AS CustName

		FROM dbo.SPU_StrSplit(@DirectAccounts, ',')



		INSERT INTO @tblFlaggedAccount (

			CustName

			,EviCode

			,LevelId

			)

		SELECT DISTINCT CustName

			,@EviCode

			,1

		FROM @tblCustomer



		DELETE @tblCustomer

	END



	IF ISNULL(@IndirectAccounts, '') <> ''

	BEGIN

		INSERT INTO @tblCustomer (CustName)

		SELECT VAL AS CustName

		FROM dbo.SPU_StrSplit(@IndirectAccounts, ',')



		INSERT INTO @tblFlaggedAccount (

			CustName

			,EviCode

			,LevelId

			)

		SELECT DISTINCT CustName

			,@EviCode

			,2

		FROM @tblCustomer

	END

	

	INSERT INTO dbo.FlaggedCustomers (

		CustId

		,CustName

		,EviCode

		,LevelId

		)

	SELECT cus.custid

		,cus.username

		,fa.EviCode

		,fa.LevelId

	FROM @tblFlaggedAccount fa

	LEFT JOIN bodb02.dbo.Customer cus WITH (NOLOCK) ON cus.username = fa.CustName

	WHERE NOT EXISTS (

			SELECT TOP 1 1

			FROM dbo.FlaggedCustomers fc WITH (NOLOCK)

			WHERE fc.CustName = fa.CustName

				AND fc.EviCode = fa.EviCode

				AND fc.LevelId = fa.LevelId

			)

			AND (cus.roleid <= 4)-- OR cus.custid IS NULL)

	UNION

	SELECT cus.custid

		,cus.username

		,fa.EviCode

		,fa.LevelId

	FROM @tblFlaggedAccount fa

	LEFT JOIN bodb02.dbo.Customer cus WITH (NOLOCK) ON cus.username2 = fa.CustName

	WHERE NOT EXISTS (

			SELECT TOP 1 1

			FROM dbo.FlaggedCustomers fc WITH (NOLOCK)

			WHERE fc.CustName = fa.CustName

				AND fc.EviCode = fa.EviCode

				AND fc.LevelId = fa.LevelId

			)

			AND (cus.roleid <= 4)-- OR cus.custid IS NULL)



	DECLARE @LogData VARCHAR(500)

		,@SPName VARCHAR(100)



	SELECT @SPName = OBJECT_NAME(@@ProcID)



	SELECT	@LogData = 'Insert flagged accounts with 

			EviCode=' + dbo.SPU_ToString(@EviCode) + ',  

			DirectAccounts=' + dbo.SPU_ToString(@DirectAccounts) + ',  

			IndirectAccounts=' + dbo.SPU_ToString(@IndirectAccounts)



	EXEC [dbo].[FD_WriteLog] 

		 @LogTypeId = 101

		,@CreatorId = 0

		,@SPName = @SPName

		,@Details = @LogData

END



/*

GO

GRANT EXECUTE

	ON [dbo].[FD_FlaggedAccountInsert]

	TO [bodbSPUNet]

GO



GRANT VIEW DEFINITION

	ON [dbo].[FD_FlaggedAccountInsert]

	TO [bodbSPUNet]

GO

*/
GO

SET QUOTED_IDENTIFIER OFF 
GO
SET ANSI_NULLS ON 
GO


GO 
 GRANT EXECUTE ON [dbo].[FD_FlaggedAccountInsert] TO [bodbSPUNet]
GO 
 GRANT VIEW DEFINITION ON [dbo].[FD_FlaggedAccountInsert] TO [bodbSPUNet]
GO 
