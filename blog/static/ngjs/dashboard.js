

var app = angular.module('Dashboard', ['smart-table','ui.bootstrap', 'ui.router', 'ngCookies',"ngTouch", "angucomplete"]);
'use strict';

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
});

/**
 * Route configuration for the Dashboard module.
 */
 
 
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    
	function($stateProvider, $urlRouterProvider,$locationProvider) {
	$locationProvider.html5Mode(false);
    
    // For unmatched routes
    $urlRouterProvider.otherwise('/');

    // Application routes
    $stateProvider
        .state('index', {
            url: '/',
			controller: "MainController",
            templateUrl: '/static/views/main.html'
        })
        .state('product', {
             url: '/product',
			 controller: 'productCtrl',
             templateUrl: '/static/views/product.html'
         })
		.state('product_add', {
             url: '/product_add',
			 controller: 'product_addCtrl',
             templateUrl: '/static/views/product_add.html'
         })
        .state('material', {
            url: '/material', 
			controller: 'materialCtrl',
            templateUrl: '/static/views/material.html'
        })
        .state('report', {
            url: '/report',
			controller: 'reportCtrl',
            templateUrl: '/static/views/report.html'
        })
        
        ;
		
	 // enable html5Mode for pushstate ('#'-less URLs)
    
}]);



/**
 * Master Controller
 */
angular.module('Dashboard')
    .controller('MasterCtrl', ['$rootScope','$scope', '$cookieStore','$modal','$location', MasterCtrl]);

function MasterCtrl($rootScope,$scope, $cookieStore, $modal, $location) {
    /**
     * Sidebar Toggle & Cookie Control
     *
     */

    $scope.loginshow = true;
    $scope.logoutshow = false;

    $scope.tagsInfoShow = false;
    $scope.editShow = false;

    $rootScope.editPageShow = false;
    $rootScope.tagsInfoPageShow = false;
    $rootScope.tagEditPageShow = false;

    $rootScope.serviceControl = false;

    var mobileView = 992;

    $scope.getWidth = function() { return window.innerWidth; };

    $scope.$watch($scope.getWidth, function(newValue, oldValue)
    {
        if(newValue >= mobileView)
        {
            if(angular.isDefined($cookieStore.get('toggle')))
            {
                if($cookieStore.get('toggle') == false)
                {
                    $scope.toggle = false;
                }            
                else
                {
                    $scope.toggle = true;
                }
            }
            else 
            {
                $scope.toggle = true;
            }
        }
        else
        {
            $scope.toggle = false;
        }

    });

    $scope.toggleSidebar = function() 
    {
        $scope.toggle = ! $scope.toggle;

        $cookieStore.put('toggle', $scope.toggle);
    };

    $scope.login = { userInfo: { userName: '', password: '' } };
    $scope.signin = function (size) {
        $scope.destUrl = $location.url();
        $location.url('/Login');

        var modalInstance = $modal.open({
            templateUrl: 'views/Login.html',
            controller: 'LoginCtrl',
            size: size,
            resolve: {
                loginInfo: function () {
                    return $scope.login;
                }
            }
        });

        modalInstance.result.then(function (loginInfo) {
            $scope.login.userInfo.userName = loginInfo.userInfo.userName;
            $scope.login.userInfo.password = loginInfo.userInfo.password;
            if ($scope.login.userInfo.userName != '' && $scope.login.userInfo.password != '') {
                if ($scope.login.userInfo.userName == 'admin' && $scope.login.userInfo.password == '0000') {
                    $rootScope.$broadcast('adminlogin');
                    $scope.UserName = 'Admin';
                    $scope.loginshow = false;
                    $scope.logoutshow = true;

                    $scope.editShow = true;
                    $scope.tagsInfoShow = true;

                    $rootScope.editPageShow = true;
                    $rootScope.tagsInfoPageShow = true;
                    $rootScope.tagEditPageShow = true;

                    $rootScope.serviceControl = true;
                    $location.url($scope.destUrl);
                } else {
                    window.alert('±b¸¹©Î±K½X¿é¤J¿ù»~!!');
                    $location.url('/');
                }

                //$scope.login.authStatus = true;
                //$scope.login.accessDir = "µn¥X";
                //$location.url($scope.destUrl);
            } else {
                window.alert('±b¸¹©Î±K½X¿é¤J¿ù»~!!');
                $location.url('/');
            }
        }, function () {
            $location.url('/');
        });
    };
    $scope.signout = function () {

        $scope.UserName = '';
        $scope.loginshow = true;
        $scope.logoutshow = false;

        $scope.editShow = false;
        $scope.tagsInfoShow = false;

        $rootScope.editPageShow = false;
        $rootScope.tagsInfoPageShow = false;
        $rootScope.tagEditPageShow = false;

        $rootScope.serviceControl = false;
        $location.url($scope.destUrl);
    }
    window.onresize = function() { $scope.$apply(); };
}

/**
 * Alerts Controller
 */
angular.module('Dashboard').controller('AlertsCtrl', ['$scope', AlertsCtrl]);

function AlertsCtrl($scope) {
    $scope.alerts = [
        { type: 'success', msg: 'Thanks for visiting! Feel free to create pull requests to improve the dashboard!' },
        { type: 'danger', msg: 'Found a bug? Create an issue with as many details as you can.' }
    ];

    $scope.addAlert = function() {
        $scope.alerts.push({msg: 'Another alert!'});
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
}
/**
 * Loading Directive
 * @see http://tobiasahlin.com/spinkit/
 */
angular.module('Dashboard').directive('rdLoading', rdLoading);

function rdLoading () {
    var directive = {
        restrict: 'AE',
        template: '<div class="loading"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>'
    };
    return directive;
};

//app.controller('ShowCtrl', ['$rootScope','$scope', function ($rootScope,$scope) {
//    $rootScope.$on('adminlogin', function () {
//        console.log('login');
//        $rootScope.editPageShow = true;
//        $rootScope.tagsInfoPageShow = true;
//        $rootScope.tagEditPageShow = true;
//    })
//}])

