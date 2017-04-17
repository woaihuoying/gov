/**
 * Created by lenovo on 2017/2/20.
 */
(function (){

    var appServices = angular.module('myAppServices',[]);

    /**
     * @ 用户的唯一id --> 使用本地存储的方式
     * @ 服务名      --> Base
     * */
    appServices.factory('Base',['$rootScope',function($rootScope){
        return{
            set: function(key, data) {
                return window.localStorage.setItem(key,data);
            },
            get: function(key) {
                return window.localStorage.getItem(key);
            },
            remove: function(key) {
                return window.localStorage.removeItem(key);
            }
        }
    }]);


    /**
     * @ 服务器url --> 测试： http://192.168.1.209:8080
                      阿里云：http://139.129.235.171:8088
     * @ 服务名    --> serverUrl
     * */
    appServices.service('serverUrl',function (){
        this.serverUrlFun = function (){
            return 'http://139.129.235.171:8088';
        };
    });


    /**
     * @ 上传头像服务 --> 创建服务注入到控制器里面
     * @ 服务名      --> fileReader
     * */
    appServices.factory('fileReader', ["$q", "$log", function($q, $log){
        var onLoad = function(reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.resolve(reader.result);
                });
            };
        };

        var onError = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result);
                });
            };
        };

        var getReader = function(deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            return reader;
        };

        var readAsDataURL = function (file, scope) {
            var deferred = $q.defer();
            var reader = getReader(deferred, scope);
            reader.readAsDataURL(file);
            return deferred.promise;
        };

        return {
            readAsDataUrl: readAsDataURL
        };
    }])



})();