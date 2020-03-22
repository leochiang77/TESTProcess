app.controller('MainController', ['$scope', '$http',
    function MainController($scope, $http) {
		/* for autocomplete */
		$scope.product = productjson
		
		/* for smarttable */
		
        $scope.rowCollection=[]
		$scope.unit="";
		$scope.total_price=0
		$scope.count=0
		
		//輸入今日已填入賣出資訊
		$scope.todayincome=function(){
			for(var i =0; i<productjson.length;i++){
				if($.inArray( productjson[i].pk, Object.keys(todaysold))>-1){
					/* console.log(productjson[i].pk)
					console.log(todaysold) */
					combine={}
					temptotalprice=productjson[i].fields.price*todaysold[productjson[i].pk]
					combine["name"]=productjson[i].pk
					combine["price"]=temptotalprice
					combine["unit"]=todaysold[productjson[i].pk]
					$scope.rowCollection.push(combine)
					$scope.total_price+=temptotalprice
				}
			}
			
		}
		
		var trigger
		$scope.additem=function(){
			var combine={}
			trigger=true;
			/* combine[$scope.count]=$scope.count */
			combine["name"]=$scope.selectedProduct.originalObject.pk
			combine["price"]=$scope.selectedProduct.originalObject.fields.price*$scope.unit
			combine["unit"]=$scope.unit
			
			for(var i=0; i< $scope.rowCollection.length;i++){
				console.log(Object.values($scope.rowCollection[i])[1])
				if(Object.values($scope.rowCollection[i])[1]==Object.values(combine)[1]){
					trigger=false;	
				}
			}
			if(trigger){
				$scope.total_price +=combine["price"]
				/* self.obj=combine; */
				$scope.rowCollection.push(combine);
				$scope.count+=1
				
				
			}
			
			/* var obj = state;
			
			$scope.skills.push(obj);
			$scope.skill = '';
			$scope.sk = ''; */
		}
		
		$scope.removeItem =function(row){
			console.log(row)
			var index = $scope.rowCollection.indexOf(row);
			if (index > -1) {
				$scope.total_price-= $scope.rowCollection[index].price
				$scope.rowCollection.splice(index, 1);
				$scope.count-=1
			}
		}
		
		/* add item to income table */
		function sleep(ms) {
		  return new Promise(resolve => setTimeout(resolve, ms));
		}
			
		var Today=new Date();
		$scope.changedate=(Today.getFullYear()+ "-" + (Today.getMonth()+1)%12 + "-" + Today.getDate() );
		
		$scope.addIncomeUnits=async function(){
			
			$.ajax({
				url: "/blog/addIncomeUnits/",
				type: "POST",
				/* dataType: "json", */
				data: {
					itemnums:$scope.count,
					incomeCollection:$scope.rowCollection,
					incomeDate:$scope.changedate
					},
				success : function(json) {
					alert("Successfully sent the URL to Django");
				}
				
				});
				/* await sleep(1000);
				location.reload(); */
			}
			
			$scope.rowCollection=[]

    }
]);