angular.module('ato.compileOnDemand', [])
    .controller('AtoScopeWatchersController', ['$scope', '$timeout', function($scope, $timeout) {
        var prevWatchers = $scope.$$watchers;
        var attached = true;
        function freezeWatchers() {
            prevWatchers = $scope.$$watchers;
        }
        function toggle(b) {
            $scope.$$watchers = b ?
                prevWatchers
                : [];
            attached = b;
        }
        function detach() {
            toggle(false);
        }
        function attach() {
            toggle(true);
        }
        function apply() {
            if(!attached) {
                attach();
                if(!$scope.$$phase) $scope.$apply();
                $timeout(detach, 0, false);
            }
        }
        this.detach = detach;
        this.attach = attach;
        this.apply = apply;
        this.freezeWatchers = freezeWatchers;
        $scope.$on('manualCompile', apply);
        $scope.$on('detachCompile', detach);
        $scope.$on('attachCompile', attach);
    }])
    .directive('atoManualCompile',
    function() {
        return {
            scope: true,
            controller: 'AtoScopeWatchersController',
            link: function(scope, element, attrs, ctrl) {
                ctrl.freezeWatchers();
                ctrl.detach();
                scope.detach = ctrl.detach;
                scope.attach = ctrl.attach;
                scope.apply = ctrl.apply;
            }
        };
    });