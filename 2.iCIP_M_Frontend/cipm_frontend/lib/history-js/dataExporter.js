var localhostURL = "localhost:56090";
var timezoneOffset=new Date().getTimezoneOffset();
function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp+timezoneOffset*60000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + '-' + month + '-' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

function exportCsvQueryData() {

    var startTimeAbsolute = "";
    var endTimeAbsolute = "";

    var startTimeval = $("#startTime").val();
    var endTimeval = $("#endTime").val();

    var lock = true;

    if (!startTimeval || !endTimeval) {

        var startTimeRelativeValue = $("#startRelativeValue").val();
        var startTimeRelativeUnit = $("#startRelativeUnit").val();

        if (!startTimeRelativeValue || !startTimeRelativeUnit) {

            alert("please enter the time interval !");
            lock = false;
        } else {

            endTimeAbsolute = new Date();
            startTimeAbsolute = new Date();
            if (startTimeRelativeUnit == 'days') {

                startTimeAbsolute.setDate(startTimeAbsolute.getDate() - parseInt(startTimeRelativeValue));
            } else if (startTimeRelativeUnit == 'months') {

                startTimeAbsolute.setMonth(startTimeAbsolute.getMonth() - parseInt(startTimeRelativeValue));
            } else if (startTimeRelativeUnit == 'years') {

                startTimeAbsolute.setFullYear(startTimeAbsolute.getFullYear() - parseInt(startTimeRelativeValue));
            }
        }
    } else {

        startTimeAbsolute = new Date(startTimeval);
        endTimeAbsolute = new Date(endTimeval);
    }

    if (lock) {

        clear();

        var meticNameTotal = "";

        $('.metricContainer').each(function (index, element) {

            var $metricContainer = $(element);
            var metricName = $metricContainer.find('.metricName').combobox("value");
            if (!metricName) {

                showErrorMessage("Metric Name is required.");
                hasError = true;
                return;
            } else {

                if (meticNameTotal) {

                    metricName = ',' + metricName;
                }
                meticNameTotal += metricName;
            }
        });

        var reqData = {

            metricName: meticNameTotal,
            std: startTimeAbsolute.getTime(),
            ed: endTimeAbsolute.getTime()
        };

        var offset = new Date().getTimezoneOffset() * -60000;
        var oBuilder = "Time,Metric Name,Value\n";

        var successCallback = function (data) {

            var data = JSON.parse(data);
            var dataArray = [];
            var dataPointCount = 0;
            for (var item in data) {

                oBuilder = "Time,Metric Name,Value\n";
                window.metricSaveName = item;
                data[item].forEach(function (value) {
                    var timeStamp = timeConverter(value[0]);
                    oBuilder += timeStamp.toString() + "," + metricSaveName.toString() + "," + value[1].toString() + "," + "\n";
                });

                var csvName = metricSaveName.toString() + ".csv";
                var blob = new Blob([oBuilder], { type: "text/csv;charset=utf-8" });
                saveAs(blob, csvName);

                //$('#query-hidden-text').val(JSON.stringify(query, null, 2));
                /* displayQuery(); */
                $('#status').html("");
            }

        };

        $.ajax({
            type: "POST",
            url: 'http://'+localhostURL + '/api/postgressql',
            data: reqData,
            success: successCallback,
            //dataType: "json"
        });

        //$("#saveDropdown").dropdown('hide');
    }
}

function exportJsonQueryData() {
	clear();
		
	var query = buildKairosDBQuery();

	if (query) {
		debugger;

		kairosdb.dataPointsQuery(query, function (resultSet) {

			var blob = new Blob([JSON.stringify(resultSet)], {type: "text/json;charset=utf-8"});
			saveAs(blob, "query_json.txt");
					
			$('#query-hidden-text').val(JSON.stringify(query, null, 2));
			displayQuery();
			$('#status').html("");
			
			

		});
		
	}
	$("#saveDropdown").dropdown('hide');
}