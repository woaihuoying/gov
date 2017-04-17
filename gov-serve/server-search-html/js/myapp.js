/**
 * Created by lenovo on 2017/3/15.
 */
var app = angular.module('App',[]);


//------------------------ 控制器 controller start ----------------------
/**
 * @ 便民服务项 --> 点击查询按钮查看公交站
 * @ 控制器    --> DemoBusSearch
 * */
app.controller('DemoBusSearch',['$scope','$http','urlService',function ($scope,$http,urlService){
    // 获取测试服或者阿里云的地址
    $scope.url = urlService.urlServiceFun();
    //console.log($scope.url);
    $scope.busSearch = function (){
        $http({
            method:'post',
            url:$scope.url + '/ConvenienceController/getBusInfo',
            data:JSON.stringify({
                'city':$scope.cityName
            })
        }).then(function successCallback(response){
            $scope.cityArr = response.data.result.list;
        },function errorCallback(){
            console.log('错误');
        });
    };
}]);

/**
 * @ 便民服务项 --> 点击查询按钮查看历史上的今天
 * @ 控制器    --> DemoHistorySearch
 * */
app.controller('DemoHistorySearch',['$scope','$http','urlService',function ($scope,$http,urlService){
    $scope.url = urlService.urlServiceFun();
    $scope.historyFun = function (){
        $http({
            method:'post',
            url:$scope.url + '/ConvenienceController/getTodayInfo',
            data:JSON.stringify({
                "month": $scope.monthText,
                "day": $scope.dateText
            })
        }).then(function successCallback(response){
            $scope.thingsArr = response.data.result;
        },function errorCallBack(response){
            console.log('错误');
        });
    };
}]);

/**
 * @ 便民服务项 --> 点击查询按钮查看历史上的今天
 * @ 控制器    --> DemoIdCardSearch
 * */
app.controller('DemoIdCardSearch',['$scope','$http','urlService',function ($scope,$http,urlService){
    $scope.url = urlService.urlServiceFun();
    $scope.idCardFun = function (){
        $http({
            method:'post',
            url:$scope.url + '/ConvenienceController/getIdentityCardInfo',
            data:JSON.stringify({
                "idNo": $scope.idCardValue
            })
        }).then(function successCallback(response){
            $scope.idValue = response.data.result;
        },function errorCallBack(response){
            console.log('错误');
        });
    };
}]);

/**
 * @ 便民服务项 --> 点击查询按钮查看ip
 * @ 控制器    --> DemoIpSearch
 * */
app.controller('DemoIpSearch',['$scope','$http','urlService',function ($scope,$http,urlService){
    $scope.url = urlService.urlServiceFun();
    $scope.ipFun = function (){
        $http({
            method:'post',
            url:$scope.url + '/ConvenienceController/getIpInfo',
            data:JSON.stringify({
                "ipNo":$scope.ipText
            })
        }).then(function successCallback(response){
            $scope.ipValue = response.data.result;
        },function errorCallBack(response){
            console.log('错误');
        });
    };
}]);

/**
 * @ 便民服务项 --> 点击查询按钮查看手机号码归属地
 * @ 控制器    --> DemoPhoneSearch
 * */
app.controller('DemoPhoneSearch',['$scope','$http','urlService',function ($scope,$http,urlService){
    $scope.url = urlService.urlServiceFun();
    $scope.phoneFun = function (){
        $http({
            method:'post',
            url:$scope.url + '/ConvenienceController/getMobilePossessionInfo',
            data:JSON.stringify({
                "phoneNumber": $scope.phoneText
            })
        }).then(function successCallback(response){
            $scope.phoneValue = response.data;
        },function errorCallBack(response){
            console.log('错误');
        });
    };
}]);
//------------------------ 控制器 controller end ------------------------


//------------------------ 服务 service start ---------------------------
/**
 * @ 服务器url --> 测试： http://192.168.1.209:8080
                  阿里云：http://139.129.235.171:8088
 * @ 服务名    --> urlService
 * */
app.service('urlService',function (){
    this.urlServiceFun = function (){
        return 'http://139.129.235.171:8088';
    };
})
//------------------------ 服务 service end -----------------------------




