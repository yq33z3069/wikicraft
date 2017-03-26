/**
 * Created by wuxiangan on 2017/2/21.
 */

define(['app', 'helper/util'], function (app, util) {
    var innerServerDS = {
        writeFile: function (params, cb, errcb) {
            util.post(config.apiUrlPrefix + 'website_pages/upsert', params, cb, errcb);
        },
        getContent: function (params, cb, errcb) {
            util.post(config.apiUrlPrefix + 'website_pages/getWebsitePageById', params, function (data) {
                cb && cb(data.content);
            }, errcb);
        },
        deleteFile: function (params, cb, errcb) {
            util.post(config.apiUrlPrefix + 'website_pages/deleteByPageId', params, cb, errcb);
        },
        rollbackFile: function (params, cb, errcb) {
            //cb && cb();
        }
    };
    
    var dataSourceMap = {};

    function registerDataSource(name, ds, enable) {
        dataSourceMap[name] = {dataSource:ds, enable: (enable == undefined || enable) ? true : false};
    }

    function getDataSource(dsList) {
        var dataSource = {};

        if (!dsList) {
            dsList = [];
            for (var key in dataSourceMap) {
                dsList.push(key);
            }
        }
        for (var i = 0; i < dsList.length; i++) {
            dataSource[dsList[i]] = dataSourceMap[dsList[i]].dataSource;
        }

        function execFn(fnName, params, cb, errcb) {
            var isOK = {};
            var isError = false;

            function isAllOK(key, isErr) {
                return function () {
                    isOK[key] = true;

                    if (isErr)
                        isError = true;

                    for (var i = 0; i < dsList.length; i++) {
                        if (!isOK[dsList[i]])
                            break;
                    }

                    if (i == dsList.length) {
                        if (isError)
                            errcb && errcb();
                        else
                            cb && cb();
                    }
                }
            }

            for (var key in dataSource) {
                if (dataSourceMap[key].enable) {
                    dataSource[key] && dataSource[key][fnName] && dataSource[key][fnName](params, isAllOK(key, false), isAllOK(key, true));
                }
            }
        }

        return {
            isDataSourceExist: function (dsName) {
                return dataSource[dsName] ? true : false;
            },
            getSingleDataSource: function (dsName) {
                return dataSource[dsName];
            },
            /*
                param:{path,content,message,branch}
             */
            writeFile: function (params, cb, errcb) {
                execFn("writeFile", params, cb, errcb);
            },
            /*
             param:{path,ref}
             */
            getContent: function (params, cb, errcb) {
                execFn("getContent", params, cb, errcb);
            },
            /*
             param:{path,message,sha,branch}
             */
            deleteFile: function (params, cb, errcb) {
                execFn("deleteFile", params, cb, errcb);
            },
            /*
             param:{path,content,message,branch}
             */
            uploadImage: function (params, cb, errcb) {
                execFn("uploadImage", params, cb, errcb);
            },

            rollbackFile: function (params, cb, errcb) {
                execFn("rollbackFile", params, cb, errcb);
            },
        };
    }

    // 注册内容server
    registerDataSource('innerServer', innerServerDS);
    
    // 提供全局注册数据源函数
    app.registerDataSource = registerDataSource;

    // 提供获取数据源函数
    app.getDataSource = getDataSource;

    return {
        registerDataSource:registerDataSource,
        getDataSource:getDataSource,
        getRawDataSource: function (dsName) {
            return dataSourceMap[dsName] && dataSourceMap[dsName].dataSource
        },
        getDataSourceEnable: function (dsName) {
            return dataSourceMap[dsName] && dataSourceMap[dsName].enable;
        },
        setDataSourceEnable: function (dsName, enable) {
            if (dataSourceMap[dsName])
                dataSourceMap[dsName].enable = enable;
        }
    };
});