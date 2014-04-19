/// <reference path="../../typings/tsd.d.ts"/>
/// <reference path="../../typings/linq.d.ts"/>
/// <reference path="../../typings/promise.d.ts"/>

declare var Silverlight: any;

var root = '/';

var app = angular.module('app', ['ngRoute', 'ngAnimate']);
//app.run(['$rootScope', '$http',
//    ($rootScope: ng.IRootScopeService, $http: ng.IHttpService) => {
//        $rootScope.$on('$routeChangeStart', (next: any, current: any) => {
//            console.log('route change start');
//            $http.get('/api/1/checkport').success(() => {
//                console.log('success')
//            }).error(() => {
//                console.log('error')
//                });
//        });
//    }
//]);
app.config(['$routeProvider', '$locationProvider', '$httpProvider',
    ($routeProvider: ng.route.IRouteProvider, $locationProvider: ng.ILocationProvider, $httpProvider: ng.IHttpProvider) => {
        $locationProvider.html5Mode(true);
        $httpProvider.responseInterceptors.push([
            '$q', '$location',
            ($q: ng.IQService, $location: ng.ILocationService) =>
                (promise: Promise<any>) =>
                    promise.then(
                        response => response,
                        (response: any) => {
                            if (response.status === 401) {
                                $location.url('/login');
                            }
                            return $q.reject(response);
                        })
        ]);
        $routeProvider
            .when(root, {
                templateUrl: root + 'html/index.html', controller: 'IndexController'
            }).otherwise({
                templateUrl: root + 'html/404.html'
            });
    }
]);
app.controller('IndexController',
    ['$scope', ($scope: any) => {
        $scope.players = [];
        $scope.play = () => {
            $scope.players.push(Date.now());
        };
    }]);

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
