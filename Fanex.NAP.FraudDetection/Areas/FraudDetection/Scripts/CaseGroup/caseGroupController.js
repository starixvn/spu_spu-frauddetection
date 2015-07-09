spuApp.directive('csSelect', function () {
    return {
        restrict: 'A',
        require: '^stTable',
        template: '<input type="checkbox"/>',
        scope: { row: '=csSelect' },
        link: function (scope, element, attr, ctrl) {

            element.bind('change', function (evt) {
                scope.$apply(function () {
                    ctrl.select(scope.row, 'multiple');
                });
            });

            scope.$watch('row.isSelected', function (newValue, oldValue) {
                if (newValue === true) {
                    element.parent().addClass('st-selected');
                } else {
                    element.parent().removeClass('st-selected');
                }
            });
        }
    };
});

spuApp.controller('CaseGroupController', [
    '$scope', function ($scope) {

        $scope.rowCollection = [
        {
            GroupId: 1,
            GroupName: 'Group 1',
            GroupDescription: 'Descript 1'
        },
        {
            GroupId: 2,
            GroupName: 'Group 2',
            GroupDescription: 'Descript 2'
        },
        {
            GroupId: 3,
            GroupName: 'Group 3',
            GroupDescription: 'Descript 3'
        }
        ];

        $scope.displayedCollection = [].concat($scope.rowCollection);

    }
]);



