/**
 * Created by lenovo on 2017/2/21.
 */
/**
 * Created by lenovo on 2017/2/20.
 */
(function (){

    var appConfig = angular.module('myAppConfig',['ngRoute','myAppController']);

    /*
     * 编辑个人信息页 --> 路由切换
     * config
     * */
    appConfig.config(['$routeProvider',function ($routeProvider){
        $routeProvider
            .when('/editInfo',{
                templateUrl:'config-html/editInfo.html',
                controller:'DemoeditInfo'
            }).when('/lookInfo',{
                templateUrl:'config-html/lookInfo.html',
                controller:'DemolookInfo'
            }).when('/myThings',{
                templateUrl:'config-html/myThings.html',
                controller:'DemoThings'
            }).when('/myConsult',{
                templateUrl:'config-html/myConsult.html',
                controller:'DemomyConsult'
            }).when('/myComplain',{
                templateUrl:'config-html/myComplain.html',
                controller:'DemomyComplain'
            }).when('/myError',{
                templateUrl:'config-html/myError.html',
                controller:'DemomyError'
            }).when('/myFootprint',{
                templateUrl:'config-html/myFootprint.html',
                controller:'DemomyFootprint'
            }).when('/myCollect',{
                templateUrl:'config-html/myCollect.html',
                controller:'DemoCollect'
            }).otherwise({
                redirectTo:'/'
            })
    }]);





})();