/**
 * Created by wuxiangan on 2017/3/29.
 */

define([
    'app',
    'text!html/footer.html',
    'helper/util',
], function (app, htmlContent, util) {
    app.controller("footerController", ['$scope', function ($scope) {
        function init() {
            $scope.serverUpdateTime =  config.wikiConfig.serverUpdateTime;
        }
        $scope.$watch('$viewContentLoaded', init);

        $scope.goContact = function () {
            util.go("contact",true);
        }
    }]);

    return htmlContent;
});

