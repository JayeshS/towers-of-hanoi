var tohModule = angular.module('TowersOfHanoi', []);

tohModule.controller('diskController', function($scope) {
    $scope.src = {
        name: 'Src',
        values: [1, 2, 3]
    };
    $scope.dest = { name: 'Dest', values: [] };
    $scope.aux = { name: 'Aux', values: [] };

    console.info("Added $scope.src: " + $scope.src.values);

    function solveToh(src, aux, dest, /*Optional*/ discNum) {
        if (typeof discNum === 'undefined') {
            discNum = src.values.length;
        }
        function move(src, dest) {
            console.log('Move from ' + src.name + ' to ' + dest.name);
            var disk = src.values.pop();
            dest.values.push(disk);
        }

        if (discNum > 0) {
            solveToh(src, dest, aux, discNum - 1);
            move(src, dest);
            solveToh(aux, src, dest, discNum - 1);
        }
    }

    $scope.solve = function() {
        solveToh($scope.src, $scope.aux, $scope.dest);
    }

});
