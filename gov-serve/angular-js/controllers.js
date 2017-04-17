/**
 * Created by lenovo on 2017/2/20.
 */
(function (){

    var appController = angular.module('myAppController',['myAppServices','myAppDirective','ngSanitize']);

    //------------------------- 共用项 start -------------------------------
    /**
     * @ 共用   --> 顶部登陆的盒子 控制盒子的显示与隐藏
     * @ 控制器 --> DemoRegisterBox
     **/
    appController.controller('DemoRegisterBox',['$scope','Base',function ($scope,Base){
        $scope.ifValueFun = (function (){
            if(Base.get('userOnlyIdValue')){
                $scope.ifValue = true;
            }else{
                $scope.ifValue = false;
            }
        })();
        $scope.username = Base.get('userOnlyNameValue');
        $scope.exitFun = function (){
            Base.remove('userOnlyIdValue');
            $scope.ifValue = false;
            window.location.href = 'personal-register.html';
        };
    }]);
    //------------------------- 共用项 end ---------------------------------

    //------------------------- 注册页 start -------------------------------
    /**
     * @ 注册页 --> 用户注册
     * @ 控制器 --> DemoLogin
     **/
    appController.controller('DemoLogin',['$scope','$http','serverUrl',function ($scope,$http,serverUrl){
        // 获取测试209  与  阿里云的地址
        $scope.urlValue = serverUrl.serverUrlFun();
        $scope.funLogin = function (){
            $http({
                method: 'POST',
                url: $scope.urlValue + '/hui/proxyMethod',
                data:JSON.stringify({
                    "serviceName":"UserController",
                    "methodName":"registerUser",
                    "userName":$scope.username,
                    "passWord":$scope.password,
                    "nickName":$scope.nickname
                })
            }).then(function successCallback(response) {
                if( $scope.password != $scope.copyPassword){
                    alert('两次输入密码不一致，请重新输入');
                    window.location.href = 'personal-login.html';
                }else if(response.data.result == 0){
                    alert('注册成功');
                    window.location.href = 'personal-register.html';
                }else if(response.data.result == 1){
                    alert('注册失败');
                }else if(response.data.result == 3){
                    alert('该用户已存在！，请换个用户名。');
                }
            }, function errorCallback(response) {
                console.log('错误');
            });
        };
    }]);
    //------------------------- 注册页 end ---------------------------------


    //------------------------- 登录页 start -------------------------------
    /**
     * @ 登录页 --> 用户登录
     * @ 控制器 --> DemoRegister
     **/
    appController.controller('DemoRegister',['$scope','$http','Base','serverUrl',function ($scope,$http,Base,serverUrl){
        $scope.urlValue = serverUrl.serverUrlFun();
        $scope.funRegister = function (){
            $http({
                method: 'POST',
                url: $scope.urlValue + '/hui/proxyMethod',
                data:JSON.stringify({
                    "serviceName":"UamController",
                    "methodName":"login",
                    "userName":$scope.username,
                    "passWord":$scope.password
                })
            }).then(function successCallback(response) {
                if(response.data.result == 1){
                    Base.set('userOnlyNameValue',response.data.username);
                    Base.set('userOnlyIdValue',response.data.id);
                    alert('登录成功');
                    window.location.href = 'user-center.html';
                }else if(response.data.result == 2){
                    alert('密码错误，请重新输入');
                }else if(response.data.result == 3){
                    alert('用户登录失败，用户不存在！');
                }
            }, function errorCallback(response) {
                console.log('错误');
            });
        };
    }]);
    //------------------------- 登录页 end ---------------------------------


    //------------------------- 官网首页 start -----------------------------
    /**
     * @ 首页 --> 新闻咨询列表
     * @ 控制器 --> DemoNews
     **/
    appController.controller('DemoNews',['$scope','$http','Base','serverUrl',function ($scope,$http,Base,serverUrl){
        $scope.urlValue = serverUrl.serverUrlFun();
        $http({
            method: 'POST',
            url: $scope.urlValue + '/hui/proxyMethod',
            data:JSON.stringify({
                "serviceName":"InformationController",
                "methodName":"getInformationBySourceByPageForUser",
                "userId":Base.get('userOnlyIdValue'),
                "source":"综合",
                "indexPage":"1",
                "displayRecordCount":"8"
            })
        }).then(function successCallback(response) {
            $scope.newsArr = response.data.InformationUrlGrid.rows;
        }, function errorCallback(response) {
            console.log('错误');
        });
    }]);
    //------------------------- 官网首页 end -------------------------------


    //------------------------- 用户中心页面 start -------------------------
    /**
     * @ 用户中心页 --> 左侧个人信息状态
     * @ 控制器    --> DemoInformation
     **/
    appController.controller('DemoInformation',['$scope','$http','Base','serverUrl','fileReader',function ($scope,$http,Base,serverUrl,fileReader){
        $scope.urlValue = serverUrl.serverUrlFun();
        $http({
            method: 'POST',
            url: $scope.urlValue + '/hui/proxyMethod',
            data:JSON.stringify({
                "serviceName":"UserController",
                "methodName":"getGeneralUserById",
                "userId":Base.get('userOnlyIdValue')
            })
        }).then(function successCallback(response) {
            $scope.username = Base.get('userOnlyNameValue');
            $scope.phone = response.data.userInfo.phone;
            $scope.usernick = response.data.userInfo.name;
            $scope.email = response.data.userInfo.email;
        }, function errorCallback(response) {
            console.log('错误');
        });

        // 用户上传头像
        $scope.getFile = function () {

            fileReader.readAsDataUrl($scope.file, $scope).then(function(result) {

                $scope.imageSrc = result;

                function dataURItoBlob(dataURI) {
                    var byteString = atob(dataURI.split(',')[1]);
                    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
                    var ab = new ArrayBuffer(byteString.length);
                    var ia = new Uint8Array(ab);
                    for (var i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }
                    return new Blob([ab], {type: mimeString});
                }

                var blob = dataURItoBlob(result);
                var fd = new FormData();
                fd.append('file', blob);
                fd.append('userid', Base.get('userOnlyIdValue'));

                $http({
                    method: 'POST',
                    url: $scope.urlValue + "/user/updateUserPhoto",
                    data:fd,
                    transformRequest:angular.identity,
                    headers:{'Content-Type':undefined}
                }).then(function successCallback(response) {
                    alert('上传成功');
                    //console.log(response);
                }, function errorCallback(response) {
                    console.log('错误');
                });
            })
        };

        // 获取用户头像的链接
        $scope.headImageUrl = $scope.urlValue + '/user/getUserPhoto/' + Base.get('userOnlyIdValue');

    }]);

    /**
     * @ 用户中心页 --> 点击我的办件 查看办件：代办理，办理中，已办结
     * @ 控制器    --> DemoThings
     **/
    appController.controller('DemoThings',['$scope','$http','Base','serverUrl',function ($scope,$http,Base,serverUrl){
        $scope.urlValue = serverUrl.serverUrlFun();
        /* 代办理 */
        $scope.waitTransact = function () {
            $scope.stateList1 = {"background-color":"white"};
            $scope.stateList2 = {"background-color":"#e8f4ff"};
            $scope.stateList3 = {"background-color":"#e8f4ff"};
            $http({
                method: 'POST',
                url: $scope.urlValue + '/activiti/list/alltask',
                data:JSON.stringify({
                    "type":"0",
                    "userId":Base.get('userOnlyIdValue')
                })
            }).then(function successCallback(response) {
                $scope.things = response.data.message;
            }, function errorCallback(response) {
                console.log('错误');
            });
        };
        /* 办理中 */
        $scope.transacting = function () {
            $scope.stateList1 = {"background-color":"#e8f4ff"};
            $scope.stateList2 = {"background-color":"white"};
            $scope.stateList3 = {"background-color":"#e8f4ff"};
            $http({
                method: 'POST',
                url: $scope.urlValue + '/activiti/list/alltask',
                data:JSON.stringify({
                    "type":"1",
                    "userId":Base.get('userOnlyIdValue')
                })
            }).then(function successCallback(response) {
                $scope.things = response.data.message;
            }, function errorCallback(response) {
                console.log('错误');
            });
        };
        /* 已办结 */
        $scope.completeTransact = function () {
            $scope.stateList1 = {"background-color":"#e8f4ff"};
            $scope.stateList2 = {"background-color":"#e8f4ff"};
            $scope.stateList3 = {"background-color":"white"};
            $http({
                method: 'POST',
                url: $scope.urlValue + '/activiti/list/alltask',
                data:JSON.stringify({
                    "type":"2",
                    "userId":Base.get('userOnlyIdValue')
                })
            }).then(function successCallback(response) {
                $scope.things = response.data.message;
            }, function errorCallback(response) {
                console.log('错误');
            });
        };
    }]);

    /**
     * @ 用户中心页 --> 我的收藏
     * @ 控制器    --> DemoCollect
     **/
    appController.controller('DemoCollect',['$scope','$http','$location','Base','serverUrl',function ($scope,$http,$location,Base,serverUrl){
        $scope.urlValue = serverUrl.serverUrlFun();
        /* 展示收藏 */
        $http({
            method: 'POST',
            url: $scope.urlValue + '/businessInfo/selCollectionInfo',
            data:JSON.stringify({
                "userId":Base.get('userOnlyIdValue')
            })
        }).then(function successCallback(response) {
            $scope.collectArr= response.data.collectionList;

            /* 取消收藏 */
            $scope.cancelCollect = function (x){
                // 根据ng-repeat = '(x,collect) in collectArr'里面的x取到办事项的id值
                //console.log($scope.collectArr[x].businessId);
                $http({
                    method: 'POST',
                    url: $scope.urlValue + '/businessInfo/cancellCollectionInfo',
                    data:JSON.stringify({
                        "businessId":$scope.collectArr[x].businessId,
                        "userId":Base.get('userOnlyIdValue')
                    })
                }).then(function successCallback(response) {
                    alert('取消收藏成功');
                    $scope.userCenter = 'user-center.html';
                    $scope.userInfoCheck = 'userInfo-check.html#/myCollect';
                    //console.log($location.absUrl().substring($location.absUrl().lastIndexOf('user')));
                    // 根据url判断在哪个页面取消的收藏  在选择刷新哪个页面
                    if($location.absUrl().substring($location.absUrl().lastIndexOf('user')) == $scope.userCenter){
                        window.location.href = 'user-center.html';
                    }else if($location.absUrl().substring($location.absUrl().lastIndexOf('user')) == $scope.userInfoCheck){
                        window.location.href = 'userInfo-check.html#/myCollect';
                    }
                }, function errorCallback(response) {
                    console.log('错误');
                });
            };
        }, function errorCallback(response) {
            console.log('错误');
        });
    }]);
    //------------------------- 用户中心页面 end ---------------------------


    //------------------------- 修改信息页面 start -------------------------
    /**
     * @ 编辑个人信息页 --> 编辑信息、查看信息、我的办件、我的咨询、我的投诉、我的纠错、我的足迹、我的收藏
     **/

    /**
     * @ 编辑信息
     * @ 控制器 --> DemoeditInfo
     * */
    appController.controller('DemoeditInfo',['$scope','$http','Base','serverUrl',function ($scope,$http,Base,serverUrl){
        $scope.urlValue = serverUrl.serverUrlFun();
        $scope.editInfofun = function (){
            $http({
                method: 'POST',
                url: $scope.urlValue + '/hui/proxyMethod',
                data:JSON.stringify({
                    "serviceName":"UserController",
                    "methodName":"updateGeneralUserInfo",
                    "userId":Base.get('userOnlyIdValue'),
                    "name":$scope.usernick,
                    "email":$scope.email,
                    "phone":$scope.phone,
                    "mobile":$scope.tel,
                    "idCard":$scope.idcard,
                    "userSex":$scope.sexState,
                    "signature":$scope.signature
                })
            }).then(function successCallback(response) {
                alert('编辑成功')
                window.location.href = 'userInfo-check.html#/lookInfo';
            }, function errorCallback(response) {
                console.log('错误');
            });
        };
    }]);

    /**
     * @ 查看信息
     * @ 控制器 --> DemolookInfo
     * */
    appController.controller('DemolookInfo',['$scope','$http','Base','serverUrl',function ($scope,$http,Base,serverUrl){
        $scope.urlValue = serverUrl.serverUrlFun();
        $http({
            method: 'POST',
            url: $scope.urlValue + '/hui/proxyMethod',
            data:JSON.stringify({
                "serviceName":"UserController",
                "methodName":"getGeneralUserById",
                "userId":Base.get('userOnlyIdValue')
            })
        }).then(function successCallback(response) {
            $scope.lookUserInfo = response.data.userInfo;
        }, function errorCallback(response) {
            console.log('错误');
        });
    }]);

    /**
     * 我的咨询
     * 控制器 --> DemomyConsult
     * */
    appController.controller('DemomyConsult',['$scope','$http',function ($scope,$http){

    }]);

    /**
     * 我的投诉
     * 控制器 --> DemomyComplain
     * */
    appController.controller('DemomyComplain',['$scope','$http',function ($scope,$http){

    }]);

    /**
     * 我的纠错
     * 控制器 --> DemomyError
     * */
    appController.controller('DemomyError',['$scope','$http',function ($scope,$http){

    }]);

    /**
     * 我的足迹
     * 控制器 --> DemomyFootprint
     * */
    appController.controller('DemomyFootprint',['$scope','$http',function ($scope,$http){

    }]);
    //------------------------- 修改信息页面 end ---------------------------


    //------------------------- 个人办事页面 start -------------------------
    /**
     * @ 个人办事页 --> 点击列表改变办事项
     * @ 控制器    --> DemoThings
     * */
    appController.controller('DemoGrThings',['$scope','$http','Base','serverUrl',function ($scope,$http,Base,serverUrl){
        $scope.urlValue = serverUrl.serverUrlFun();
        // 页面已进入就出现个人热门办事项
        $http({
            method: 'POST',
            url: $scope.urlValue + '/businessInfo/selBusinessInfoByDeptId',
            data:JSON.stringify({
                "deptId":"教育局",
                "indexPage":"1",
                "displayRecordCount":"5"
            })
        }).then(function successCallback(response) {
            $scope.rowsArr = response.data.InformationUrlGrid.rows;
        }, function errorCallback(response) {
            console.log('错误');
        });

        // 点击切换主题与部门
        $scope.themeShow = true;
        $scope.branchShow = false;
        $scope.themeFun = function (){
            $scope.themeShow = true;
            $scope.branchShow = false;
            $scope.themeColor = {'background-color':'#1492ff'};
            $scope.branchColor = {'background-color':'#e7e7e7'};
        };
        $scope.branchFun = function (){
            $scope.themeShow = false;
            $scope.branchShow = true;
            $scope.themeColor = {'background-color':'#e7e7e7'};
            $scope.branchColor = {'background-color':'#1492ff'};
        };

        // 点击按照主题划分的办事项
        $scope.themeArr = ['教育','纳税','法律援助','交通','生育','社保','婚姻','就业','旅游','民族宗教','出入境','其它'];
        $scope.getThemeList = function(item){
            $http({
                method: 'POST',
                url: $scope.urlValue + '/businessInfo/selBusinessInfoByServiceObject',
                data:JSON.stringify({
                    "scene":item,
                    "serviceObject":"个人",
                    "indexPage":"1",
                    "displayRecordCount":"5"
                })
            }).then(function successCallback(response) {
                $scope.rowsArr = response.data.InformationUrlGrid.rows;
                if(Base.get('userOnlyIdValue') == null){
                    $scope.aHref = '#';
                }else{
                    $scope.aHref = 'online-declare.html?businessid=';
                }
            }, function errorCallback(response) {
                console.log('错误');
            });
        };

        // 点击按照部门划分的办事项
        $scope.branchArr = ['教育局','农业局','公安局','民政局','司法局','环保局','社会保障局','食药监局','水利局','商务局','文化局','计生委'];
        $scope.getBranchList = function(branch){
            $http({
                method: 'POST',
                url: $scope.urlValue + '/businessInfo/selBusinessInfoByDeptId',
                data:JSON.stringify({
                    "deptId":branch,
                    "indexPage":"1",
                    "displayRecordCount":"5"
                })
            }).then(function successCallback(response) {
                $scope.rowsArr = response.data.InformationUrlGrid.rows;
                if(Base.get('userOnlyIdValue') == null){
                    $scope.aHref = '#';
                }else{
                    $scope.aHref = 'online-declare.html?businessid=';
                }
            }, function errorCallback(response) {
                console.log('错误');
            });
        };

        // 提示用户登录才可以继续进行操作的盒子
        if(Base.get('userOnlyIdValue') == null){
            $scope.aHref = '#';
            $scope.hintLoginFun = function (){
                $scope.bgLogin = {'display':'block',
                    'height':document.documentElement.scrollHeight+'px'
                };
                $scope.showLogin = {'display':'block'};
            }
        }else{
            $scope.aHref = 'online-declare.html?businessid=';
        }

        // 关闭提示登录的盒子
        $scope.closeLoginFun = function (){
            $scope.bgLogin = {'display':'none'};
            $scope.showLogin = {'display':'none'};
        };
        $scope.mouseoverFun = function (){
            $scope.bigImg = {'transform':'scale(1.4)'};
        };
        $scope.mouseoutFun = function (){
            $scope.bigImg = {'transform':'scale(1.0)'};
        };

    }]);
    //------------------------- 个人办事页面 end ---------------------------


    //------------------------- 法人办事页面 start -------------------------
    /**
     * @ 个人办事页 --> 点击列表改变办事项
     * @ 控制器    --> DemoThings
     * */
    appController.controller('DemoFrThings',['$scope','$http','Base','serverUrl',function ($scope,$http,Base,serverUrl){
        $scope.urlValue = serverUrl.serverUrlFun();
        // 页面已进入就出现热门法人办事项
        $http({
            method: 'POST',
            url: $scope.urlValue + '/businessInfo/selBusinessInfoByServiceObject',
            data:JSON.stringify({
                "scene":"开办设立",
                "serviceObject":"法人",
                "indexPage":"1",
                "displayRecordCount":"5"
            })
        }).then(function successCallback(response) {
            $scope.rowsArr = response.data.InformationUrlGrid.rows;
        }, function errorCallback(response) {
            console.log('错误');
        });

        // 点击切换主题与部门
        $scope.themeShow = true;
        $scope.branchShow = false;
        $scope.themeFun = function (){
            $scope.themeShow = true;
            $scope.branchShow = false;
            $scope.themeColor = {'background-color':'#1492ff'};
            $scope.branchColor = {'background-color':'#e7e7e7'};
        };
        $scope.branchFun = function (){
            $scope.themeShow = false;
            $scope.branchShow = true;
            $scope.themeColor = {'background-color':'#e7e7e7'};
            $scope.branchColor = {'background-color':'#1492ff'};
            console.log(2)
        };

        // 点击按照主题划分的办事项
        $scope.themeArr = ['开办设立','质量检查','工商管理','环境保护','职业资格','劳动保障','建筑管理','外贸交流','企业纳税','安全防护','破产注销','其它'];
        $scope.getThemeList = function(item){
            $http({
                method: 'POST',
                url: $scope.urlValue + '/businessInfo/selBusinessInfoByServiceObject',
                data:JSON.stringify({
                    "scene":item,
                    "serviceObject":"法人",
                    "indexPage":"1",
                    "displayRecordCount":"5"
                })
            }).then(function successCallback(response) {
                $scope.rowsArr = response.data.InformationUrlGrid.rows;
            }, function errorCallback(response) {
                console.log('错误');
            });
        };

        // 点击按照部门划分的办事项
        $scope.branchArr = ['教育局','农业局','公安局','民政局','司法局','环保局','社会保障局','环境保护局','住房城乡建设局','交通运输局','水利局','市侨办','商务局','文化局','计生委','其它'];
        $scope.getBranchList = function(branch){
            $http({
                method: 'POST',
                url: $scope.urlValue + '/businessInfo/selBusinessInfoByDeptId',
                data:JSON.stringify({
                    "deptId":branch,
                    "indexPage":"1",
                    "displayRecordCount":"5"
                })
            }).then(function successCallback(response) {
                $scope.rowsArr = response.data.InformationUrlGrid.rows;
            }, function errorCallback(response) {
                console.log('错误');
            });
        };

        // 提示用户登录才可以继续进行操作的盒子
        if(Base.get('userOnlyIdValue') == null){
            $scope.aHref = '#';
            $scope.hintLoginFun = function (){
                $scope.bgLogin = {
                    'display':'block',
                    'height':document.documentElement.scrollHeight+'px'
                };
                $scope.showLogin = {'display':'block'};
            }
        }else{
            $scope.aHref = 'online-declare.html?businessid=';
        }

        // 关闭提示登录的盒子
        $scope.closeLoginFun = function (){
            $scope.bgLogin = {'display':'none'};
            $scope.showLogin = {'display':'none'};
        };
        $scope.mouseoverFun = function (){
            $scope.bigImg = {'transform':'scale(1.4)'};
        };
        $scope.mouseoutFun = function (){
            $scope.bigImg = {'transform':'scale(1.0)'};
        };
    }]);
    //------------------------- 法人办事页面 end ---------------------------


    //------------------------- 办事指南详情页面 start ----------------------
    /**
     * @ 办事详情页 --> 查看办事详情
     * @ 控制器    --> DemoGuide
     * */
    appController.controller('DemoGuide',['$scope','$http','$location','Base','serverUrl',function ($scope,$http,$location,Base,serverUrl){
        $scope.urlValue = serverUrl.serverUrlFun();
        // 根据id查看办事详情
        $scope.myUrl = $location.absUrl().split('=')[1];
        $http({
            method: 'POST',
            url: $scope.urlValue + '/businessInfo/selBusinessInfoById',
            data:JSON.stringify({
                "businessId":$scope.myUrl
            })
        }).then(function successCallback(response) {
            $scope.businessInfo = response.data.businessInfo;

        }, function errorCallback(response) {
            console.log('错误');
        });

        // 提示用户登录才可以继续进行操作的盒子
        if(Base.get('userOnlyIdValue') == null){
            $scope.aHref1 = '#';
            // --> 在线办理
            $scope.onlineFun = function (){
                $scope.bgLogin = {
                    'display':'block',
                    'height':document.documentElement.scrollHeight+'px'
                };
                $scope.showLogin = {'display':'block'};
            }
        }else{
            $scope.aHref1 = 'online-declare.html?businessid=';
        }

        if(Base.get('userOnlyIdValue') == null){
            $scope.aHref2 = '#';
            // --> 在线咨询
            $scope.collectLoginFun = function (){
                $scope.bgLogin = {
                    'display':'block',
                    'height':document.documentElement.scrollHeight+'px'
                };
                $scope.showLogin = {'display':'block'};
            }
        }else{
            $scope.aHref2 = 'user-advisory.html?business=';
        }

        // 点击收藏
        if(Base.get('userOnlyIdValue') == null){
            // --> 点击收藏
            $scope.userCollect = function (){
                $scope.bgLogin = {
                    'display':'block',
                    'height':document.documentElement.scrollHeight+'px'
                };
                $scope.showLogin = {'display':'block'};
            }
        }else{
            // --> 点击收藏
            $scope.userCollect = function (){
                $http({
                    method: 'POST',
                    url: $scope.urlValue + '/businessInfo/collectBusinessInfo',
                    data:JSON.stringify({
                        "businessId":$scope.myUrl,
                        "userId":Base.get('userOnlyIdValue'),
                        "businessName":$scope.businessInfo.businessName,
                        "deptId":$scope.businessInfo.deptId
                    })
                }).then(function successCallback(response) {
                    alert('收藏成功');
                }, function errorCallback(response) {
                    console.log('错误');
                });
            };
        }

        // 关闭提示登录的盒子
        $scope.closeLoginFun = function (){
            $scope.bgLogin = {'display':'none'};
            $scope.showLogin = {'display':'none'};
        };
        $scope.mouseoverFun = function (){
            $scope.bigImg = {'transform':'scale(1.4)'};
        };
        $scope.mouseoutFun = function (){
            $scope.bigImg = {'transform':'scale(1.0)'};
        };

        // 鼠标移动到查看条件上  查看办件的条件
        $scope.acceptCondition = function (){
            $scope.conditionBgColor = {'background-color':'white'};
            $http({
                method: 'POST',
                url: $scope.urlValue + '/businessInfo/selBusinessConditionById',
                data:JSON.stringify({
                    "businessId":$scope.myUrl
                })
            }).then(function successCallback(response) {
                $scope.conditionText = response.data.businessCondition;
            }, function errorCallback(response) {
                console.log('错误');
            });
            $scope.conditionTrue = true;
        };
        // 鼠标移开
        $scope.conditionMouseleave = function (){
            $scope.conditionBgColor = {'background-color':'#e9f0f6'};
            $scope.conditionTrue = false;
        };
    }]);
    //------------------------- 办事指南详情页面 end ------------------------


    //------------------------- 网上办理页面 start -------------------------
    /**
     * @ 网上办理页 --> 把申报人填写的数据传给后台处理
     * @ 控制器    --> DemoOnlineTransaction
     * */
    appController.controller('DemoOnlineTransaction',['$scope','$http','$location','Base','serverUrl',function ($scope,$http,$location,Base,serverUrl){
        $scope.urlValue = serverUrl.serverUrlFun();
        // 根据id查看办事详情
        $scope.myUrl = $location.absUrl().split('=')[1];
        $http({
            method: 'POST',
            url: $scope.urlValue + '/businessInfo/selBusinessInfoById',
            data:JSON.stringify({
                "businessId":$scope.myUrl
            })
        }).then(function successCallback(response) {
            $scope.businessName = response.data.businessInfo.businessName;

            $scope.declarantInfo = function (){
                $http({
                    method: 'POST',
                    url: $scope.urlValue + '/activiti/start',
                    data:JSON.stringify({
                        "matterId":$scope.myUrl,
                        "processInstanceByKey":$scope.businessName,
                        "userId":Base.get('userOnlyIdValue'),
                        "declarationPeople":$scope.declarantName,
                        "idCard":$scope.declarantIdCard,
                        "contactPhone":$scope.declarantPhone,
                        "contactName":$scope.contactsName,
                        "contactIdcard":$scope.contactsIdCard,
                        "contactTelephone":$scope.contactsTel,
                        "contactAddress":$scope.contactAddress,
                        "note":"我就是备注"
                    })
                }).then(function successCallback(response) {
                    alert('申报成功');
                    window.location.href = 'business-guide.html?businessid='+$scope.myUrl;
                }, function errorCallback(response) {
                    console.log('错误');
                });
            };
        }, function errorCallback(response) {
            console.log('错误');
        });
    }]);
    //------------------------- 网上办理页面 end ---------------------------


    //------------------------- 我要咨询页面 start -------------------------
    /**
     * @ 我要咨询页 --> 把申报人填写的数据传给后台处理
     * @ 控制器    --> DemoMyAdvisory
     * */
    appController.controller('DemoMyAdvisory',['$scope','$http','$location','Base','serverUrl',function ($scope,$http,$location,Base,serverUrl){
        $scope.urlValue = serverUrl.serverUrlFun();
        // 根据id查看办事详情
        $scope.myUrl = $location.absUrl().split('=')[1];
        $http({
            method: 'POST',
            url: $scope.urlValue + '/businessInfo/selBusinessInfoById',
            data:JSON.stringify({
                "businessId":$scope.myUrl
            })
        }).then(function successCallback(response) {
            $scope.businessName = response.data.businessInfo.businessName;
            $scope.sectionText = response.data.businessInfo.deptId;

            $scope.myAdvisoryFun = function (){
                $http({
                    method: 'POST',
                    url: $scope.urlValue + '/activiti/saveConsultInfo',
                    data:JSON.stringify({
                        "name":$scope.advisoryName,
                        "department":$scope.sectionText,
                        "title":$scope.advisoryTitle,
                        "content":$scope.advisoryPhone,
                        "phone":$scope.advisoryContent
                    })
                }).then(function successCallback(response) {
                    alert('提交成功');
                    window.location.href = 'business-guide.html?businessid='+$scope.myUrl;
                }, function errorCallback(response) {
                    console.log('错误');
                });
            };
        }, function errorCallback(response) {
            console.log('错误');
        });
    }]);
    //------------------------- 我要咨询页面 end ---------------------------


    //------------------------- 新闻详情页面 start -------------------------
    /**
     * @ 新闻详情页 --> 根据id获取新闻详情信息
     * @ 控制器    --> DemoNewsInfo
     * */
    appController.controller('DemoNewsInfo',['$scope','$http','$location','Base','serverUrl',function ($scope,$http,$location,Base,serverUrl){
        $scope.urlValue = serverUrl.serverUrlFun();
        // 根据id查看办事详情
        $scope.myUrl = $location.absUrl().split('=')[1];
        $http({
            method: 'POST',
            url: $scope.urlValue + '/hui/proxyMethod',
            data:JSON.stringify({
                "serviceName":"InformationController",
                "methodName":"getinformationDetails",
                "userId":Base.get('userOnlyIdValue'),
                "informationId":$scope.myUrl
            })
        }).then(function successCallback(response) {
            $scope.newsInfo = response.data.Information;
            $scope.newsTime = new Date($scope.newsInfo.createTime).toLocaleString();

        }, function errorCallback(response) {
            console.log('错误');
        });
    }]);
    //------------------------- 新闻详情页面 end ---------------------------


    //------------------------- 新闻列表页面 start -------------------------
    /**
     * @ 新闻详情页 --> 根据id获取新闻详情信息
     * @ 控制器    --> DemoNewsList
     * */
    appController.controller('DemoNewsList',['$scope','$http','$location','Base','serverUrl',function ($scope,$http,$location,Base,serverUrl){
        $scope.urlValue = serverUrl.serverUrlFun();
        // 根据id查看办事详情
        $scope.myUrl = $location.absUrl().split('=')[1];
        $http({
            method: 'POST',
            url: $scope.urlValue + '/hui/proxyMethod',
            data:JSON.stringify({
                "serviceName":"InformationController",
                "methodName":"getInformationBySourceByPageForUser",
                "userId":Base.get('userOnlyIdValue'),
                "source":"综合",
                "indexPage":$scope.myUrl,
                "displayRecordCount":'10'
            })
        }).then(function successCallback(response) {
            $scope.newsArr = response.data.InformationUrlGrid.rows;

        }, function errorCallback(response) {
            console.log('错误');
        });
    }]);
    //------------------------- 新闻列表页面 end ---------------------------


    //------------------------- 修改密码页面 start -------------------------
    /**
     * @ 修改密码页 --> 根据id修改密码
     * @ 控制器    --> DemoNewsList
     * */
    appController.controller('DemoChangePass',['$scope','$http','Base','serverUrl',function ($scope,$http,Base,serverUrl){
        $scope.urlValue = serverUrl.serverUrlFun();
        $scope.changePassFun = function () {
            $http({
                method: 'POST',
                url: $scope.urlValue + '/hui/proxyMethod',
                data:JSON.stringify({
                    "serviceName":"UserController",
                    "methodName":"updateUserPassword2",
                    "id":Base.get('userOnlyIdValue'),
                    "passWord":$scope.changePassword
                })
            }).then(function successCallback(response) {
                alert('修改成功');
                Base.remove('userOnlyIdValue');
                window.location.href = 'personal-register.html';

            }, function errorCallback(response) {
                console.log('错误');
            });
        };
    }]);
    //------------------------- 修改密码页面 end ---------------------------






})();