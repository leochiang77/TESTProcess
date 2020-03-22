
app.controller('reportCtrl', ['$scope', function ($scope) {
	
    var yearDate;
	var productcost={};
	var productsold;
	var productsoldafter=[];
	var productprofit=[];
	
    //add to the real data holder
    $scope.importincome = function importincome() {
        var Today=new Date();
		/* default為距今1個月的income */
		bmonth_income=(Today.getFullYear()-1)+ "-" + (Today.getMonth()+2) + "-00";
		/* console.log(bmonth_income) */
		
		$.ajax({
			url: "/blog/firstimport_income/",
			type: "POST",
			dataType: "json",
			data: {
				startdate: bmonth_income,
				},
			success : function(data) {
				yearDate=data
				productsold=data[Today.getMonth()+1]
				console.log(productsold)
				
				//本月賣多少個
				for(var i=0; i<productsold.length;i++){
					var productsoldtemp={}
					productsoldtemp["label"]=Object.keys(productsold[i])[0]
					productsoldtemp["value"]=Object.values(productsold[i])[0]
					productsoldafter.push(productsoldtemp)
				}
				console.log(productsoldafter)
				/* 算成本,算月利潤 */
				for(var i=0; i< productmaterial.length ; i++){
					var tempproductname=productmaterial[i].fields.productname
					/* console.log(tempproductname)
					console.log(Object.keys(productcost)) */
					if( $.inArray(tempproductname, Object.keys(productcost)) != -1){
						var tempmaterialname= productmaterial[i].fields.materialname
						var tempmaterialunits=productmaterial[i].fields.quantity
						/* console.log(tempmaterialname) */
						for(var j=0; j< materialjson.length ; j++){
							if(materialjson[j]["pk"]==tempmaterialname){
								var tempmaterialunitscost=materialjson[j].fields.unitcost
								/* console.log(tempmaterialunits)
								console.log(tempmaterialunitscost) */
								productcost[tempproductname]=productcost[tempproductname] + tempmaterialunitscost*tempmaterialunits
							}
						}
				
					}else{
						var tempmaterialname= productmaterial[i].fields.materialname
						var tempmaterialunits=productmaterial[i].fields.quantity
						/* console.log(tempmaterialname) */
						for(var j=0; j< materialjson.length ; j++){
							if(materialjson[j]["pk"]==tempmaterialname){
								var tempmaterialunitscost=materialjson[j].fields.unitcost
								/* console.log(tempmaterialunits)
								console.log(tempmaterialunitscost) */
								productcost[tempproductname]=tempmaterialunitscost*tempmaterialunits
							}
						}
						
					}
					
				}
				//算利潤
				console.log(productcost)
				var productsolddict={}
				for(var i=0; i<productsold.length;i++){
					productsolddict[Object.keys(productsold[i])[0]]=Object.values(productsold[i])[0]
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
				console.log(productprofit)
				piechar();
				barchart();
			}
			
		});
			
		
		
    };
	
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
            values: productsoldafter
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
	
	
	
   
}]);



