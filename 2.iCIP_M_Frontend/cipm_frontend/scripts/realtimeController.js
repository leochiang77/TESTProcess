

app.controller('RealtimeController', ['$rootScope', '$scope', '$timeout', '$http',  'signalRHubProxy', 'backendServer', function ($rootScope, $scope, $timeout, $http, signalRHubProxy, backendServer) {

    var mqttHub = signalRHubProxy(signalRHubProxy.defaultServer, 'mqttHub');
    var serverTimeHubProxy = signalRHubProxy(signalRHubProxy.defaultServer, 'mqttHub');

    $scope.alltags = [];
    $scope.selectedTag = [];


    $scope.query = function () {

        var temp =$scope.myTag.selected;
        for (var tagname in temp) {
            if ($scope.dataset1[tagname] && temp[tagname] == false) {  //假如dataset的key=tagname有資料以及選擇的tag=false則刪除
                delete $scope.dataset1[tagname];
            }
        }

        $http.post(backendServer + '/api/filter', "'" + JSON.stringify($scope.myTag) + "'").then(function (results) { });
    };

    InitialFilter();
    function InitialFilter() {
        $http.post(backendServer + '/api/filter', "'" + JSON.stringify({
            selected: {}
        }) + "'").then(function (results) { });
    }

    $scope.myTag = {
        selected: {}
    };



    //GetTagsFromCIPD1();
    ///***** GET tag config ********/
    //function GetTagsFromCIPD1() {
    //    return $http.get('http://localhost:41999/api/tagsInfo').then(function (results) {
    //        // project is a collection of ProjectSummary objects
    //        $scope.tagsInfo1 = results.data;

    //        for (var i = 0; i < results.data.Tags.length; i++) {
    //            $scope.alltags.push(results.data.Tags[i].TagName);
    //        }
    //    });
    //};
    $scope.myCIPD = {};

    $scope.allcipd = {};

    $scope.cipdCount = {};


    //從後端取得所有cipd與tag的組合
    GetAllCIPD();
    function GetAllCIPD() {
        $http.get(backendServer + '/api/cipdquery').then(function (results) {

            for (i = 0 ; i < results.data.length; i++) {
                //   console.log(results.data[i].Tags);
                $scope.tempCount = i ;
                $scope.allcipd[results.data[i].iCIP_D_Name] = results.data[i];
                $scope.myCIPD[results.data[i].iCIP_D_No] = false;
                //$scope.cipdCount[results.data[i].iCIP_D_No] = ({ name: results.data[i].iCIP_D_Name, count: results.data[i].iCIP_D_No, tags: results.data[i].Tags });
                $scope.cipdCount[results.data[i].iCIP_D_No] = ({ name: results.data[i].iCIP_D_Name, count: results.data[i].iCIP_D_No, tags: results.data[i].Tags });

            }
        }, function (error) {
            $scope.initialStatus = true;
        });
    }


    //$scope.users = [];
    //$scope.usersTable = new ngTableParams({
    //    page: 1,
    //    count: 10
    //}, {
    //    total: $scope.users.length,
    //    getData: function ($defer, params) {
    //        $http.get(backendServer + '/api/tagsInfo').then(function (response) {
    //            $scope.users = response.data.Tags;
    //            console.log($scope.users);
    //            $scope.datat = params.sorting() ? $filter('orderBy')($scope.users, params.orderBy()) : $scope.users;
    //            $scope.datat = params.filter() ? $filter('filter')($scope.datat, params.filter()) : $scope.datat;
    //            $scope.datat = $scope.datat.slice((params.page() - 1) * params.count(), params.page() * params.count());
    //            $defer.resolve($scope.datat);
    //            //$defer.resolve($scope.users.slice((params.page() - 1) * params.count(), params.page() * params.count()));
    //            params.total($scope.users.length);
    //        });

    //    }
    //});



    $scope.options = {
        chart: {
            type: 'lineChart',
            height: 200,
            margin: {
                top: 0,
                right: 50,
                bottom: 40,
                left: 55
            },
            // x: function(d){ return new Date(d.x).toISOString(); },
            x: function (d) {
                return d.x;
            }, //
            // xScale: d3.time.scale,
            y: function (d) {
                return d.y;
            },
            useInteractiveGuideline: true,
            transitionDuration: 0,
            xAxis: {
                axisLabel: 'Time ',
                tickFormat: function (d) {
                    return d3.time.format('%X')(new Date(d));
                },
            },
            yAxis: {
                tickFormat: function (d) {
                    return d3.format('.02f')(d);
                }
            },
            callback: function (chart) {
                console.log("!!! lineChart callback !!!");
            }
        }
    };



    $scope.dataset1 = {};

    //function createNVD3(data) {
    //    for (i = 0; i < data.length; i++) {
    //        $scope.dataset1[data[i].tag] = [{ values: [], key: data[i].tag, color: '#2ca02c' }];
    //    }
    //}

    function createNVD3(tagname) {

        $scope.dataset1[tagname] = [{ values: [], key: tagname, color: '#2ca02c' }];
    }

    var now = 0;

    mqttHub.on('broadcastData', function (data) {
        var receivedObj = JSON.parse(data);
        //console.log(receivedObj);
        $scope.data = receivedObj;

        //假設收到的tag不再原本的畫面上，則新增一條nvd3 line chart
        for (var i = 0; i < receivedObj.DataModelList.length; i++) {
            //console.log($scope.dataset1[receivedObj.DataModelList[i].tag]);
            if (!$scope.dataset1[receivedObj.DataModelList[i].tag]) {
                createNVD3(receivedObj.DataModelList[i].tag);
            }
        }

        // if ($scope.data[$scope.myTag.selected])

        //if (init) {
        //    createNVD3(receivedObj.DataModelList);
        //    //init = false;
        //}

        for (var i = 0; i < receivedObj.DataModelList.length; i++) {

            $scope.dataset1[receivedObj.DataModelList[i].tag][0].values.push({
                x: Date.now(),
                y: parseFloat(receivedObj.DataModelList[i].value)
            });
           
         //   $scope.dataset1[receivedObj.DataModelList[i].tag][0].options.chart["yDomain"] = [receivedObj.DataModelList[i].value * 0.97, receivedObj.DataModelList[i].value * 1.03];
            if ($scope.dataset1[receivedObj.DataModelList[i].tag][0].values.length > 20) {
                $scope.dataset1[receivedObj.DataModelList[i].tag][0].values.shift();
            }

        }



    });

}]);