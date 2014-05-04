export = IndexCtrler;
var IndexCtrler = [
    '$scope', '$http',
    ($scope: any, $http: ng.IHttpService) => {
        $http.get('/api/1/channels')
            .then(response => {
                $scope.portConnectable = response.data.portConnectable;
                $scope.channels = response.data.channels.map(addPropertiesForView);
                $scope.ypInfos = response.data.ypInfos.map(addPropertiesForView);
            })
            .catch(reason => {
                console.error(reason);
            });
        $scope.players = [];
        $scope.play = () => {
            $scope.players.push(Date.now());
        };
    }
];

function addPropertiesForView(x: any) {
    x.line1 = x.name;
    var bandType = x.bandType.length > 0 ? '<' + x.bandType + '>' : '';
    x.line2 = [x.genre, x.desc, bandType]
        .filter(x => x.length > 0)
        .join(' - ');
    x.line3 = x.comment;
    return x;
}