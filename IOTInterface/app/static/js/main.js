var amtemperatureData=[];
var dstemperatureData=[];
var amhumidityData=[];

var tempIntervalCount = 11;
var tempInterval = 10
var dsIntervalCount = 11;
var dsInterval = 10
var xAxisTreshold = 1;
var yAxisTreshold = 1;
var zAxisTreshold = 0.05;
var eleGaugeThreshold = [0.6, 0.8]
var isStart=false;

$(document).ready(function() {

    $(function() {
    
        initPage();
        //initphmData();
        //initvibrationData();
    });
});

/*index.html*/
function initPage(){

    refreshData();
}

function refreshData(){
      
    $.ajax({ 
        type:"get",  
        url:"/getRefreshData", 
        dataType:'json',
        success:function(data){
            if(data){
                
                var dataArr = Object.keys(data);
                
                if($.inArray("arduinovibe", dataArr) != -1){

                    tempData = data["arduinovibe"].split('==');
                    refreshChart(tempData, "arduinovibe");
                }
                
                if($.inArray("am2015", dataArr) != -1){
                    
                    if(tempIntervalCount>tempInterval){
                        
                        tempIntervalCount=0;
                        
                        tempData = data["am2015"].split(',');
                        if(tempData.length==3){
                            
                            if(amtemperatureData.length>50){
                                amtemperatureData.shift();
                            }
                            amtemperatureData.push([transCurrDataFormat(new Date()),tempData[1]]);
                            
                            if(amhumidityData.length>50){
                                
                                amhumidityData.shift();
                            }else{
                                
                                amhumidityData.push([transCurrDataFormat(new Date()),tempData[2]]);
                            }
                            
                            refreshChart(tempData[1],"amtemperature");
                            refreshChart(tempData[2],"amhumidity");
                        }
                    }else{
                    
                        tempIntervalCount+=1;
                    }
                }
                
                if($.inArray("ds", dataArr) != -1){
                    
                    if(dsIntervalCount>dsInterval){
                        
                        dsIntervalCount=0;
                        
                        tempData = data["ds"].split(',');
                        if(tempData.length==2){
                            
                            refreshChart(tempData[1],"dstemperature");
                        }
                    }else{
                    
                        dsIntervalCount+=1;
                    }
                }
                
                if($.inArray("current", dataArr) != -1){

                    tempData = data["current"].split(',');
                    if(tempData.length==3){
                        
                        refreshChart(tempData[1],"current");
                        refreshChart(tempData[2],"electricity");
                    }
                }
                
                if(isStart){
                    
                    setTimeout(function(){refreshData()},1000)
                }
            }
        }
    });
}

function refreshChart(objData,objID){
    
    if(objID=="amtemperature"){
        
        buildBaseLineHtml("amtemperature",amtemperatureData,"amtemperatureLine")
        buildHalfGaugeHtml("amtemperature",objData,"amtemperatureGauge",0,60);
    }
    else if(objID=="amhumidity"){
        
        buildBaseLineHtml("amhumidity",amhumidityData,"amhumidityLine")
        buildHalfGaugeHtml("amhumidity",objData,"amhumidityGauge",20,80);
    }
    else if(objID=="dstemperature"){
        
        buildBaseLineHtml("dstemperature",amhumidityData,"dstemperatureLine")
        buildHalfGaugeHtml("dstemperature",objData,"dstemperatureGauge",0,60);
    }
    else if(objID=="current"){
        
        buildProgressHtml(objData,"currentProgress",0,24)
        buildBaseGaugeHtml("current",objData,"currentGauge",0,24);
    }
    else if(objID=="electricity"){
        
        buildProgressHtml(objData,"electricityProgress",0,60)
        buildBaseGaugeHtml("electricity",objData,"electricityGauge",0,60);
    }
    else if(objID=="arduinovibe"){
    
        buildVibrationHtml("arduinovibe",objData,"arduinovibeLine");
    }
}

function buildBaseGaugeHtml(title,data, objID, objmin,objmax){
    
    var myChart = echarts.getInstanceByDom(document.getElementById(objID));
    
    if(myChart==undefined){
        
        var myChart = echarts.init(document.getElementById(objID));
    }
    
	 var option = {
        //backgroundColor: '#343a40',
        tooltip: {
            formatter: '{a} <br/>{c} {b}'
        },
        series: [
            {
                name: title,
                type: 'gauge',
                min: objmin,
                max: objmax,
                splitNumber: 4,
                radius: '95%',
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: [[eleGaugeThreshold[0], 'lime'], [eleGaugeThreshold[1], '#ffff00'], [1, '#ff4500']],
                        width: 10,
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 5
                    }
                },
                axisLabel: {            // 坐标轴小标记
                    fontSize:14,
                    fontWeight: 'bolder',
                    color: '#fff',
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 2
                },
                axisTick: {            // 坐标轴小标记
                    distance: 0,
                    length: 10,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 2
                    }
                },
                splitLine: {           // 分隔线
                    distance: 0,
                    length: 15,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        width: 3,
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 2
                    }
                },
                pointer: {           // 分隔线
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 3
                },
                title: {
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 20,
                        fontStyle: 'italic',
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                detail: {
                    fontSize:30,
                    //backgroundColor: 'rgba(30,144,255,0.8)',
                    //borderWidth: 1,
                    //borderColor: '#fff',
                    //shadowColor: '#fff', //默认透明
                    //shadowBlur: 3,
                    offsetCenter: [0, '40%'],       // x, y，单位px
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        color: '#fff'
                    }
                },
                data: [{value: data, name: ''}]
            }
        ]
	};
	myChart.setOption(option);
}

function buildHalfGaugeHtml(title,data, objID, objmin,objmax){
    
    var myChart = echarts.getInstanceByDom(document.getElementById(objID));
    
    if(myChart==undefined){
        
        var myChart = echarts.init(document.getElementById(objID), 'dark');
    }
    
	 var option = {
        backgroundColor: 'transparent',
        tooltip: {
            formatter: '{a} <br/>{c} {b}'
        },
        series: [
            {
                type: 'gauge',
                center: ['50%', '60%'],
                startAngle: 200,
                endAngle: -20,
                min: objmin,
                max: objmax,
                splitNumber: 6,
                itemStyle: {
                    color: '#FFAB91'
                },
                progress: {
                    show: true,
                    width: 15
                },
                pointer: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        width: 15
                    }
                },
                axisTick: {
                    distance: -20,
                    splitNumber: 10,
                    lineStyle: {
                        width: 2,
                        color: '#999'
                    }
                },
                splitLine: {
                    distance: -32,
                    length: 10,
                    lineStyle: {
                        width: 3,
                        color: '#999'
                    }
                },
                axisLabel: {
                    distance: -10,
                    color: '#999',
                    fontSize: 12
                },
                anchor: {
                    show: false
                },
                title: {
                    show: false
                },
                detail: {
                    valueAnimation: true,
                    width: '60%',
                    lineHeight: 40,
                    borderRadius: 8,
                    offsetCenter: [0, '-15%'],
                    fontSize: 26,
                    fontWeight: 'bolder',
                    formatter: '{value}',
                    color: 'auto'
                },
                data: [
                    {
                      value: data
                    }
                ]
            },
            {
                type: 'gauge',
                center: ['50%', '60%'],
                startAngle: 200,
                endAngle: -20,
                min: objmin,
                max: objmax,
                itemStyle: {
                    color: '#FD7347'
                },
                progress: {
                    show: true,
                    width: 8
                },
                pointer: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                detail: {
                    show: false
                },
                data: [
                    {
                        value: data
                    }
                ]
            }
        ]
	};
	myChart.setOption(option);
}

function buildVibrationLampHtml(xdata, ydata, zdata){

    var xAxisLamp = "greenlamp";
    var yAxisLamp = "greenlamp";
    var zAxisLamp = "greenlamp";
    
    for(let i=0; i<xdata.length ;i++){
        
        if(xdata[i]>xAxisTreshold){
            
            xAxisLamp = "redlamp";
            break
        }
    }
    
    for(let i=0; i<ydata.length ;i++){
        
        if(ydata[i]>yAxisTreshold){
            
            yAxisLamp = "redlamp";
            break
        }
    }
    
    for(let i=0; i<zdata.length ;i++){
        
        if(zdata[i]>zAxisTreshold){
            
            zAxisLamp = "redlamp";
            break
        }
    }
    
    var innerhtml = ""
    innerhtml+="<td><div class='"+xAxisLamp+"' style='float:left;margin:10px;'></div></td>";
    innerhtml+="<td><div class='"+yAxisLamp+"' style='float:left;margin:10px;'></div></td>";
    innerhtml+="<td><div class='"+zAxisLamp+"' style='float:left;margin:10px;'></div></td>";
    
    $("#arduinovibeAxisLamp").html("");
    $("#arduinovibeAxisLamp").html(innerhtml);
}

function buildVibrationHtml(title,data, objID){
    
    var xAxisData = data[0].split(",");
    var yAxisData = data[1].split(",");
    var zAxisData = data[2].split(",");
    buildVibrationLampHtml(xAxisData,yAxisData,zAxisData);
    
    var xAxisArr =[];
    for(let i=1; i<51 ;i++){
        
        xAxisArr.push(i);
    }

    var myChart = echarts.getInstanceByDom(document.getElementById(objID));
    
    if(myChart==undefined){
        
        var myChart = echarts.init(document.getElementById(objID), 'dark');
    }
    
	 var option = {
    	   tooltip: {
            trigger: 'axis'
        },
        backgroundColor:"transparent",
        legend: {
            data: ["xAxis", "yAxis", "zAxis"]
        },
        xAxis: {
            type: 'category',
            axisLabel:{
                color:"white",fontSize:"16px"
            },
            splitLine: {
                show: true
            },
            data: xAxisArr
        },
        yAxis: {
            type: 'value',
            axisLabel:{
                color:"white",fontSize:"16px"
            },
            boundaryGap: [0, '100%'],
            splitLine: {
                show: true
            },
            min:-0.1,
            max:0.1
        },
        series: [
        {
            name: "xAxis",
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: xAxisData
        },
        {
            name: "yAxis",
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: yAxisData
        },
        {
            name: "zAxis",
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: zAxisData
        }
        ]
    };
	myChart.setOption(option);
    
}

function buildBaseLineHtml(title,data, objID){
    
    var myChart = echarts.getInstanceByDom(document.getElementById(objID));
    
    if(myChart==undefined){
        
        var myChart = echarts.init(document.getElementById(objID),"dark");
    }
    var option = {
        backgroundColor:"transparent",
        tooltip: {
            trigger: 'axis',
        },
        grid: {
            top: '15%',
            left: '0%',
            right: '0%',
            bottom: '25%',
            containLabel: true
        },
        xAxis: {
            type: 'time',
            splitLine: {
                show: false
            },
            axisLabel:{
                show: false
            }
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            splitLine: {
                show: false
            },
        },
        series: [{
            name: title,
            type: 'line',
            showSymbol: true,
            itemStyle: {
                color: 'rgb(255, 70, 131)'
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgb(255, 158, 68)'
                }, {
                    offset: 1,
                    color: 'rgb(255, 70, 131)'
                }])
            },
            hoverAnimation: false,
            data: data
        }]
    };
	myChart.setOption(option);
}

function buildProgressHtml(data, objID, objmin,objmax){

    var tempdata = (data-objmin)/(objmax-objmin)*100
    tempdata = Math.round(tempdata * 10) / 10
    var classtype = "bg-success"
    if(tempdata > eleGaugeThreshold[1]*100){
        
        classtype = "bg-danger"
    }else if(tempdata > eleGaugeThreshold[0]*100){
        
        classtype = "bg-warning"
    }
    
    var obj = $("#"+objID);
    var innerhtml = "<div  class='progress-bar progress-bar-striped "+classtype+"' role='progressbar' style='width: "+tempdata+"%' aria-valuenow='"+tempdata+"' aria-valuemin='0' aria-valuemax='100'>"+tempdata+"%</div>"
    
    obj.html("");
    obj.html(innerhtml);
}

function transCurrDataFormat(tempData){

    var date = tempData;
    var aaaa = date.getFullYear();
    var gg = date.getDate();
    var mm = (date.getMonth() + 1);

    if (gg < 10)
        gg = "0" + gg;

    if (mm < 10)
        mm = "0" + mm;

    var cur_day = aaaa + "-" + mm + "-" + gg;

    var hours = date.getHours()
    var minutes = date.getMinutes()
    var seconds = date.getSeconds();

    if (hours < 10)
        hours = "0" + hours;

    if (minutes < 10)
        minutes = "0" + minutes;

    if (seconds < 10)
        seconds = "0" + seconds;

    return cur_day + "T" + hours + ":" + minutes + ":" + seconds;
} 

function start(){

    tempIntervalCount = 11;
    dsIntervalCount = 11;
    isStart=true;
    setTimeout(function(){refreshData()},1000);
}

function stop(){
    
    isStart=false;
}

function clean(){

    vibrationData=[];
    phmData=[];
}