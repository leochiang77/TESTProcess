app.controller('StatusController', ['$rootScope', '$scope', '$http', '$timeout', 'signalRHubProxy', 'backendServer', function ($rootScope, $scope, $http, $timeout, signalRHubProxy, backendServer) {
    var mqttHub = signalRHubProxy(signalRHubProxy.defaultServer, 'mqttHub');

    $scope.cipd1_live = false;
    $scope.cipd1_died = true;
    $scope.gridData = [
            { artist: "Pink Floyd", track: "The dark side of the Moon" },
            { artist: "The Beatles", track: "I've just seen a face" },
            { artist: "Queen", track: "Innuendo" }
    ];
    $scope.gridColumns = [
      { field: "no", title: "設備編號" },
      { field: "cpu", title: "Track" },
      { field: "track", title: "Track" }
    ];

    $scope.icipd = [
        { No: "", CPU: "", RAM: "", CDISKA: "", CDISKP: "", DDISKA: "", DDISKP: "", Status: "", Live: "", Died: "" }

    ];
    $scope.dataset1 = {};

    //function createNVD3(data) {
    //    for (i = 0; i < data.length; i++) {
    //        $scope.dataset1[data[i].tag] = [{ values: [], key: data[i].tag, color: '#2ca02c' }];
    //    }
    //}


    //  $scope.dataset1[tagname] = [{ values: [], key: tagname, color: '#2ca02c' }];

    $scope.cipd1CPU = 0;
    $scope.cipd1RAM = 0;
    $scope.cipd1Disk = 0;

    var cpu;
    var ram;
    var cdiska = 1;
    var ddiska = 1;

    var cdiskt;
    var ddiskt;

    var cdiskp = cdiska / cdiskt;
    var ddiskp = ddiska / ddiskt;

    var status;
    var live;
    var died;

    var normalTW = '運作中';
    var normal = 'Normal';
    var notactiveTW = '服務未啟動';
    var notactive = 'Service not active';
    var readthreeTW = '讀取Tag失敗三次';
    var readthree = 'Read Tag fail three times';
    var reconnectTW = '重連OPC Server';
    var reconnect = 'Reconnect to OPC Server';

    var reconnecttTW = '重連OPC Server 3次失敗';
    var reconnectt = 'Reconnect to OPC Server fail three times';

    var closeTW = '關閉中';
    var close = 'close';

    var cipdNoList = {};

    var i = 1;

    mqttHub.on('broadcastMessage', function (data) {

        if (data.indexOf('"value":}') >= 0) {

            data.replace('"value":}', '"value":0}')
        }
        temp = JSON.parse(data);

        switch ($scope.lang) {
            case 'zhTW':
                if (temp.cipdstatus == 0) {
                    status = normalTW;
                    live = true;
                    died = false;
                } else if (temp.cipdstatus == 1) {
                    status = readthreeTW;
                    live = false;
                    died = true;

                } else if (temp.cipdstatus == 2) {
                    status = reconnectTW;
                    live = true;
                    died = false;

                } else if (temp.cipdstatus == 3) {
                    status = reconnecttTW;
                    live = true;
                    died = false;

                } else if (temp.cipdstatus == 5) {
                    status = notactiveTW;
                    live = false;
                    died = true;

                }
                else {
                    status = closeTW;
                    live = false;
                    died = true;

                }
                break;
            case 'en':
                if (temp.cipdstatus == 0) {
                    status = normal;
                    live = true;
                    died = false;
                } else if (temp.cipdstatus == 1) {
                    status = readthree;
                    live = false;
                    died = true;

                } else if (temp.cipdstatus == 2) {
                    status = reconnect;
                    live = true;
                    died = false;

                } else if (temp.cipdstatus == 3) {
                    status = reconnectt;
                    live = true;
                    died = false;

                } else if (temp.cipdstatus == 5) {
                    status = notactive;
                    live = false;
                    died = true;

                }
                else {
                    status = close;
                    live = false;
                    died = true;

                }
                break;
            default:
                if (temp.cipdstatus == 0) {
                    status = normalTW;
                    live = true;
                    died = false;
                } else if (temp.cipdstatus == 1) {
                    status = readthreeTW;
                    live = false;
                    died = true;

                } else if (temp.cipdstatus == 2) {
                    status = reconnectTW;
                    live = true;
                    died = false;

                } else if (temp.cipdstatus == 3) {
                    status = reconnecttTW;
                    live = true;
                    died = false;

                } else if (temp.cipdstatus == 5) {
                    status = notactiveTW;
                    live = false;
                    died = true;

                }
                else {
                    status = closeTW;
                    live = false;
                    died = true;

                }
                break;
        }

        temp.PerformanceModelList.forEach(function (dataItem) {
            switch (dataItem.categoryName) {
                case 'Processor':
                    cpu = dataItem.value.toFixed(2);
                    $scope.dataset1[temp.cipdno] = [{ No: temp.cipdno, Name: temp.cipdname, Description: temp.cipddescription, CPU: cpu, RAM: ram, CDISKA: cdiska, CDISKP: cdiskp, DDISKA: ddiska, DDISKP: ddiskp, Status: status, Live: live, Died: died }];
                    break;
                case 'Memory':
                    ram = dataItem.value.toFixed(2);
                    $scope.dataset1[temp.cipdno] = [{ No: temp.cipdno, Name: temp.cipdname, Description: temp.cipddescription, CPU: cpu, RAM: ram, CDISKA: cdiska, CDISKP: cdiskp, DDISKA: ddiska, DDISKP: ddiskp, Status: status, Live: live, Died: died }];
                    break;
                case 'DiskReadKBytes/Sec':

                    break;
                case 'DiskWriteKBytes/Sec':

                    break;
                case 'CDiskTotalSize':
                    cdiskt = dataItem.value.toFixed(2);
                    break;
                case 'CDiskAvailablespacetocurrentuser':
                    cdiska = dataItem.value.toFixed(2);
                    $scope.dataset1[temp.cipdno] = [{ No: temp.cipdno, Name: temp.cipdname, Description: temp.cipddescription, CPU: cpu, RAM: ram, CDISKA: cdiska, CDISKP: cdiskp, DDISKA: ddiska, DDISKP: ddiskp, Status: status, Live: live, Died: died }];
                    break;
                case 'DDiskTotalSize':
                    ddiskt = dataItem.value.toFixed(2);
                    break;
                case 'DDiskAvailablespacetocurrentuser':
                    ddiska = dataItem.value.toFixed(2);
                    $scope.dataset1[temp.cipdno] = [{ No: temp.cipdno, Name: temp.cipdname, Description: temp.cipddescription, CPU: cpu, RAM: ram, CDISKA: cdiska, CDISKP: cdiskp, DDISKA: ddiska, DDISKP: ddiskp, Status: status, Live: live, Died: died }];
                    break;
                default:
                    break;
            };

            if (cdiskt != undefined &  cdiskt != '0.00'  ) {

                cdiskp = (cdiska / cdiskt * 100).toFixed(2);
                $scope.dataset1[temp.cipdno] = [{ No: temp.cipdno, Name: temp.cipdname, Description: temp.cipddescription, CPU: cpu, RAM: ram, CDISKA: cdiska, CDISKP: cdiskp, DDISKA: ddiska, DDISKP: ddiskp, Status: status, Live: live, Died: died }];
            }

            if (ddiskt != undefined & ddiskt != '0.00') {

                ddiskp = (ddiska / ddiskt * 100).toFixed(2);
                $scope.dataset1[temp.cipdno] = [{ No: temp.cipdno, Name: temp.cipdname, Description: temp.cipddescription, CPU: cpu, RAM: ram, CDISKA: cdiska, CDISKP: cdiskp, DDISKA: ddiska, DDISKP: ddiskp, Status: status, Live: live, Died: died }];
            }
        });

        // console.log(temp);
        //switch (temp.cipdno) {
        //    case '1':
        //        temp.PerformanceModelList.forEach(function (dataItem) {
        //            switch (dataItem.categoryName) {
        //                case 'Processor':
        //                    $scope.cipd1CPU = dataItem.value;
        //                    $scope.icipd.push();
        //                    break;
        //                case 'Memory':
        //                    $scope.cipd1RAM = dataItem.value;
        //                    break;
        //                case 'Disk Read KBytes/Sec':

        //                    break;
        //                case 'Disk Write KBytes/Sec':

        //                    break;
        //                case 'C Disk Total Size':

        //                    break;
        //                case 'C Disk Available space to current user':
        //                    $scope.cipd1Disk = dataItem.value;
        //                    break;
        //                case 'D Disk Total Size':

        //                    break;
        //                case 'D Disk Available space to current user':

        //                    break;
        //                default:
        //                    break;
        //            };

        //        }); 
        //        break;
        //};

    });

}]);