'use strict';

app.factory('signalRHubProxy', ['$rootScope', 'backendServer', function ($rootScope, backendServer) {
    function signalRHubProxyFactory(serverUrl, hubName, startOptions) {
        var connection = $.hubConnection(backendServer);
        var proxy = connection.createHubProxy(hubName);
        connection.start(startOptions).done(function () { });
  
        return {
            on: function (eventName, callback) {
                proxy.on(eventName, function (result) {
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback(result);
                        }
                    });
                });
            },
            off: function (eventName, callback) {
                proxy.off(eventName, function (result) {
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback(result);
                        }
                    });
                });
            },
            invoke: function (methodName, callback) {
                proxy.invoke(methodName)
                    .done(function (result) {
                        $rootScope.$apply(function () {
                            if (callback) {
                                callback(result);
                            }
                        });
                    });
            },
            invoke: function (methodName,param, callback) {
                proxy.invoke(methodName,param)
                    .done(function (result) {
                        $rootScope.$apply(function () {
                            if (callback) {
                                callback(result);
                            }
                        });
                    });
            },
            connection: connection
        };
    };

    return signalRHubProxyFactory;
}]);
