/// <reference path="../../typings/tsd.d.ts"/>
/// <reference path="../../typings/linq.d.ts"/>
/// <reference path="../../typings/promise.d.ts"/>

declare var Silverlight: any;

var root = '/';

var app = angular.module('app', ['ngRoute', 'ngAnimate']);
app.config([
    '$routeProvider', '$locationProvider',
    ($routeProvider: ng.route.IRouteProvider, $locationProvider: ng.ILocationProvider) => {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when(root, {
                templateUrl: root + 'html/index.html', controller: 'IndexController'
            }).otherwise({
                templateUrl: root + 'html/404.html'
            });
    }
]);
app.controller('IndexController', [
    '$scope', '$http',
    ($scope: any, $http: ng.IHttpService) => {
        $http.get('/api/1/channel')
            .then(response => {
                $scope.portConnectable = response.data.portConnectable;
                $scope.channels = response.data.channels;
            })
            .catch(reason => {
                console.error(reason);
            });
        $scope.players = [];
        $scope.play = () => {
            $scope.players.push(Date.now());
        };
    }
]);

app.directive('silverlight', () => ({
    replace: true,
    restrict: 'E',
    link: (scope: any, element: JQuery, attrs: any) => {
        Silverlight.createObject(
            '/plugins/wmvplayer.xap',
            element[0],
            Date.now().toString(),// 一意な文字列
            {
                width: '320',
                height: '240',
                background: '#000',
                version: '5.0'
            },
            {
                onError: () => console.error('Error on Silverlight'),
                onLoad: (sl: any, args: any) => {
                    var ctrler = sl.Content.Controller;
                    ctrler.LocalIp = attrs.localip;
                    ctrler.Play(attrs.streamid, attrs.remoteip);
                }
            },
            null, //初期化パラメータ
            null //onLoad イベントに渡される値
            );
    }
}));

angular.bootstrap(<any>document, ['app']);
