(function () {
  'use strict';
  angular
      .module('autocp',['ngMaterial', 'ngMessages'])
      .controller('Autocomplete', Autocomplete);

  function Autocomplete ($timeout, $q, $log) {
    var self = this;
	var obj='';
	var todaytext = getdate();
	console.log(todaytext)

    // list of `state` value/display objects
    self.states        = loadAll();
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;

    self.newState = newState;
	self.unit="";
	self.newproduct=[];

    function newState(state) {
      alert("");
    }

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
      var results = query ? self.states.filter( createFilterFor(query) ) : self.states,
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }

    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
		obj=item
		
      $log.info('Item changed to ' + JSON.stringify(item));
	  console.log(obj);
	  
    }

    /**
     * Build `states` list of key/value pairs
     */
    function loadAll() {
		var temp=[];
		
		var allStates = productjson;
		/* console.log(allStates.split(/, +/g)); */

		for(var i=0; i<allStates.length;i++){
			var tempdict={"price":allStates[i].fields.price,"display":allStates[i].pk};
			temp.push(tempdict)
		}

		return temp;
    }

    /**
     * Create filter function for a query string
     */
	  
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };

    }
	
	/* 獲取時間 */
	function getdate(){
		var today=new Date();
		var year = today.getFullYear();
		var month = today.getMonth() + 1;
		var day = today.getDate();
		var todaytext = year +'-'+month+'-'+day;
		return todaytext;
	}
	
	self.total_price=0
	self.count=1
	var trigger
	self.submit=function(){
		var combine={}
		trigger=true;
		combine[self.count]=self.count
		combine["name"]=obj.display
		combine["price"]=parseInt(obj.price)*parseInt(self.unit)
		combine["unit"]=self.unit
		
		for(var i=0; i< self.newproduct.length;i++){
			console.log(Object.values(self.newproduct[i])[1])
			if(Object.values(self.newproduct[i])[1]==Object.values(combine)[1]){
				trigger=false;	
			}
		}
		if(trigger){
			self.total_price +=combine["price"]
			/* self.obj=combine; */
			self.newproduct.push(combine)
			self.rowCollection.push(combine);
			self.count+=1
			
		}
		
		/* var obj = state;
		
		$scope.skills.push(obj);
		$scope.skill = '';
		$scope.sk = ''; */
	}
	
	self.rowCollection = [];
	
	self.removeItem =function(row){
		var index = self.rowCollection.indexOf(row);
		if (index > -1) {
			self.total_price-= self.newproduct[index].price
			self.rowCollection.splice(index, 1);
			self.newproduct.splice(index, 1);
			
		}
	}
	
	
	
	
  }
  
  
})();