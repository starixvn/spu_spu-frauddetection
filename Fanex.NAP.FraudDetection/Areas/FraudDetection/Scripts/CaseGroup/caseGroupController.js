
spuApp.controller('CaseGroupController', [
    '$scope', 'CaseGroupService', function ($scope, CaseGroupService) {



        $scope.caseId = caseId;

        var convertRowCollection = function (groups) {
            var rows = [];
            $.each(groups, function (idx, item) {
                var newItem = $.extend(true, {}, item, { isSelected: false });
                rows.push(newItem);
            });

            return rows;
        };

        $scope.rowCollection = convertRowCollection(groups);

        $scope.isSelectAll = false;

        $scope.selectAll = function () {
            $scope.isSelectAll = !$scope.isSelectAll;
            $.each($scope.rowCollection, function (idx, item) {
                item.isSelected = $scope.isSelectAll;
            });
        };

        var hasAllSelectedRows = function () {
            var isSelectAll = true;
            $.each($scope.rowCollection, function (idx, item) {
                if (!item.isSelected) {
                    isSelectAll = false;
                    return;
                }
            });

            return isSelectAll;
        };

        $scope.selectRow = function (index) {
            $scope.rowCollection[index].isSelected = !$scope.rowCollection[index].isSelected;
            $scope.isSelectAll = hasAllSelectedRows();
        };

        var collectCustomerGroup = function () {
            var selectedGroups = [];

            $.each($scope.rowCollection, function (idx, item) {
                if (item.isSelected) {
                    selectedGroups.push(item.GroupId);
                }
            });

            return selectedGroups;
        };

        $scope.submitData = function () {
            var selectedGroups = collectCustomerGroup();

            if (selectedGroups.length === 0) {
                AlertService.showAlert("Please choose at leat one customer group!");
                return;
            }

            var param = {
                caseId: $scope.caseId,
                groupIds: selectedGroups.join(',')
            };

            CaseGroupService.addCustomerGroupToCase(param).then(function (result) {
                var data = result.data;

                if (data.IsSuccessful) {
                    if (parent.CaseGroupGridService !== undefined) {
                        parent.CaseGroupGridService.getCustomerGroupByCase();
                    }

                    setTimeout(function () {
                        DialogService.closeDialog();
                    }, 3000);
                }

                AlertService.showAlert(data);
            });
        };

        $scope.closeDialog = function() {
            DialogService.closeDialog();
        };

        $scope.$watch($scope.rowCollection, function () {

        });
    }
]);



