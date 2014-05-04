export = IndexCtrler;
var IndexCtrler = [
    '$scope', '$http',
    ($scope: any, $http: ng.IHttpService) => {
        $http.get('/api/1/channels')
            .then(response => {
                var data = response.data;
                $scope.portConnectable = data.portConnectable;
                $scope.channels = data.channels.map(addPropertiesForView);
                $scope.ypInfos = data.ypInfos.map(addPropertiesForView);
                $scope.events = data.events.map(addPropertiesForView);
                data.events.forEach((x:any) => console.log(x));
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