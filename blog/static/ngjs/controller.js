app.controller('PerformanceDataController', ['$scope','$http', 
    function ($scope,$http, signalRHubProxy) {
        var performanceDataHub = signalRHubProxy(signalRHubProxy.defaultServer, 'performanceHub');
        var entry = [];
        //$scope.myJson = {
        //    globals: {
        //        shadow: false,
        //        fontFamily: "Verdana",
        //        fontWeight: "100"
        //    },
        //    scale: {
        //        "layout": "1x2", //specify the layout by rows and columns
        //        "size-factor": 0.5 //provide a decimal or percentage value
        //    },
        //    type: "ring3d",
        //    backgroundColor: "#fff",

        //    legend: {
        //        layout: "x5",
        //        position: "50%",
        //        borderColor: "transparent",
        //        marker: {
        //            borderRadius: 10,
        //            borderColor: "transparent"
        //        }
        //    },
        //    tooltip: {
        //        text: "%v GB"
        //    },
        //    plot: {
        //        refAngle: "-90",
        //        borderWidth: "0px",
        //        valueBox: {
        //            placement: "in",
        //            text: "%v GB",
        //            fontSize: "15px",
        //            textAlpha: 1,
        //        }
        //    },
        //    "series": [
        //         { text: "C 碟", "values": [0, 0], backgroundColor: "#26A0DA #26A0DA" },
        //          { text: "D 碟", "values": [0, 0], backgroundColor: "#ACACAC #ACACAC" }
        //    ]
        //    //series: [{
        //    //    text: "C碟已使用容量",
        //    //    values: [0],
        //    //    //backgroundColor: "#FA6E6E #FA9494",
        //    //    backgroundColor: "#26A0DA #26A0DA"
        //    //}, {
        //    //    text: "C碟可用容量",
        //    //    values: [0],
        //    //    // backgroundColor: "#F1C795 #feebd2"
        //    //    backgroundColor: "#ACACAC #ACACAC"
        //    //}]
        //};

        $scope.myJson = {
            "layout": "1x2",
            "graphset": [
              {
                  "type": "ring",
                  "title": {
                      "text": "(C:)",
                      "y": "90%",
                      "font-family": "Georgia"
                  },
                  legend: {
                     
                      borderColor: "#333",
                      marker: {
                          borderRadius: 10,
                          borderColor: "transparent"
                      }
                  },
                  tooltip: {
                      text: "%v GB"
                  },
                  plot: {
                      refAngle: "-90",
                      borderWidth: "1px",
                      valueBox: {
                          placement: "in",
                          text: "%v GB",
                          fontSize: "15px",
                          textAlpha: 1,
                      }
                  },
                  series: [
                      {
                          values: [0],
                          "text": "已使用空間",
                          "background-color": "steelblue"
                      },
                      {
                          values: [0],
                          "text": "可用空間",
                          "background-color": "#ACACAC"
                      }
                  ],

              },
              {
                "type": "ring",
                "title": {
                    "text": "(D:)",
                    "y": "90%",
                    "font-family": "Georgia"
                },
                legend: {
              
                    borderColor: "#333",
                    marker: {
                        borderRadius: 10,
                        borderColor: "transparent"
                    }
                },
                tooltip: {
                    text: "%v GB"
                },
                plot: {
                    refAngle: "-90",
                    borderWidth: "0px",
                    valueBox: {
                        placement: "in",
                        text: "%v GB",
                        fontSize: "15px",
                        textAlpha: 1,
                    }
                },
                "series": [
                   {
                       "values": [0],
                       "text": "已使用空間",
                       "background-color": "steelblue"
                   },
                    {
                        "values": [0],
                        "text": "可用空間",
                        "background-color": "#ACACAC"
                    }
                ],

            }
            ]

        };

        $scope.realtimeLine = generateLineData();
        

        $scope.realtimeBar = generateLineData();
        $scope.realtimeArea = generateLineData();
        $scope.options = { thickness: 10, mode: 'gauge', total: 100 };
        $scope.data = [
            { label: 'CPU', value: 10, color: 'steelblue', suffix: '%' }
        ];

        $scope.ramGaugeoptions = { thickness: 10, mode: 'gauge', total: 100 };
        $scope.ramGaugeData = [
            { label: 'RAM', value: 68, color: '#1f77b4', suffix: '%' }
        ];
        $scope.cpuData = 0;
        $scope.currentRamNumber = 0;
        $scope.diskReadData = 0;
        $scope.diskWriteData = 0;
        //$scope.realtimeLineFeed = entry;
        $scope.cpuLabel = [{ label: 'Layer 1', values: [{ time: (new Date()).getTime() / 1000 | 0, y: 0 }] }];
        $scope.memLabel = [{ label: 'Layer 1', values: [{ time: (new Date()).getTime() / 1000 | 0, y: 0 }] }];
        //$scope.cDiskInfo = [{ label: 'A', value: 65 }, { label: 'B', value: 35 }];
        $scope.cDiskInfo = [];
        var cDiskTotal = 0;
        var cDiskAvailable = 0;
        var dDiskTotal = 0;
        var dDiskAvailable = 0;
        var temp = [];

        performanceDataHub.on('broadcastPerformance', function (data) {
            var timestamp = ((new Date()).getTime() / 1000) | 0;
            var chartEntry = [];
            var cpuEntry = [];
            var memEntry = [];
            data.forEach(function (dataItem) {

                switch (dataItem.categoryName) {
                    case 'Processor':
                        $scope.cpuData = dataItem.value;
                        chartEntry.push({ time: timestamp, y: dataItem.value });
                        $scope.data = [
                            { label: 'CPU', value: dataItem.value, color: 'steelblue', suffix: '%' }
                        ];
                        cpuEntry.push({ time: timestamp, y: dataItem.value });
                        break;
                    case 'Memory':
                        $scope.memData = dataItem.value;
                        chartEntry.push({ time: timestamp, y: dataItem.value });
                        $scope.ramGaugeData = [
                            { label: 'RAM', value: dataItem.value, color: '#1f77b4', suffix: '%' }
                        ];
                        $scope.currentRamNumber = dataItem.value;
                        memEntry.push({ time: timestamp, y: dataItem.value });
                        break;
                    case 'Network In':
                        $scope.netInData = dataItem.value.toFixed(2);
                        chartEntry.push({ time: timestamp, y: dataItem.value });
                        break;
                    case 'Network Out':
                        $scope.netOutData = dataItem.value.toFixed(2);
                        chartEntry.push({ time: timestamp, y: dataItem.value });
                        break;
                    case 'Disk Read KBytes/Sec':
                        $scope.diskReadData = dataItem.value.toFixed(3);
                        chartEntry.push({ time: timestamp, y: dataItem.value });
                        break;
                    case 'Disk Write KBytes/Sec':
                        $scope.diskWriteData = dataItem.value.toFixed(3);
                        chartEntry.push({ time: timestamp, y: dataItem.value });
                        break;
                    case 'C Disk Total Size':
                        cDiskTotal = dataItem.value;
                        break;
                    case 'C Disk Available space to current user':
                        cDiskAvailable = dataItem.value;
                        break;
                    case 'D Disk Total Size':
                        dDiskTotal = dataItem.value;
                        break;
                    case 'D Disk Available space to current user':
                        dDiskAvailable = dataItem.value;
                        break;
                    default:
                        break;
                        //default code block
                }
            });
            $scope.myJson.graphset[0].series[0].values[0] = cDiskTotal - cDiskAvailable;
            $scope.myJson.graphset[0].series[1].values[0] = cDiskAvailable;
            $scope.myJson.graphset[1].series[0].values[0] = dDiskTotal - dDiskAvailable;
            $scope.myJson.graphset[1].series[1].values[0] = dDiskAvailable;

            $scope.realtimeCPUFeed = cpuEntry;
            $scope.realtimeMEMFeed = memEntry;

            $scope.realtimeLineFeed = chartEntry;
            //console.log($scope.realtimeLineFeed);

            $scope.realtimeBarFeed = chartEntry;
            $scope.realtimeAreaFeed = chartEntry;

        });

        function generateLineData() {
            var data1 = [{ label: 'Layer 1', values: [] }];
            for (var i = 0; i <= 128; i++) {
                var x = 20 * (i / 128) - 10,
                    y = Math.cos(x) * x;
                data1[0].values.push({ x: x, y: y });
            }
            var data2 = [
                { label: 'Layer 1', values: [] },
                { label: 'Layer 2', values: [] },
                { label: 'Layer 3', values: [] }
            ];
            for (var i = 0; i < 256; i++) {
                var x = 40 * (i / 256) - 20;
                data2[0].values.push({ x: x, y: Math.sin(x) * (x / 4) });
                data2[1].values.push({ x: x, y: Math.cos(x) * (x / Math.PI) });
                data2[2].values.push({ x: x, y: Math.sin(x) * (x / 2) });
            }
            return data2;
        }

        $scope.areaAxes = ['left', 'right', 'bottom'];
        $scope.lineAxes = ['right', 'bottom'];
        $scope.scatterAxes = ['left', 'right', 'top', 'bottom'];
    }
]);





app.controller('ZMQDataController', ['$rootScope', '$scope','$http', '$timeout', 'signalRHubProxy', 'backendServer', function ($rootScope, $scope,$http, $timeout, signalRHubProxy, backendServer) {
    var performanceDataHub = signalRHubProxy(signalRHubProxy.defaultServer, 'zmqHub');
    $scope.alltags = [];

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


    //把勾選的tag傳到後台
    $scope.query = function () {
        console.log(JSON.stringify($scope.myTag));
        //serverTimeHubProxy.invoke('sendFilter', JSON.stringify($scope.myTag));
        for (var i = 0; i < $scope.data.Tags.length; i++) {
            if ($scope.myTag.selected[$scope.data.Tags[i].TagName] == false || !$scope.myTag.selected[$scope.data.Tags[i].TagName]) {
                delete $scope.dataset1[$scope.data.Tags[i].TagName];
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

    GetTagsFromCIPD1();
    /***** GET tag config ********/
    function GetTagsFromCIPD1() {
        return $http.get('http://localhost:41999/api/tagsInfo').then(function (results) {
            // project is a collection of ProjectSummary objects
            $scope.tagsInfo = results.data;

            for (var i = 0; i < results.data.Tags.length; i++) {
                $scope.alltags.push(results.data.Tags[i].TagName);
            }
            console.log($scope.tagsInfo);
        });
    };


    function createNVD3(tagname) {

        $scope.dataset1[tagname] = [{ values: [], key: tagname, color: '#2ca02c' }];
    }


    //function createNVD3(data) {
    //    for (i = 0; i < data.length; i++) {
    //        $scope.dataset[data[i].TagName] = [{ values: [], key: data[i].TagName }];
    //    }  
    //}

    //function createTags(data) {
    //    for (i = 0; i < data.length; i++) {
    //        $rootScope.alltags.push(data[i].TagName);
    //        console.log(data[i].TagName);
    //    }
       
    //}

    performanceDataHub.on('broadcastMsg', function (data, time) {
     
        var timestamp = ((new Date()).getTime() / 1000) | 0;
  
        $scope.currentServerTime = time;
 
        var receiveObj = JSON.parse(data);


        $scope.data = receiveObj;
        console.log($scope.data.Tags.length);

        for (var i = 0; i < receiveObj.Tags.length; i++) {
            if (!$scope.dataset1[receiveObj.Tags[i].TagName]) {
                createNVD3(receiveObj.Tags[i].TagName);
            }
        }

        for (var i = 0; i < receiveObj.Tags.length; i++) {

            $scope.dataset1[receiveObj.Tags[i].TagName][0].values.push({
                  x: Date.now(),
                  y: receiveObj.Tags[i].TagValue
              });
              if ($scope.dataset1[receiveObj.Tags[i].TagName][0].values.length > 20) {
                  $scope.dataset1[receiveObj.Tags[i].TagName][0].values.shift();
              }

        }
    });
}
])





app.controller('ServerTimeController', ['$scope', 'signalRHubProxy',
    function ServerTimeController($scope, signalRHubProxy) {
        var clientPushHubProxy = signalRHubProxy(signalRHubProxy.defaultServer, 'performanceHub', { logging: true });
        var serverTimeHubProxy = signalRHubProxy(signalRHubProxy.defaultServer, 'performanceHub');

        clientPushHubProxy.on('serverTime', function (data) {
            $scope.currentServerTime = data;
            var x = clientPushHubProxy.connection.id;
        });
        $scope.getServerTime = function () {
            //console.log(1);
            serverTimeHubProxy.invoke('getServerTime', function (data) {
                $scope.currentServerTimeManually = data;
            });
        };
    }
]);

