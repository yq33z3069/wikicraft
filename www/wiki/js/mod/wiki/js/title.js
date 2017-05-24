
define([
    'app',
    'helper/util',
    'text!wikimod/wiki/html/title.html',
], function (app, util, htmlContent) {

    // 使用闭包使模块重复独立使用
    function registerController(wikiblock) {
        // 比赛类活动奖励控制器
        app.registerController("titleController", ['$scope', function ($scope) {
            $scope.imgsPath = config.wikiModPath + 'wiki/assets/imgs/';
            $scope.modParams = angular.copy(wikiblock.modParams || {});

            function init() {
                console.log("----------init game rewards---------");
            }

            $scope.$watch("$viewContentLoaded", init);
        }]);
    }

    return {
        render: function (wikiblock) {
            registerController(wikiblock);
            return htmlContent;
        }
    }
});

/*
```@wiki/js/title
{
    "moduleKind":"title1",
    "title":"大赛简介",
    "params":[
    "比赛介绍比赛介绍比赛介绍比赛介绍比赛介绍比赛介绍比赛介绍比赛介绍比赛介绍比赛介绍比赛介绍比赛介绍"
    ]
}
```
*/