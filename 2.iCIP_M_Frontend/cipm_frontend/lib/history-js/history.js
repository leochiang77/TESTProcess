app.controller('InitPage', function ($scope) {

    $scope.initPage = function () {

        var metricNames = [];

        $(function () {
            if (!window.console) {
                window.console = {
                    log: function () {
                    }
                };
            } // If not console, don't log

            var $startTime = $("#startTime");
            var $endTime = $("#endTime");

            $("#saveButton").button().button("enable");
            $("#submitButtonJSON").button().click(exportJsonQueryData);
            $("#submitButtonCSV").button().click(exportCsvQueryData);
            $("#submitButton").button().click(updateChart);
            //$("#showQueryButton").button().click(showQuery);
            $("#deleteButton").button().click(deleteDataPoints).button("disable");
            $startTime.datetimepicker({
                showTimezone: false,
                showTime: false,
                showMicrosec: false,
                showMillisec: true,
                dateFormat: "yy-mm-dd",
                timeFormat: "hh:mm"
            });
            $endTime.datetimepicker({
                showTimezone: false,
                showTime: false,
                showMicrosec: false,
                showMillisec: true,
                dateFormat: "yy-mm-dd",
                timeFormat: "hh:mm"
            });
            $("#resetZoom").hide();
            $("#errorContainer").hide();
            $("#metricTemplate").hide();
            $("#tagTemplate").hide();
            $("#tabs").tabs({ 'active': 0 });

            $startTime.bind("change paste keyup", function () {
                // clear relative time if absolute time is set
                $("#startRelativeValue").val("");
            });

            $("#startRelativeValue").bind("change paste keyup", function () {
                // clear absolute time if relative time is set
                $startTime.val("");
            });

            $endTime.bind("change paste keyup", function () {
                // clear relative time if absolute time is set
                $("#endRelativeValue").val("");
            });

            $("#endRelativeValue").bind("change paste keyup", function () {
                // clear absolute time if relative time is set
                $endTime.val("");
            });

            $("#cancelTagNameButton").button({
                text: false,
                icons: {
                    primary: 'ui-icon-close'
                }
            }).click(function () {
                $("#groupByTagDialog").dialog("close");
                $("#autocompleteTagName").val(""); // clear value
            });

            $("#addTagNameButton").button({ text: true });

            updateMetricNamesArray();
        });
    }
});

/* app.controller('Tagname', function($scope) {
    $scope.tagname = "標籤";
}); */


 //for calandar   
app.controller('Datepicker1', function ($scope, $timeout) {	
	$scope.today = function () {
        $scope.dt = new Date();
        $scope.dt2 = new Date();
    };
    $scope.today();

    // $scope.clear = function () {
    //   $scope.dt = null;
    //   $scope.dt2 = null;
    // };

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
        //return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function () {
        $scope.minDate = $scope.dt;
    };
    $scope.toggleMin();
    $scope.toggleMax = function () {
        $scope.maxDate = $scope.dt2;
    };
    $scope.toggleMax();

    $scope.open = function () {
        $timeout(function () {
            $scope.opened = true;
        });
    };
    $scope.open2 = function () {
        $timeout(function () {
            $scope.opened2 = true;
        });
    };

    $scope.dateOptions = {
        'year-format': "'yy'",
        //'starting-day': 1
    };

    $scope.formats = ['MM/dd/yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
    $scope.format = $scope.formats[0];

});

app.controller('myDate', function ($scope) {
    $scope.dates = [{date:'years'},
      {date:'months'},
      {date:'days'}
	  ]; 
});
/*'years','months','days'*/

app.controller('myCtrl', function ($scope) {
    $scope.show = true;
    $scope.toggle = function () {
        $scope.show = !$scope.show;
        $scope.hide = !$scope.hide;
		
		if($scope.show){
			
			$("#startRelativeValue").val("");
			$("#endRelativeValue").val("");
			/* $("#changeTime").text("依相對時間查詢"); */
		}else{
			
			$("#startTime").val("");
			$("#endTime").val("");
			/* $("#changeTime").text("依絕對時間查詢"); */
		};
    }
})

var metricCount = -1;

app.controller('UploadCtrl',['$scope',function($scope){
	
	$scope.importData = function (dataJson) {
		var json_text = JSON.stringify(dataJson, null);
		return $.ajax({
			url: '/api/v1/datapoints/',
			type: 'POST',
			dataType: 'json',
			data: dataJson,//{'':json_text},
			success: function (results) {
				//var obj = jQuery.parseJSON(results);
				//return results;
			},
			error: function (x, y, z) {
				if (x.statusText !== 'No Content' && x.statusText.trim() != '') {
					alert(x + '\n' + y + '\n' + z);
				}
			}
		});
	};
	
	$scope.dateString2Date = function (dateString) {
	  var dt  = dateString.split(/\/|\s/);
	  //return new Date(dt.slice(0,3).reverse().join('-') + ' ' + dt[3]);
	  return new Date(dt.slice(0,3).join('-') + ' ' + dt[3]);
	};

	$scope.processFile = function(text) {
		var titleRow = 'tag,time,value';
		var lines = text.split(/[\r\n]+/g); // tolerate both Windows and Unix linebreaks
		if (lines.length > 1) {
			var dateRE = new RegExp(/^\d{4}\/(0[1-9]|1[012])\/([012][1-9]|3[01]) ([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$‌​/); 
			var withError = false;
			var errorMsg = '';
			var totalCount = 0;
			if (lines[0].toLowerCase() !==titleRow) {
				withError = true;
				errorMsg = '1 &rArr; ' + lines[0];
			}
			for (i = 1; i < lines.length; i++) {
				if (lines[i].trim() !== '') {
					totalCount++;
					// check column value
					var parts = lines[i].split(',');
					if (parts[0].trim() === '' || parts[0].trim() === '' || parts[0].trim() === '') {
						errorMsg += (withError ? '<br />' : '') + (i + 1) + ' &rArr; ' + lines[i];
						withError = true;
					} else if (dateRE.test(parts[1])) { // time
						errorMsg += (withError ? '<br />' : '') + (i + 1) + ' &rArr; ' + lines[i];
						withError = true;
					} else if (isNaN(parts[2])) { // value
						errorMsg += (withError ? '<br />' : '') + (i + 1) + ' &rArr; ' + lines[i];
						withError = true;
					}
				}
			}
			var processCount = 0;
			var p1 = lines[1].split(',');
			if (withError) {
				$('#uploadError').show();
				$('#uploadDone').hide();
				$('#displayCsv')[0].innerHTML = errorMsg;
			} else {
				$('#uploadError').hide();
				$('#displayCsv')[0].innerHTML = processCount + ' / ' + totalCount;
				var json = '';
				var cnt = 0;
				for (i = 1; i < lines.length; i++) {
					if (lines[i].trim() !== '') {
						if (cnt == 0) {
						} else if (cnt > 0 && cnt <= 100) {
							json += ',';
						} else {
							$scope.importData('[' + json + ']');
							$('#displayCsv')[0].innerHTML = processCount + '/' + totalCount;
							setTimeout(2000);
							cnt = 0;
							json = '';
						}
						processCount++;
						cnt++;
						var parts = lines[i].split(',');
						var date2 = $scope.dateString2Date(p1[1]).getTime();
						json += '{"name":"' + parts[0] + '","datapoints": [[' + $scope.dateString2Date(parts[1]).getTime() + ', ' + parts[2] + ']],"tags":{"import":"import"}}';
					}
				}
				if (cnt > 0 && json !== '') {
					$scope.importData('[' + json + ']');
					$('#displayCsv')[0].innerHTML = processCount + '/' + totalCount;
				}
				$('#uploadDone').show();
			}
		}
	};
}])
	
app.controller('tabCtrl',['$scope',function($scope){	
    /** holds tabs, we will perform repeat on this **/
    $scope.tabs = [{
        id:1
		
    }]
		
    $scope.counter = 1;
    /** Function to add a new tab **/
    $scope.addTab = function(){
		

		$(".metricContainer").css('display','none');
		
		/* alert(metricCount); */
		$scope.counter++;
		$scope.tabs.push({id:$scope.counter,content:'Any Content'});
		$scope.selectedTab = $scope.tabs.length - 1; //set the newly added tab active. 
		$scope.initaddTab();		 
    }
	
	
    /** Function to delete a tab **/
    $scope.deleteTab = function (index) {
		
        $scope.tabs.splice(index,1); //remove the object from the array based on index
		var removeButton = $('#removeMetric' + index);
        removeButton.data("metricCount", index);
        removeMetric(removeButton);		
        $scope.refreshMetricContainer();
		metricCount -=1;
    }
		
    $scope.selectedTab = 0; //set selected tab to the 1st by default.

    /** Function to set selectedTab **/
    $scope.selectTab = function(index){

        $scope.selectedTab = index;
		$(".metricContainer").css('display','none');
		var temp="#metricContainer"+index;
		$(temp).css('display','block');
			
		var temptab=".metricTab"+index;
		var $tab = $(temptab);
        $(temp).find(".metricName").bind("comboboxselect comboboxchange comboboxfocus", function (event) {

			var metricName = $(this).combobox("value");		
			if (metricName && metricName.length > 0) {
				$tab.text(metricName);
				/*getTagsForMetric(metricName)*/
			}			
		});		
    }
	
    $scope.initaddTab = function () {

		metricCount += 1;
		var $metricContainer = $("#metricTemplate").clone();		
		$metricContainer
			.attr('id', 'metricContainer' + metricCount)
			.addClass("metricContainer")
			.css('display','block')
			.appendTo('#tabet');
		
		// Add text listener to name
		
		
		/**$metricContainer.find(".metricName").bind("comboboxselect comboboxchange comboboxfocus", function (event) {
		var metricName = $(this).combobox("value");
			if (metricName && metricName.length > 0) {
				
				getTagsForMetric(metricName)
			}
			else {
				
			}
		});**/	
		
		addAutocomplete($metricContainer);

        var temp = "#metricContainer" + metricCount;
        var temptab = ".metricTab" + metricCount;
       

        $(temp).find(".metricName").bind("comboboxselect comboboxchange comboboxfocus", function (event) {

            var tempMetricContainerArray = $(this).parents(':nth(4)').attr('id').split('metricContainer');
            if (tempMetricContainerArray.length > 1) {
                var temp = tempMetricContainerArray[1];
                var metricName = $(this).combobox("value");
                if (metricName && metricName.length > 0) {

                    $(".metricTab" +temp).text(metricName);
                }		
            };
		});	
    }

    $scope.refreshMetricContainer = function () {

        var tempMetricContainer = $('#tabet').children('div');
        var count = 0;
        for (var item = 0; item < tempMetricContainer.length; item++) {

            var tempContainer = tempMetricContainer[item];
            if (tempContainer.id.split('metricContainer').length > 1) {

                tempContainer.id = 'metricContainer' + count;
                count++;
            }
        }
        if (count > metricCount) {

            metricCount = count;
        }
    }
}])


//for translate
var translationsEN = {
    HEADLINE: 'Historical Trend Chart',
	abTime: 'absolute time',
	reTime: 'relative time',
	byreab:'relative/absolute',
	wdfrom:'from',
	wdto:'to',
	metric:'Metric',
	name:'Name',
	aggregator:'aggregator',
	graph:'Graph',
	save:'Save',
	uploadCSV:'Import Data by CSV File',
	selectCsvFile:'Select CSV file',
	fileDesc:'First row must be "tag,time,value"\n Each field can not be null\n "time" format must be yyyy/MM/dd HH:mm:ss\n "value" only accepts numeric',
	fileError:'Error : First row must be "tag,time,value"\n Each field can not be null\n "time" format must be yyyy/MM/dd HH:mm:ss\n "value" only accepts numeric',
	fileUploaded:'Data import success !',
    BUTTON_LANG_zhTW: 'Chinese',
    BUTTON_LANG_EN: 'English'
};

var translationszhTW = {
    HEADLINE: '歷史趨勢圖',
	abTime: '絕對時間',
	reTime: '相對時間',
	byreab:'相對時間/絕對時間',
	wdfrom:'從',
	wdto:'到',
	metric:'標籤',
	name:'標籤名稱',
	aggregator:'聚合函數',
	graph:'繪圖',
	save:'下載',
	uploadCSV:'由CSV檔匯入資料',
	selectCsvFile:'選取CSV檔',
	fileDesc:'第一列必須是 "tag,time,value"\n 各欄位不可為空值\n "time" 格式必須是 yyyy/MM/dd HH:mm:ss\n "value" 只接受數值',
	fileError:'錯誤 : 第一列必須是 "tag,time,value"\n 各欄位不可為空值\n "time" 格式必須是 yyyy/MM/dd HH:mm:ss\n "value" 只接受數值',
	fileUploaded:'資料已匯入成功',
    BUTTON_LANG_zhTW: '中文',
    BUTTON_LANG_EN: '英文'
};

var temp = location.search.split("?")[1];　

app.config(['$translateProvider', function ($translateProvider) {
    // add translation tables
    $translateProvider.translations('zh-TW', translationszhTW);
    $translateProvider.translations('en', translationsEN);
	if (temp === undefined) {
		temp = 'en';
	}
    $translateProvider.preferredLanguage(temp);
    /* $translateProvider.fallbackLanguage('en'); */
	$translateProvider.useSanitizeValueStrategy('escape');
}]);

app.controller('testCtrl', ['$translate', '$scope', function ($translate, $scope) {
    $scope.changeLanguage = function (langKey) {
        $translate.use(langKey);
    };
}]);








