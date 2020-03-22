/**var app = angular.module('myModule', []);
app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
})**/
//How to resize jquery ui dialog with browser
//http://stackoverflow.com/questions/9879571/how-to-resize-jquery-ui-dialog-with-browser



app.controller('productCtrl', ['$scope', function ($scope) {
	function sleep(ms) {
	  return new Promise(resolve => setTimeout(resolve, ms));
	}
   
	//get data of table
    $scope.rowCollection = [];
    for (var i=0; i < productjson.length; i++) {
		var temp=productjson[i]
		temp["cost"]=productcost[productjson[i].pk]
        $scope.rowCollection.push(temp);
    }
	/* $scope.output=""
    //add to the real data holder
	var output
    $scope.addRandomItem = function addRandomItem() {
        
		console.log("value")
		$.ajax({
            url:"/blog/ApplyCode/",
            type:"POST",
            data:"567",
            dataType: "json",
            //contentType: "application/json",
            success: function(data){
                $scope.output=data
				output=data
				
            }
        });
		console.log(output);
    }; */

    //remove to the real data holder
    $scope.removeItem = async function removeItem(row) {
        var index = $scope.rowCollection.indexOf(row);
		var temppk =row.pk
		console.log(temppk);
        /* if (index !== -1) {
            $scope.rowCollection.splice(index, 1);
        } */
		$.ajax({
			url: "/blog/delete_product/",
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
	$scope.addNewItem= async function addItem(){
		
		$.ajax({
			url: "/blog/add_product/",
			type: "POST",
			dataType: "json",
			data: {
				materialcount: ($scope.rowCollection_material).length,
				product_name:$scope.product_name ,
				product_price:$scope.product_price,
				ingredient:$scope.rowCollection_material
				//csrfmiddlewaretoken: getCookie('csrftoken')
				},
			success : function(json) {
				alert("Successfully sent the URL to Django");
			}
			
		});
		await sleep(1000);
		location.reload();
	}
	
	var trigger=true
	var temp_rowCollection
	$scope.flex_name="product"
	$scope.flex_item="price"
	$scope.flex_cost="cost"
	//reach product detail
	$scope.item_detail=function item_detail(row){
		//console.log(trigger)
		if(trigger){
			//console.log(row.pk)
			temp_rowCollection=$scope.rowCollection
			$scope.rowCollection=[]
			function ajax(){
				$.ajax({
					url:"/blog/item_detail/",
					type:"POST",
					dataType: "json",
					async: false,
					data:{
						name:row.pk
					},
					
					//contentType: "application/json",
					success: function(data){
						var temp_dict={}
						//console.log(data.length)
						if(data.length==0){
							temp_dict={}
							temp_dict["materialname"]="empty"
							temp_dict["quantity"]="empty"
							$scope.rowCollection.push(temp_dict)
						}else{
							
							for(i=0;i<data.length;i++){
								temp_dict={}
								
								temp_dict["materialname"]=data[i].fields.materialname
								temp_dict["quantity"]=data[i].fields.quantity
								$scope.rowCollection.push(temp_dict)
							} 
							//console.log(data)
						} 
						
							
					}
				});
			}
			
			$.when(ajax()).done(function(){
				$scope.flex_name="material"
				$scope.flex_item="units"
				$scope.flex_cost=""
				trigger=false
			});
			

		}else{
			console.log(row)
			$scope.flex_name="product"
			$scope.flex_item="price"
			$scope.flex_cost="cost"
			$scope.rowCollection=temp_rowCollection
			trigger=true
		}
		
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
	$scope.product_name="";
	$scope.product_price="";
	
	/* productautocomplete */
	$scope.rowCollection_material=[]
	$scope.material=materialjson
	var trigger
	$scope.submit_material=function(){
		
		trigger=true;
		temp_material={}
		temp_material["materialname"]=$scope.selectedMaterial.originalObject.pk
		temp_material["units"]=$scope.units
		for(var i=0; i< $scope.rowCollection_material.length;i++){
			if(Object.values($scope.rowCollection_material[i])[0]==Object.values(temp_material)[0]){
				trigger=false;	
			}
		}
		if(trigger){
			$scope.rowCollection_material.push(temp_material)
		}		
	}
	
	$scope.removematerial =function(row){
		
		var index = $scope.rowCollection_material.indexOf(row);
		if (index > -1) {
			$scope.rowCollection_material.splice(index, 1);
		}
	}
	
}]);

