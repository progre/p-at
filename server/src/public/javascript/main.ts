/// <reference path="../../typings/tsd.d.ts"/>
/// <reference path="../../typings/linq.d.ts"/>
/// <reference path="../../typings/promise.d.ts"/>
declare var Silverlight: any;
import PlayerCtrler = require('./module/playerctrler');
import directives = require('./module/directives');

var root = '/';

var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngCookies']);

app.config([
    '$routeProvider', '$locationProvider',
    ($routeProvider: ng.route.IRouteProvider, $locationProvider: ng.ILocationProvider) => {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when(root, {
                templateUrl: root + 'html/index.html', controller: 'IndexController'
            }).when(root + 'player.html', {
                templateUrl: root + 'html/player.html', controller: 'PlayerCtrler'
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
                $scope.channels = response.data.channels.map((x: any) => {
                    x.line1 = x.name;
                    var bandType = x.bandType.length > 0 ? '<' + x.bandType + '>' : '';
                    x.line2 = [x.genre, x.desc, bandType]
                        .filter(x => x.length > 0)
                        .join(' - ');
                    x.line3 = x.comment;
                    return x;
                });
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

app.controller('PlayerCtrler', PlayerCtrler);
app.directive('silverlight', directives.silverlight);

angular.bootstrap(<any>document, ['app']);
