/**
 * Created by wuxiangan on 2016/12/21.
 */

define(['app', 'helper/util', 'helper/storage', 'text!html/siteshow.html'], function (app, util, storage, htmlContent) {
    app.controller('siteshowController', ['$scope', 'Account','Message', function ($scope, Account, Message) {
        $scope.totalItems = 0;
        $scope.currentPage = 1;
        $scope.pageSize = 12;
        var siteshowParams = {siteshowType:'all'};

        function getSiteList() {
            var params = {pageSize:$scope.pageSize, page:$scope.currentPage,sortBy:'-favoriteCount'};
            var url = config.apiUrlPrefix + 'website/getSiteList';
            // 个人站点
            if (siteshowParams.siteshowType == 'personal') {
                params.categoryId = 0;
            } else if (siteshowParams.siteshowType == 'search') {
                params.websiteName = siteshowParams.websiteName;
            }

            util.http("POST", url, params, function (data) {
                $scope.siteObj = data;
                $scope.totalItems = data.total;
            });
        }

        function init() {
            console.log('init siteshow controller');
            siteshowParams = storage.sessionStorageGetItem('siteshowParams') || siteshowParams;
            getSiteList();
        }

        $scope.sitePageChanged = function () {
            getSiteList();
        }

        //打开用户页
        $scope.goUserSite = function (site) {
            util.goUserSite('/' + site.username + '/' + site.name + '/index');
        }

        $scope.goUserIndexPage=function(username){
            util.goUserSite('/'+username,true);
        }

        // 收藏作品
        $scope.worksFavorite=function (event, site) {
            //console.log(event, site);
            if (!Account.isAuthenticated()) {
                Message.info("登录后才能收藏!!!");
                return ;
            }

            if (site.userId == $scope.user._id) {
                Message.info("不能收藏自己作品!!!");
                return ;
            }

            var worksFavoriteRequest = function(isFavorite) {
                var params = {
                    userId: $scope.user._id,
                    favoriteUserId: site.userId,
                    favoriteWebsiteId: site._id,
                }

                var url = config.apiUrlPrefix + 'user_favorite/' + (isFavorite ? 'favoriteSite' : 'unfavoriteSite');
                util.post(url, params, function () {
                    Message.info(isFavorite ? '作品已收藏' : '作品已取消收藏');
                });
            };

            var obj=event.target;
            var loveIcon=$(obj);
            if (obj.outerHTML.indexOf('<span') > 0) {
                loveIcon=$(obj).find(".js-heart");
            }
            if (loveIcon.hasClass("glyphicon-star-empty")) {
                loveIcon.addClass("glyphicon-star");
                loveIcon.removeClass("glyphicon-star-empty");
                worksFavoriteRequest(true);
                site.favoriteCount++;
            }else{
                loveIcon.addClass("glyphicon-star-empty");
                loveIcon.removeClass("glyphicon-star");
                worksFavoriteRequest(false);
                site.favoriteCount--;
            }
        };

        $scope.$watch('$viewContentLoaded', init);
    }]);

    return htmlContent;
});