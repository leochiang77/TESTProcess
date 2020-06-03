app.controller('SetCtrl', ['$scope', '$http', '$timeout', 'backendServer', function ($scope, $http,$timeout, backendServer) {

    $scope.initialStatus = false;
    $scope.updateStatus = false;
    $scope.fail = false;
    $scope.errorMessage = '';


    getMqttConfig();

    function getMqttConfig() {
        $http.get(backendServer + '/api/mqttconfig').then(function (results) {
            // project is a collection of ProjectSummary objects
            var result = JSON.parse(results.data);
            $scope.mqttInfo = JSON.parse(result);
            console.log($scope.mqttInfo);
        }, function (error) {
            $scope.initialStatus = true;
        });
    };

    $scope.saveMQTTInfo = function () {

        var mqtt = {
            IP_Address: $scope.mqttInfo.IP_Address,
            Port: $scope.mqttInfo.Port,
            User: $scope.mqttInfo.User,
            Password: $scope.mqttInfo.Password,
            SubscribeRealTimeTopic: $scope.mqttInfo.SubscribeRealTimeTopic,
            PublishReSendTopic: $scope.mqttInfo.PublishReSendTopic,
            SubscribeHealthStatusTopic: $scope.mqttInfo.SubscribeHealthStatusTopic
        };

        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }
        $http.post(backendServer + '/api/mqttconfig', "'" + JSON.stringify(mqtt) + "'").then(function (data) {
            processSuccess();
            //$scope.updateStatus = true;
            //$scope.fail = false;

        }, function (error) {
            // alert(error.message);
            $scope.errorMessage = "修改失敗";
            $scope.fail = true;
            //$scope.updateStatus = false;
            processError(error);
        });

    };

    function processSuccess() {
        // $scope.editForm.$dirty = false;
        $scope.fail = false;
        $scope.updateStatus = true;
        startTimer();
    }

    function processError(error) {
        startTimer();
    }

    function startTimer() {
        timer = $timeout(function () {
            $timeout.cancel(timer);
            $scope.updateStatus = false;
        }, 3000);
    }
}])