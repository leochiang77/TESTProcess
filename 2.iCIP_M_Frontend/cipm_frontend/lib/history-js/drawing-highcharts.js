function showHighChartsChart(subTitle, yaxis, data) {
	setTimeout(function(){
		drawChart(subTitle, yaxis, data);
	});
}

function drawChart(subTitle, yaxis, data) {
	var chart = {
		chart: {
			renderTo: 'chartContainer',
			type: 'line',
			zoomType: 'xy'
		},
		credits: {
            text: ""
        },
		colors: ["#4572a7", "#aa4643", "#89a54e", "#80699b", "#db843d"],
		title: {
			text: ""
		},
		subtitle: {
			text: subTitle,
			x: -20
		},
		xAxis: {
			type: 'datetime',
            labels: {
                rotation: -45,               
			},
			dateTimeLabelFormats: {
				second: '%H:%M:%S',
				minute: '%e %H:%M',
				hour: '%e %H',
				day: '%e. %b',
				week: '%e %b',
				month: '%b \'%y',
				year: '%Y'
			}
        },
        //time: {
        //    useUTC: false
        //},
		tooltip: {
            formatter: function () {
                var tempX = new Date(this.x).toUTCString().split(' ').slice(0, 5).join(' ');
				return '<b>' + this.series.name + '</b><br/>' +
                    tempX + '  ' + numeral(this.y).format('0.00');
			}
		},
		legend: {
			layout: 'horizontal',
			align: 'center',
			verticalAlign: 'bottom'
		},
		series: data
	};

	var colorIndex = 0;
	$.each(yaxis, function(index, value){

		// set an empty title for each axes
		yaxis[index].title = {
			text: ''
		};

		// Set axis color
		yaxis[index].labels = {
			style: {
				color: chart.colors[colorIndex]
			}
		};

		colorIndex++;
		if (colorIndex >= chart.colors.length)
			colorIndex = 0;
	});

	chart.yAxis = yaxis;
	new Highcharts.Chart(chart);
}

