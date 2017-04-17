/**
 * Created by lenovo on 2017/2/20.
 */
(function (){

    var app = angular.module('myApp',['myAppController','myAppDirective','myAppServices','myAppConfig']);


})();

// @ 工程师正在攻克的悬浮框 --> 原生JS
//var bg = document.getElementById('bg');
//var show = document.getElementById('show');
//var closeImg = document.getElementsByClassName('close-img')[0];
//var closeBtn = document.getElementsByClassName('close-img-btn')[0];
//
//var hintFun = function (){
//    bg.style.display = 'block';
//    show.style.display = 'block';
//    bg.style.height = document.documentElement.scrollHeight+'px';
//};
//
//closeImg.onclick = function (){
//    bg.style.display = 'none';
//    show.style.display = 'none';
//};
//
//closeBtn.onmouseover = function (){
//    this.style.transform = 'scale(1.4)';
//};
//closeBtn.onmouseout = function (){
//    this.style.transform = 'scale(1.0)';
//};