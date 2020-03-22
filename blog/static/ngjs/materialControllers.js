/**var app = angular.module('myModule', []);
app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
})**/



app.controller('materialCtrl', ['$scope', function ($scope) {
	
	
	function sleep(ms) {
	  return new Promise(resolve => setTimeout(resolve, ms));
	}
   
	
    $scope.rowCollection = [];

    for (var i=0; i < materialjson.length; i++) {
		var temp=materialjson[i]
		
        $scope.rowCollection.push(temp);
    }

    //add to the real data holder
    $scope.addRandomItem = function addRandomItem() {
        console.log("value")
    };

    //remove to the real data holder
    $scope.removeItem = async function removeItem(row) {
        var index = $scope.rowCollection.indexOf(row);
		var temppk =row.pk
		console.log(temppk);
        
		$.ajax({
			url: "/blog/delete_material/",
			type: "POST",
			dataType: "json",
			data: {
				primarykey: temppk,
				//csrfmiddlewaretoken: getCookie('csrftoken')
				},
			success : function(json) {
				alert("Successfully sent the URL to Django");
			}
			
		});
		await sleep(1000);
		location.reload();
    }
	
	//add_item
	$scope.addItem= async function addItem(){
		
		$.ajax({
			url: "/blog/add_material/",
			type: "POST",
			dataType: "json",
			data: {
				material_name:$scope.material_name ,
				material_unicost:$scope.material_unicost,
				material_updatetime:$scope.material_updatetime,
				//csrfmiddlewaretoken: getCookie('csrftoken')
				},
			success : function(json) {
				alert("Successfully sent the URL to Django");
			}
			
		});
		await sleep(1000);
		location.reload();
	} 
	
	function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
		console.log(cookieValue)
        return cookieValue;
    }
	
    $scope.itemsByPage = 5;
}]);



