/**
 * Created by lenovo on 2017/2/20.
 */
(function (){

    var appDirective = angular.module('myAppDirective',['myAppController']);


    /**
     * @ top --> 顶部
     * @ 指令 --> appTop
     **/
    //appDirective.directive('appTop',[function (){
    //    return {
    //        restrict:'AEMC',
    //        templateUrl:'templates/top.html',
    //        replace:true,
    //        transclude:true
    //    }
    //}]);
    /**
     * @ nav --> 导航栏
     * @ 指令 --> appTop
     **/
    //appDirective.directive('appNav',[function (){
    //    return {
    //        restrict:'AEMC',
    //        templateUrl:'templates/nav.html',
    //        replace:true
    //    }
    //}]);
    /**
     * @ footer --> 底部
     * @ 指令 --> appFooter
     **/
    //appDirective.directive('appFooter',[function (){
    //    return {
    //        restrict:'AEMC',
    //        templateUrl:'templates/footer.html',
    //        replace:true
    //    }
    //}]);


    /**
     * @ 首页 --> 右侧悬浮框 移动端二维码下载
     * @ 指令 --> appPhone
     **/
    appDirective.directive('appPhone',[function (){
        return {
            restrict:'AEMC',
            templateUrl:"config-html/appPhone.html",
            replace:true,
            link:function (scope,ele,attr){
                // 采用定时器的方式来控制
                var timerDelayed;
                ele.bind('mousemove',function (){
                    ele.find('div').css('display','block');
                });
                ele.bind('mouseout',function (){
                    timerDelayed = setTimeout(function (){
                        ele.find('div').css('display','none');
                    },800);
                });

                ele.find('div').bind('mousemove',function (){
                    clearTimeout(timerDelayed);
                    ele.find('div').css('display','block');
                });

                ele.find('div').bind('mouseout',function (){
                    ele.find('div').css('display','none');
                });
            }
        }
    }]);
    /**
     * @ 首页 --> 右侧悬浮框 操作手册二维码下载
     * @ 指令 --> webApp
     **/
    appDirective.directive('webApp',[function (){
        return {
            restrict:'AEMC',
            templateUrl:"config-html/webApp.html",
            replace:true,
            link:function (scope,ele,attr){
                var timerDelayed;
                ele.bind('mousemove',function (){
                    ele.find('div').css('display','block');
                });

                ele.bind('mouseout',function (){
                    timerDelayed = setTimeout(function (){
                        ele.find('div').css('display','none');
                    },800);
                });

                ele.find('div').bind('mousemove',function (){
                    clearTimeout(timerDelayed);
                    ele.find('div').css('display','block');
                });

                ele.find('div').bind('mouseout',function (){
                    ele.find('div').css('display','none');
                });
            }
        }
    }]);


    /**
     * @ 用户中心页 --> 上传头像指令
     * @ 指令      --> fileModel
     **/
    appDirective.directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs, ngModel) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;
                element.bind('change', function(event){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                    });
                    //附件预览
                    scope.file = (event.srcElement || event.target).files[0];
                    scope.getFile();
                });
            }
        };
    }]);



})();