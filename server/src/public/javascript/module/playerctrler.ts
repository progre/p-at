import directives = require('./directives');

export = PlayerCtrler;
var PlayerCtrler = [
    '$scope', '$routeParams', '$cookies',
    ($scope: any, $routeParams: any, $cookies: any) => {
        // transitioníÜÇ…overflowÇïœçXÇ∑ÇÈÇ∆transitionÇ™é~Ç‹ÇÈ
        $('.dummy').css({
            width: '100%',
            height: '200px'
        });
        var fullScreen = true;

        $scope.localIp = '127.0.0.1:' + ($cookies.localPort || 7144);
        $scope.streamId = $routeParams.streamid;
        $scope.remoteIp = $routeParams.remoteip;
        $('main').click(function (eventObject) {
            if (fullScreen) {
                directives.fullscreenToWindow($(this).children('.player'));
                $scope.fullscreen = false;
                fullScreen = false;
            } else {
                directives.windowToFullscreen($(this).children('.player'));
                $scope.fullscreen = true;
                fullScreen = true;
            }
        });
    }
];
