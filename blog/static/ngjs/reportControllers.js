
app.controller('reportCtrl', ['$scope', function ($scope) {
	
    var yearDate=[];
	
	var productsold=[];
	var productsoldafter=[];
	var productprofit=[];
	
    //add to the real data holder
    $scope.importincome = function importincome() {
        var Today=new Date();
		/* default為距今1個月的income */
		bmonth_income=(Today.getFullYear()-1)+ "-" + (Today.getMonth()+2)%12 + "-00";
		/* console.log(bmonth_income) */
		
		$.ajax({
			url: "/blog/firstimport_income/",
			type: "POST",
			dataType: "json",
			data: {
				startdate: bmonth_income,
				},
			success : function(data) {
				console.log(data)
				
				
				
				//本月賣多少個
				
				for(var i=0; i<Object.keys(data).length;i++){
					var productsoldtemp={}
					productsoldtemp["label"]=Object.keys(data)[i]
					productsoldtemp["value"]=0
					for(var j=0; j<data[Object.keys(data)[i]].length;j++){
						var tempvalue=data[Object.keys(data)[i]][j]
						
						if((Object.keys(tempvalue)[0])==(Today.getMonth()+1)%12){
							productsoldtemp["value"]=Object.values(tempvalue)[0]
						}
					}
					
					productsold.push(productsoldtemp)
				}
				
				
				//算利潤
				/* console.log(productcost)
				console.log(productsold) */
				var productsolddict={}
				for(var i=0; i<productsold.length;i++){
					productsolddict[productsold[i]['label']]=productsold[i]['value']
				}
				for(var i=0; i< productjson.length ; i++){
					var temp={}
					if(productcost[productjson[i].pk] !=undefined){

						var tempproductsold=productsolddict[productjson[i].pk]
						/* console.log(tempproductsold) */
						if(tempproductsold==undefined){
							tempproductsold=0
						}
						var tempprofit = (productjson[i].fields.price - productcost[productjson[i].pk])*tempproductsold
						temp["key"]=productjson[i].pk
						/* productprofit[productjson[i].pk] = tempprofit */
						temp["y"]=tempprofit
						productprofit.push(temp)
					}
				}
				
				
				//轉成linechart format
				//得到key
				for(var i=0; i<Object.keys(data).length;i++){
					var tempdict={}
					var tempkey=Object.keys(data)[i]
					
					tempdict['key']=tempkey					
					var temparray=[]
					
					for(var m=0 ;m<12 ;m++){
						
						var temp=[]
						tempmonth= m+1                    //(Today.getMonth()+2+m)%12
						if(tempmonth==0){
							tempmonth=12
						}
						temp.push(tempmonth)
						//得到日期
						for(var j=0;j<data[tempkey].length;j++){
							/* console.log(data[tempkey].length) */
							if(Object.keys(data[tempkey][j])[0]==tempmonth){
								
								//得到profit
								for(var k=0; k< productjson.length ; k++){
									
									if(productjson[k].pk==tempkey){
										var tempproductsold=Object.values(data[tempkey][j])[0]
										var tempprofit = (productjson[k].fields.price - productcost[productjson[k].pk])*tempproductsold	
										temp.push(tempprofit)
									}
									
								}
									
							}
							

							
							/* console.log(temp)
							
							console.log(temparray) */
						}
						
						if(temp.length==1){
							temp.push(0)
						}
						temparray.push(temp)
						
					}
					
					
					
					tempdict['values']=temparray
					yearDate.push(tempdict)
				}
				console.log(yearDate)
				piechar();
				barchart();
				linechart()
			}
			
		});
			
		
		
    };
	
	//console.log(productprofit)
	//pie char
	function piechar(){
		var testdata = productprofit
		console.log("ok")
		var height = 300;
		var width = 300;

		nv.addGraph(function() {
			var chart = nv.models.pieChart()
				.x(function(d) { return d.key })
				.y(function(d) { return d.y })
				.width(width)
				.height(height)
				.showLabels(true)
				.showTooltipPercent(true)
				.donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
				.donutRatio(0.35);

			d3.select("#test1")
				.datum(testdata)
				.transition().duration(200)
				.attr('width', width)
				.attr('height', height)
				.call(chart);

			
			return chart;
		});
	
	
	};
	
	
	historicalBarChart = [
        {
            key: "Cumulative Return",
            values: productsold
        }
    ];
	
	function barchart(){
		nv.addGraph(function() {
			var chart = nv.models.discreteBarChart()
				.x(function(d) { return d.label })
				.y(function(d) { return d.value })
				.staggerLabels(true)
				//.staggerLabels(historicalBarChart[0].values.length > 8)
				.showValues(true)
				.duration(250)
				.color([ '#480000','#aec7e8', '#7b94b5', '#486192']);
				;

			d3.select('#chart1')
				.datum(historicalBarChart)
				.call(chart);

			nv.utils.windowResize(chart.update);
			return chart;
		});
	};
	
	
	/* tempdata=[ 
    { 
      "key" : "North America" , 
      "values" : [ [ 1025409600000 , 23.041422681023] , [ 1028088000000 , 19.854291255832] , [ 1030766400000 , 21.02286281168]]
	},
	
	{ 
      "key" : "Antarctica" , 
      "values" : [ [ 1028088000000 , 1.3503144674343] , [ 1025409600000 , 1.2232741112434] , [ 1030766400000 , 1.3930470790784] ]
	}
	]
	console.log(tempdata) */
	
	//line chart
	function linechart(){
		nv.addGraph(function() {
			var chart = nv.models.stackedAreaChart()
			  .margin({right: 100})
			  .x(function(d) { return d[0] })   //We can modify the data accessor functions...
			  .y(function(d) { return d[1] })   //...in case your data is formatted differently.
			  .useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
			  .color(d3.scale.category10().range())
			  .rightAlignYAxis(true)      //Let's move the y-axis to the right side.
			  .duration(300)
			  /* .transitionDuration(500) */
			  .showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
			  .clipEdge(true);

			//Format x-axis labels with custom function.
			chart.xAxis
				.axisLabel('Month')
				.tickFormat(d3.format(',d'));
			

			chart.yAxis
				.tickFormat(d3.format(',.1f'));

			d3.select('#chart2')
			  .datum(yearDate)
			  .call(chart);

			nv.utils.windowResize(chart.update);

			return chart;
	    });
	}
	
	
   
}]);



