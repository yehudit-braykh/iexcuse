;(function() {
    'use strict';

    angular.module('app', [
        // Angular Modules
        'ngRoute',
        'ngAnimate',
        'ngSanitize',
        'ngAria',
        'ngMessages',
        'ngMaterial',
        'md.data.table',
        'oc.lazyLoad',
        // custom modules
        'app.ctrls',
        'app.directives',
        'app.services',
        'app.users.ctrls',
        'app.categories.ctrls',
        'app.excuses.ctrls',
        // ui
        'app.ui.ctrls',
        // forms
        'app.forms.ctrls',
        //tables
        'app.tables.ctrls'

    ])

    .constant("appConfig",{
        apiBaseUrl: 'http://iexcuse.local.com/index.php/api/'
    })

    .config(['$compileProvider', '$mdThemingProvider', function($cp, $theme) {
        /** Enable this in production **/
        // $cp.debugInfoEnabled(false);
        // $cp.commentDirectivesEnabled(false);
        // $cp.cssClassDirectivesEnabled(false);
        $theme.theme('default')
            .primaryPalette('blue', {
                'default': 'A700',
                'hue-1': 'A400'
            })
            .accentPalette('pink',{
                'default': 'A400'
            })
            .warnPalette('deep-orange', {
                'default': '500',
            })
            .backgroundPalette('grey', {
                'default': '50',
            });


    }])

    // lazyload modules
    .config(['$ocLazyLoadProvider', function($ocp) {
        $ocp.config({
            debug: false,
            modules: [{
                name: 'flow',
                files: ['public/scripts/lazyload/ng-flow-standalone.min.js']
            },
            {
                name: 'angular-c3',
                files: ['public/scripts/lazyload/c3.directive.js']
            },
            {
				name: "ui.calendar",
				serie: true,	// load files in series
				files: [
                    "public/scripts/lazyload/moment.min.js",
					"public/scripts/lazyload/fullcalendar.min.js",
					"public/styles/lazyload/fullcalendar.min.css",
					"public/scripts/lazyload/calendar.js"
				]
			},
            {
                name: 'angularTrix',
                serie: true,
                files: [    // lazy load in series
                    "public/scripts/lazyload/trix.js",
                    "public/scripts/lazyload/angular-trix.min.js",
                    "public/styles/lazyload/trix.css"
                ]
            }

        ]
        })
    }])

    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

        var routes = [
            'dashboard', 'email/inbox', 'calendar',
            'ui/buttons', 'ui/typography', 'ui/cards', 'ui/grids', 'ui/icons', 'ui/tabs', 'ui/modals', 'ui/progress', 'ui/extras',
            'forms/elements', 'forms/validation', 'forms/uploader',
            'tables',
            'charts/c3', 'charts/sparklines',
            'pages/signin', 'pages/register', 'pages/forget-pass', 'pages/404', 'pages/timeline', 'pages/search', 'pages/invoice',
            'users', 'categories', 'excuses'

        ];

        function setRoutes(route) {
			var url = '/' + route,
				config = {
					templateUrl: "public/views/" + route + ".html"
				};

			$routeProvider.when(url, config);
			return $routeProvider;
		}
        routes.forEach(function(route) {
			setRoutes(route);
		});

        $routeProvider
            .when('/', {redirectTo: '/dashboard'})
            .when('/404', {templateUrl: 'public/views/pages/404.html'})
            .otherwise({redirectTo: '/404'})



        // for lazyload modules
        $routeProvider.when('/dashboard', {
            templateUrl: 'public/views/dashboard.html',
            resolve: {
                deps: ["$ocLazyLoad", '$rootScope', '$timeout', function(a, $rootScope, $timeout) {
					return a.load(['public/scripts/lazyload/jquery.sparkline.min.js'])
					.then(function() {
						return a.load({
							name: "app.directives",
							files: ["public/scripts/lazyload/sparkline.directive.js"]
						})
					})
                    .then(function() {
                        return a.load(["public/scripts/lazyload/d3.min.js", "public/scripts/lazyload/c3.min.js", "public/styles/lazyload/c3.min.css"])
                    })
                    .then(function() {
                        return a.load('angular-c3');
                    })
                    .then(function() {
						$timeout(function() {
							$rootScope.$broadcast("c3.resize");
						}, 100);
					})

				}]
            }
        })

        // email
        $routeProvider.when('/email/inbox', {
            templateUrl: 'public/views/email/inbox.html',
            resolve: {
                deps: ['$ocLazyLoad', function(a) {
                    return a.load(['public/styles/lazyload/email.css', 'public/scripts/lazyload/controllers/emailCtrl.js'])
                    .then(function() {
                        return a.load('angularTrix');
                    })
                }]
            }
        })


        $routeProvider.when("/calendar", {
            templateUrl: "public/views/calendar.html",
            resolve: {
                deps: ["$ocLazyLoad", function(a) {
                    return a.load("ui.calendar")
                    .then(function() {
                        return a.load({
                            name: "app.ctrls",
                            files: ["public/scripts/lazyload/controllers/calendarCtrl.js"]
                        })
                    })
                }]
            }
        })

        $routeProvider.when('/forms/uploader', {
            templateUrl: 'public/views/forms/uploader.html',
            resolve: {
                deps: ['$ocLazyLoad', function($oc) {
                    return $oc.load('flow');
                }]
            }
        })

        // charts - c3
        $routeProvider.when('/charts/c3', {
            templateUrl: 'public/views/charts/c3.html',
            resolve: {
                deps: ["$ocLazyLoad", "$rootScope", "$timeout", function(a, $rootScope, $timeout) {
					return a.load(["public/scripts/lazyload/d3.min.js", "scripts/lazyload/c3.min.js", "styles/lazyload/c3.min.css"])
					.then(function() {
						return a.load("angular-c3");
					})
					.then(function() {
						return a.load({
							name: "app.ctrls",
							files: ["public/scripts/lazyload/controllers/c3ChartCtrl.js"]
						})
					})
					.then(function() {
						$timeout(function() {
							$rootScope.$broadcast("c3.resize");
						}, 100);
					})

				}]
            }
        })

        // charts - sparklines
        $routeProvider.when('/charts/sparklines', {
            templateUrl: 'public/views/charts/sparklines.html',
            resolve: {
                deps: ["$ocLazyLoad", function(a) {
					return a.load(['public/scripts/lazyload/jquery.sparkline.min.js'])
					.then(function() {
						return a.load({
							name: "app.directives",
							files: ["public/scripts/lazyload/sparkline.directive.js"]
						})
					})
				}]
            }
        })
    }])



    // END
}());
;;(function() {
    'use strict';

    angular.module('app.ctrls', [])

    .controller('AppCtrl', ['$scope', '$mdSidenav', '$mdDialog', 'AuthService', 'User', function($scope, $mdSidenav, $mdDialog, AuthService, User) {

        // Open search btn
        $scope.openSearch = function() {
            $scope.isSearchOpen = true;
        };

        $scope.closeSearch = function(){
            $scope.isSearchOpen = false;
        };

        $scope.toggleSidenav = function() {
            $mdSidenav('sidenav-left').toggle();
        }

        $scope.closeDialog = function() {
            $mdDialog.hide();
        }

        $scope.log_out = function() {
            AuthService.logout();
        }

        AuthService.current_user();

        $scope.user = User;

    }])


    .controller('DashboardCtrl', ['$scope', 'AuthService', 'ExcusesService', function($scope, AuthService, ExcusesService) {

        AuthService.user_count().then(function (data){
            $scope.users_count = data;
        });

        ExcusesService.excuses_count().then(function (data){
            $scope.excusesCount = data;
        });

        // === weekly growth
        $scope.weeklygrowthconfig = {
            data: {
    			columns: [
    				['Page Views', 740, 850, 700, 840, 790, 730, 830],
    				['Sessions', 790, 800, 670, 640, 740, 550, 800]
    			],
    			type: 'area-spline',
    		},
    		color: {
    			pattern: ["#40C4FF",  "#448AFF"]
    		},
    		legend: {
    			position: "bottom"
    		},
    		size: {
    			height: 300
    		},
            axis: {
                y: { max: 900, min: 300}

            }
        };

        // === browser sessions
        $scope.browserconfig = {
            data: {
                columns: [
                ["Chrome", 50.9],
                ["Firefox", 16.1],
                ["Safari", 10.9],
                ["IE", 15.1],
                ["Other",7]
                ],
                type: "donut",
            },
            size: {
                width: 320,
                height: 280
            },
            donut: {
                width: 60
            },

            color: {
                pattern: ["#4CAF50", "#8BC34A", "#FFC107", "#CDDC39", "#FF9800"]
            }
        };

        $scope.visitorsageconfig = {
            data: {
                x: 'x',
                y: 'y',
                columns: [
                    ['x', '18-25', '26-35', '36-50', '51-80', '80-above'],
                    ['Male', 29.4, 28, 61, 38, 20],
                    ['Female', 29.6, 60, 23, 49, 34]

                ],


                type: 'bar',
                groups: [
                    ['Male', 'Female']
                ],
            },
            color: {
                pattern: ["#4CAF50", "#CDDC39"]
            },
            axis: {
                x: {
                    type: 'category' // this needed to load string x value
                },
                y: {
                    label: {text: 'Sessions', position: 'outer-middle'}
                }
            }

        }

    }])


})()
;;(function() {
    'use strict';

    angular.module('app.directives', [])

    .directive('highlightSidenav', [function() {
    	return {
    		restrict: 'A',
    		link: function(scope, el, attrs) {
                var lists = el.find('ul.inner-drop').parent('li'), // target li which has sub ul.
                    a = lists.children('a'),
                    listsRest = el.find('ul.nav').children('li'),
                    aRest = listsRest.children('a'),
                    stopClick = 0;


                a.on('click', function(e) {
                    if(e.timeStamp - stopClick > 300) {
                        var self = $(this),
                            selfLi = self.parent('li');
                    	lists.not(selfLi).removeClass('open');
                        selfLi.toggleClass('open');
                        stopClick = e.timeStamp;
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                });

				// slide up nested nav when clicked on aRest
				aRest.on('click', function(e) {
					lists.removeClass('open');
					e.stopPropagation();
					e.stopImmediatePropagation();
				});

    		}
    	}
    }])


    // highlight active nav
    .directive('highlightActive', ['$location', '$rootScope',  function($location, $rs) {
    	return {
    		restrict: 'A',
    		link: function(scope, el, attrs) {
    			var links = el.find('a'),
    				path = function() {return $location.path()},
    				highlightActive = function(links, path) {
    					var path = '#' + path,
                            tmp = path.split('/');
                        $rs.headTitle = tmp[tmp.length -1];
    					angular.forEach(links, function(link) {
    						var link = angular.element(link),
    							li = link.parent('li'),
    							href = link.attr('href');

    						if(li.hasClass('active'))
    							li.removeClass('active');
    						if(path.indexOf(href) == 0)
    							li.addClass('active');
    					})
    				};

    			highlightActive(links, $location.path());
    			scope.$watch(path, function(newVal, oldVal) {
    				if(newVal == oldVal) return;
    				highlightActive(links, $location.path());
    			})
    		}
    	}
    }])

    // custom full page
    .directive("customPage", ["$location",function($location) {
    	return {
    		restrict: "A",
    		link: function(scope, element, attrs) {

    			var path = function() {return $location.path()};
    			var addBg = function(path) {
    				scope.bodyFull = false;
                    console.log(path);
    				switch(path) {
    					case "/404": case "/pages/404" : case "/pages/signin" :
    					case "/pages/register" : case "/pages/forget-pass" :
    					case "/pages/lock-screen":
    						scope.bodyFull = true;
    				}

    			};
    			addBg(path());

    			scope.$watch(path, function(newVal, oldVal) {
    				if(angular.equals(newVal, oldVal)) return;
    				addBg(path());
    			});

    		}
    	}

    }])






}())
;;(function() {
    'use strict';

    angular.module('app.services', [])

    .factory('AuthService', ['$http', '$q', 'User', 'appConfig', function($http, $q, User, appConfig) {
        var scope = {};
        scope.user = {};

        scope.logout = function (){
            $http({method: 'POST', url: appConfig.apiBaseUrl + 'users/session_destroy'}).
            then(function(data, status, header, config) {
                User.destroy();
                window.location.reload();
            })
        }

        scope.current_user = function (){
            var deffered = $q.defer();
            $http({method: 'GET', url: appConfig.apiBaseUrl + 'users/get_current'}).
            then(function(data, status, headers, config) {
                User.set(data.data);
                scope.user = User;
                deffered.resolve(data.data);
            }).
            catch(function(data, status, headers, config) {
                deffered.reject(data);
            });
            return deffered.promise;
        }

        scope.list_users = function (page, limit){
            var deffered = $q.defer();
            $http({method: 'GET', url: appConfig.apiBaseUrl + 'users/all_users?page=' + page + '&limit=' + limit}).
            then(function(data, status, headers, config) {
                deffered.resolve(data.data);
            }).
            catch(function(data, status, headers, config) {
                deffered.reject(data);
            });
            return deffered.promise;
        }

        scope.user_count = function (){
            var deffered = $q.defer();
            $http({method: 'GET', url: appConfig.apiBaseUrl + 'users/users_count'}).
            then(function(data, status, headers, config) {
                deffered.resolve(data.data);
            }).
            catch(function(data, status, headers, config) {
                deffered.reject(data);
            });
            return deffered.promise;
        }

        return scope;

    }])


    .service('User', ['$http', '$q',  function ($http, $q) {

        this.get = function(){
            return this.data;
        }

        this.set = function (user) {
            this.id = user.id;
            this.first_name = user.first_name;
            this.last_name = user.last_name;
            this.email = user.email;
            this.role = user.role;
        }

        this.destroy = function () {
            this.id = null;
            this.first_name = null;
            this.last_name = null;
            this.email = null;
            this.role = null;
        }

        return this.data;

    }])

    .factory('CategoriesService', ['$http', '$q', 'appConfig', function($http, $q, appConfig) {
        var scope = {};
        scope.category = {};

        scope.list_categories = function (){
            var deffered = $q.defer();
            $http({method: 'GET', url: appConfig.apiBaseUrl + 'categories/all_categories'}).
            then(function(data, status, headers, config) {
                deffered.resolve(data.data);
            }).
            catch(function(data, status, headers, config) {
                deffered.reject(data);
            });
            return deffered.promise;
        }

        scope.update_category = function (cat){
            var deffered = $q.defer();
            $http({method: 'POST', url: appConfig.apiBaseUrl + 'categories/update_category', data: cat}).
            then(function(data, status, headers, config) {
                deffered.resolve(data.data);
            }).
            catch(function(data, status, headers, config) {
                deffered.reject(data);
            });
            return deffered.promise;
        }

        scope.create_category = function (cat){
            var deffered = $q.defer();
            $http({method: 'POST', url: appConfig.apiBaseUrl + 'categories/create_category', data: cat}).
            then(function(data, status, headers, config) {
                deffered.resolve(data.data);
            }).
            catch(function(data, status, headers, config) {
                deffered.reject(data);
            });
            return deffered.promise;
        }

        scope.delete_category = function (cat){
            var deffered = $q.defer();
            $http({method: 'POST', url: appConfig.apiBaseUrl + 'categories/delete_category', data: cat}).
            then(function(data, status, headers, config) {
                deffered.resolve(data.data);
            }).
            catch(function(data, status, headers, config) {
                deffered.reject(data);
            });
            return deffered.promise;
        }

        return scope;

    }])

    .factory('ExcusesService', ['$http', '$q', 'appConfig', function($http, $q, appConfig) {
        var scope = {};
        scope.excuse = {};

        scope.list_excuses = function (page, limit){
            var deffered = $q.defer();
            $http({method: 'GET', url: appConfig.apiBaseUrl + 'excuses/all_excuses?page=' + page + '&limit=' + limit}).
            then(function(data, status, headers, config) {
                deffered.resolve(data.data);
            }).
            catch(function(data, status, headers, config) {
                deffered.reject(data);
            });
            return deffered.promise;
        }

        scope.excuses_count = function (){
            var deffered = $q.defer();
            $http({method: 'GET', url: appConfig.apiBaseUrl + 'excuses/excuses_count'}).
            then(function(data, status, headers, config) {
                deffered.resolve(data.data);
            }).
            catch(function(data, status, headers, config) {
                deffered.reject(data);
            });
            return deffered.promise;
        }

        // scope.update_category = function (cat){
        //     var deffered = $q.defer();
        //     $http({method: 'POST', url: appConfig.apiBaseUrl + 'categories/update_category', data: cat}).
        //     then(function(data, status, headers, config) {
        //         deffered.resolve(data.data);
        //     }).
        //     catch(function(data, status, headers, config) {
        //         deffered.reject(data);
        //     });
        //     return deffered.promise;
        // }

        scope.create_excuse = function (excuse){
            var deffered = $q.defer();
            $http({method: 'POST', url: appConfig.apiBaseUrl + 'excuses/create_excuse', data: excuse}).
            then(function(data, status, headers, config) {
                deffered.resolve(data.data);
            }).
            catch(function(data, status, headers, config) {
                deffered.reject(data);
            });
            return deffered.promise;
        }

        // scope.delete_category = function (cat){
        //     var deffered = $q.defer();
        //     $http({method: 'POST', url: appConfig.apiBaseUrl + 'categories/delete_category', data: cat}).
        //     then(function(data, status, headers, config) {
        //         deffered.resolve(data.data);
        //     }).
        //     catch(function(data, status, headers, config) {
        //         deffered.reject(data);
        //     });
        //     return deffered.promise;
        // }

        return scope;

    }])


})()
;;(function() {
    'use strict';

    angular.module('app.ui.ctrls', [])

    .controller('FabSpeedDialCtrl', ['$scope',  function($scope) {

        $scope.directions = ['up', 'down', 'left', 'right'];
        $scope.animations = ['md-fling', 'md-scale'];
        $scope.isOpen = false;
        $scope.selectedDirection = 'up';
        $scope.selectedAnimation = $scope.animations[1];

    }])

    // dialogs
    .controller('ModalsCtrl', ['$scope', '$mdDialog', '$mdBottomSheet', function($scope, $mdDialog, $mdBottomSheet) {
        // alert
        $scope.showAlert = function() {
            $mdDialog.show(
                $mdDialog.alert()
                    .title('You\'ve been hijacked')
                    .clickOutsideToClose(true)
                    .textContent('Simple example of alert dialog')
                    .ok('close')
            )
        };
        // prompt
        $scope.showPrompt = function(ev) {
            var confirm = $mdDialog.prompt()
            .title('What would you name your dog?')
            .textContent('Bowser is a common name.')
            .placeholder('Dog name')
            .ariaLabel('Dog name')
            .initialValue('Buddy')
            .targetEvent(ev)
            .ok('Okay!')
            .cancel('I\'m a cat person');

            $mdDialog.show(confirm).then(function(result) {
                $scope.promptstatus = 'You decided to name your dog ' + result + '.';
            }, function() {
                $scope.promptstatus = 'You didn\'t name your dog.';
            });
        };


        // custom dialog
        $scope.showCustom = function(ev) {
            $mdDialog.show({
                targetEvent: ev,
                parent: angular.element(document.querySelector('#degree-app')),
                clickOutsideToClose: true,
                fullscreen: false,
                template: '<md-dialog>' +
                '<md-dialog-content>' +
                '<div class="md-dialog-content">' +
                     '<h2>Using custom dialog markup with template element</h2>' +
                     '<p>The mango is a juicy stone fruit belonging to the genus Mangifera, consisting of numerous tropical fruiting trees, cultivated mostly for edible fruit. The majority of these species are found in nature as wild mangoes. They all belong to the flowering plant family Anacardiaceae. The mango is native to South and Southeast Asia, from where it has been distributed worldwide to become one of the most cultivated fruits in the tropics.</p>' +
                '  </md-dialog-content>' +
                '</md-dialog>',
            });
        };


        // Bottom Sheet
        $scope.showListBottomSheet = function() {
            $mdBottomSheet.show({
                  templateUrl: 'bottomSheetList.html',
                  controller: 'ModalsCtrl',
                  parent: document.querySelector('.main-content')
              });
        };

        $scope.bottomListItems = [
            { name: 'Facebook', icon: 'ion-logo-facebook' },
            { name: 'Github', icon: 'ion-logo-github' },
            { name: 'Twitter', icon: 'ion-logo-twitter' },
            { name: 'Google+', icon: 'ion-logo-googleplus' },
        ];

        $scope.listItemClick = function($index) {
            var clickedItem = $scope.items[$index];
            $mdBottomSheet.hide(clickedItem);
        };
    }])


    // Grid List Demo
    .controller('GridListDemo', ["$scope", function($scope) {
        var COLORS = [
            '#ffebee', '#ffcdd2', '#ef9a9a', '#e57373', '#ef5350', '#f44336', '#e53935', '#d32f2f', '#c62828', '#b71c1c',
            '#ff8a80', '#ff5252', '#ff1744', '#d50000', '#f8bbd0', '#f48fb1', '#f06292', '#ec407a', '#e91e63', '#d81b60',
            '#c2185b', '#ad1457', '#880e4f', '#ff80ab', '#ff4081', '#f50057', '#c51162', '#e1bee7', '#ce93d8', '#ba68c8',
            '#ab47bc', '#9c27b0', '#8e24aa', '#7b1fa2', '#4a148c', '#ea80fc', '#e040fb'

        ];

        $scope.colorTiles = (function() {
            var tiles = [];
            for (var i = 0; i < 22; i++) {
                tiles.push({
                    color: randomColor(),
                    colspan: randomSpan(),
                    rowspan: randomSpan()
                });
            }
            return tiles;
        })();

        function randomColor() {
            return COLORS[Math.floor(Math.random() * COLORS.length)];
        }

        function randomSpan() {
            var r = Math.random();
            if (r < 0.8) {
                return 1;
            } else if (r < 0.9) {
                return 2;
            } else {
                return 3;
            }
        }

    }])


    // Icons demo ctrl
    .controller('IconsDemoCtrl', ['$scope', '$filter', function($scope, $filter) {
        $scope.icons = [
            'ion-ios-add',  'ion-ios-add-circle',  'ion-ios-add-circle-outline',  'ion-ios-add-outline',  'ion-ios-alarm',  'ion-ios-alarm-outline',  'ion-ios-albums',  'ion-ios-albums-outline',  'ion-ios-alert',  'ion-ios-alert-outline',  'ion-ios-american-football',  'ion-ios-american-football-outline',  'ion-ios-analytics',  'ion-ios-analytics-outline',  'ion-ios-aperture',  'ion-ios-aperture-outline',  'ion-ios-apps',  'ion-ios-apps-outline',  'ion-ios-appstore',  'ion-ios-appstore-outline',  'ion-ios-archive',  'ion-ios-archive-outline',  'ion-ios-arrow-back',  'ion-ios-arrow-back-outline',  'ion-ios-arrow-down',  'ion-ios-arrow-down-outline',  'ion-ios-arrow-dropdown',  'ion-ios-arrow-dropdown-circle',  'ion-ios-arrow-dropdown-circle-outline',  'ion-ios-arrow-dropdown-outline',  'ion-ios-arrow-dropleft',  'ion-ios-arrow-dropleft-circle',  'ion-ios-arrow-dropleft-circle-outline',  'ion-ios-arrow-dropleft-outline',  'ion-ios-arrow-dropright',  'ion-ios-arrow-dropright-circle',  'ion-ios-arrow-dropright-circle-outline',  'ion-ios-arrow-dropright-outline',  'ion-ios-arrow-dropup',  'ion-ios-arrow-dropup-circle',  'ion-ios-arrow-dropup-circle-outline',  'ion-ios-arrow-dropup-outline',  'ion-ios-arrow-forward',  'ion-ios-arrow-forward-outline',  'ion-ios-arrow-round-back',  'ion-ios-arrow-round-back-outline',  'ion-ios-arrow-round-down',  'ion-ios-arrow-round-down-outline',  'ion-ios-arrow-round-forward',  'ion-ios-arrow-round-forward-outline',  'ion-ios-arrow-round-up',  'ion-ios-arrow-round-up-outline',  'ion-ios-arrow-up',  'ion-ios-arrow-up-outline',  'ion-ios-at',  'ion-ios-at-outline',  'ion-ios-attach',  'ion-ios-attach-outline',  'ion-ios-backspace',  'ion-ios-backspace-outline',  'ion-ios-barcode',  'ion-ios-barcode-outline',  'ion-ios-baseball',  'ion-ios-baseball-outline',  'ion-ios-basket',  'ion-ios-basket-outline',  'ion-ios-basketball',  'ion-ios-basketball-outline',  'ion-ios-battery-charging',  'ion-ios-battery-charging-outline',  'ion-ios-battery-dead',  'ion-ios-battery-dead-outline',  'ion-ios-battery-full',  'ion-ios-battery-full-outline',  'ion-ios-beaker',  'ion-ios-beaker-outline',  'ion-ios-beer',  'ion-ios-beer-outline',  'ion-ios-bicycle',  'ion-ios-bicycle-outline',  'ion-ios-bluetooth',  'ion-ios-bluetooth-outline',  'ion-ios-boat',  'ion-ios-boat-outline',  'ion-ios-body',  'ion-ios-body-outline',  'ion-ios-bonfire',  'ion-ios-bonfire-outline',  'ion-ios-book',  'ion-ios-book-outline',  'ion-ios-bookmark',  'ion-ios-bookmark-outline',  'ion-ios-bookmarks',  'ion-ios-bookmarks-outline',  'ion-ios-bowtie',  'ion-ios-bowtie-outline',  'ion-ios-briefcase',  'ion-ios-briefcase-outline',  'ion-ios-browsers',  'ion-ios-browsers-outline',  'ion-ios-brush',  'ion-ios-brush-outline',  'ion-ios-bug',  'ion-ios-bug-outline',  'ion-ios-build',  'ion-ios-build-outline',  'ion-ios-bulb',  'ion-ios-bulb-outline',  'ion-ios-bus',  'ion-ios-bus-outline',  'ion-ios-cafe',  'ion-ios-cafe-outline',  'ion-ios-calculator',  'ion-ios-calculator-outline',  'ion-ios-calendar',  'ion-ios-calendar-outline',  'ion-ios-call',  'ion-ios-call-outline',  'ion-ios-camera',  'ion-ios-camera-outline',  'ion-ios-car',  'ion-ios-car-outline',  'ion-ios-card',  'ion-ios-card-outline',  'ion-ios-cart',  'ion-ios-cart-outline',  'ion-ios-cash',  'ion-ios-cash-outline',  'ion-ios-chatboxes',  'ion-ios-chatboxes-outline',  'ion-ios-chatbubbles',  'ion-ios-chatbubbles-outline',  'ion-ios-checkbox',  'ion-ios-checkbox-outline',  'ion-ios-checkmark',  'ion-ios-checkmark-circle',  'ion-ios-checkmark-circle-outline',  'ion-ios-checkmark-outline',  'ion-ios-clipboard',  'ion-ios-clipboard-outline',  'ion-ios-clock',  'ion-ios-clock-outline',  'ion-ios-close',  'ion-ios-close-circle',  'ion-ios-close-circle-outline',  'ion-ios-close-outline',  'ion-ios-closed-captioning',  'ion-ios-closed-captioning-outline',  'ion-ios-cloud',  'ion-ios-cloud-circle',  'ion-ios-cloud-circle-outline',  'ion-ios-cloud-done',  'ion-ios-cloud-done-outline',  'ion-ios-cloud-download',  'ion-ios-cloud-download-outline',  'ion-ios-cloud-outline',  'ion-ios-cloud-upload',  'ion-ios-cloud-upload-outline',  'ion-ios-cloudy',  'ion-ios-cloudy-night',  'ion-ios-cloudy-night-outline',  'ion-ios-cloudy-outline',  'ion-ios-code',  'ion-ios-code-download',  'ion-ios-code-download-outline',  'ion-ios-code-outline',  'ion-ios-code-working',  'ion-ios-code-working-outline',  'ion-ios-cog',  'ion-ios-cog-outline',  'ion-ios-color-fill',  'ion-ios-color-fill-outline',  'ion-ios-color-filter',  'ion-ios-color-filter-outline',  'ion-ios-color-palette',  'ion-ios-color-palette-outline',  'ion-ios-color-wand',  'ion-ios-color-wand-outline',  'ion-ios-compass',  'ion-ios-compass-outline',  'ion-ios-construct',  'ion-ios-construct-outline',  'ion-ios-contact',  'ion-ios-contact-outline',  'ion-ios-contacts',  'ion-ios-contacts-outline',  'ion-ios-contract',  'ion-ios-contract-outline',  'ion-ios-contrast',  'ion-ios-contrast-outline',  'ion-ios-copy',  'ion-ios-copy-outline',  'ion-ios-create',  'ion-ios-create-outline',  'ion-ios-crop',  'ion-ios-crop-outline',  'ion-ios-cube',  'ion-ios-cube-outline',  'ion-ios-cut',  'ion-ios-cut-outline',  'ion-ios-desktop',  'ion-ios-desktop-outline',  'ion-ios-disc',  'ion-ios-disc-outline',  'ion-ios-document',  'ion-ios-document-outline',  'ion-ios-done-all',  'ion-ios-done-all-outline',  'ion-ios-download',  'ion-ios-download-outline',  'ion-ios-easel',  'ion-ios-easel-outline',  'ion-ios-egg',  'ion-ios-egg-outline',  'ion-ios-exit',  'ion-ios-exit-outline',  'ion-ios-expand',  'ion-ios-expand-outline',  'ion-ios-eye',  'ion-ios-eye-off',  'ion-ios-eye-off-outline',  'ion-ios-eye-outline',  'ion-ios-fastforward',  'ion-ios-fastforward-outline',  'ion-ios-female',  'ion-ios-female-outline',  'ion-ios-filing',  'ion-ios-filing-outline',  'ion-ios-film',  'ion-ios-film-outline',  'ion-ios-finger-print',  'ion-ios-finger-print-outline',  'ion-ios-flag',  'ion-ios-flag-outline',  'ion-ios-flame',  'ion-ios-flame-outline',  'ion-ios-flash',  'ion-ios-flash-outline',  'ion-ios-flask',  'ion-ios-flask-outline',  'ion-ios-flower',  'ion-ios-flower-outline',  'ion-ios-folder',  'ion-ios-folder-open',  'ion-ios-folder-open-outline',  'ion-ios-folder-outline',  'ion-ios-football',  'ion-ios-football-outline',  'ion-ios-funnel',  'ion-ios-funnel-outline',  'ion-ios-game-controller-a',  'ion-ios-game-controller-a-outline',  'ion-ios-game-controller-b',  'ion-ios-game-controller-b-outline',  'ion-ios-git-branch',  'ion-ios-git-branch-outline',  'ion-ios-git-commit',  'ion-ios-git-commit-outline',  'ion-ios-git-compare',  'ion-ios-git-compare-outline',  'ion-ios-git-merge',  'ion-ios-git-merge-outline',  'ion-ios-git-network',  'ion-ios-git-network-outline',  'ion-ios-git-pull-request',  'ion-ios-git-pull-request-outline',  'ion-ios-glasses',  'ion-ios-glasses-outline',  'ion-ios-globe',  'ion-ios-globe-outline',  'ion-ios-grid',  'ion-ios-grid-outline',  'ion-ios-hammer',  'ion-ios-hammer-outline',  'ion-ios-hand',  'ion-ios-hand-outline',  'ion-ios-happy',  'ion-ios-happy-outline',  'ion-ios-headset',  'ion-ios-headset-outline',  'ion-ios-heart',  'ion-ios-heart-outline',  'ion-ios-help',  'ion-ios-help-buoy',  'ion-ios-help-buoy-outline',  'ion-ios-help-circle',  'ion-ios-help-circle-outline',  'ion-ios-help-outline',  'ion-ios-home',  'ion-ios-home-outline',  'ion-ios-ice-cream',  'ion-ios-ice-cream-outline',  'ion-ios-image',  'ion-ios-image-outline',  'ion-ios-images',  'ion-ios-images-outline',  'ion-ios-infinite',  'ion-ios-infinite-outline',  'ion-ios-information',  'ion-ios-information-circle',  'ion-ios-information-circle-outline',  'ion-ios-information-outline',  'ion-ios-ionic',  'ion-ios-ionic-outline',  'ion-ios-ionitron',  'ion-ios-ionitron-outline',  'ion-ios-jet',  'ion-ios-jet-outline',  'ion-ios-key',  'ion-ios-key-outline',  'ion-ios-keypad',  'ion-ios-keypad-outline',  'ion-ios-laptop',  'ion-ios-laptop-outline',  'ion-ios-leaf',  'ion-ios-leaf-outline',  'ion-ios-link',  'ion-ios-link-outline',  'ion-ios-list',  'ion-ios-list-box',  'ion-ios-list-box-outline',  'ion-ios-list-outline',  'ion-ios-locate',  'ion-ios-locate-outline',  'ion-ios-lock',  'ion-ios-lock-outline',  'ion-ios-log-in',  'ion-ios-log-in-outline',  'ion-ios-log-out',  'ion-ios-log-out-outline',  'ion-ios-magnet',  'ion-ios-magnet-outline',  'ion-ios-mail',  'ion-ios-mail-open',  'ion-ios-mail-open-outline',  'ion-ios-mail-outline',  'ion-ios-male',  'ion-ios-male-outline',  'ion-ios-man',  'ion-ios-man-outline',  'ion-ios-map',  'ion-ios-map-outline',  'ion-ios-medal',  'ion-ios-medal-outline',  'ion-ios-medical',  'ion-ios-medical-outline',  'ion-ios-medkit',  'ion-ios-medkit-outline',  'ion-ios-megaphone',  'ion-ios-megaphone-outline',  'ion-ios-menu',  'ion-ios-menu-outline',  'ion-ios-mic',  'ion-ios-mic-off',  'ion-ios-mic-off-outline',  'ion-ios-mic-outline',  'ion-ios-microphone',  'ion-ios-microphone-outline',  'ion-ios-moon',  'ion-ios-moon-outline',  'ion-ios-more',  'ion-ios-more-outline',  'ion-ios-move',  'ion-ios-move-outline',  'ion-ios-musical-note',  'ion-ios-musical-note-outline',  'ion-ios-musical-notes',  'ion-ios-musical-notes-outline',  'ion-ios-navigate',  'ion-ios-navigate-outline',  'ion-ios-no-smoking',  'ion-ios-no-smoking-outline',  'ion-ios-notifications',  'ion-ios-notifications-off',  'ion-ios-notifications-off-outline',  'ion-ios-notifications-outline',  'ion-ios-nuclear',  'ion-ios-nuclear-outline',  'ion-ios-nutrition',  'ion-ios-nutrition-outline',  'ion-ios-open',  'ion-ios-open-outline',  'ion-ios-options',  'ion-ios-options-outline',  'ion-ios-outlet',  'ion-ios-outlet-outline',  'ion-ios-paper',  'ion-ios-paper-outline',  'ion-ios-paper-plane',  'ion-ios-paper-plane-outline',  'ion-ios-partly-sunny',  'ion-ios-partly-sunny-outline',  'ion-ios-pause',  'ion-ios-pause-outline',  'ion-ios-paw',  'ion-ios-paw-outline',  'ion-ios-people',  'ion-ios-people-outline',  'ion-ios-person',  'ion-ios-person-add',  'ion-ios-person-add-outline',  'ion-ios-person-outline',  'ion-ios-phone-landscape',  'ion-ios-phone-landscape-outline',  'ion-ios-phone-portrait',  'ion-ios-phone-portrait-outline',  'ion-ios-photos',  'ion-ios-photos-outline',  'ion-ios-pie',  'ion-ios-pie-outline',  'ion-ios-pin',  'ion-ios-pin-outline',  'ion-ios-pint',  'ion-ios-pint-outline',  'ion-ios-pizza',  'ion-ios-pizza-outline',  'ion-ios-plane',  'ion-ios-plane-outline',  'ion-ios-planet',  'ion-ios-planet-outline',  'ion-ios-play',  'ion-ios-play-outline',  'ion-ios-podium',  'ion-ios-podium-outline',  'ion-ios-power',  'ion-ios-power-outline',  'ion-ios-pricetag',  'ion-ios-pricetag-outline',  'ion-ios-pricetags',  'ion-ios-pricetags-outline',  'ion-ios-print',  'ion-ios-print-outline',  'ion-ios-pulse',  'ion-ios-pulse-outline',  'ion-ios-qr-scanner',  'ion-ios-qr-scanner-outline',  'ion-ios-quote',  'ion-ios-quote-outline',  'ion-ios-radio',  'ion-ios-radio-button-off',  'ion-ios-radio-button-off-outline',  'ion-ios-radio-button-on',  'ion-ios-radio-button-on-outline',  'ion-ios-radio-outline',  'ion-ios-rainy',  'ion-ios-rainy-outline',  'ion-ios-recording',  'ion-ios-recording-outline',  'ion-ios-redo',  'ion-ios-redo-outline',  'ion-ios-refresh',  'ion-ios-refresh-circle',  'ion-ios-refresh-circle-outline',  'ion-ios-refresh-outline',  'ion-ios-remove',  'ion-ios-remove-circle',  'ion-ios-remove-circle-outline',  'ion-ios-remove-outline',  'ion-ios-reorder',  'ion-ios-reorder-outline',  'ion-ios-repeat',  'ion-ios-repeat-outline',  'ion-ios-resize',  'ion-ios-resize-outline',  'ion-ios-restaurant',  'ion-ios-restaurant-outline',  'ion-ios-return-left',  'ion-ios-return-left-outline',  'ion-ios-return-right',  'ion-ios-return-right-outline',  'ion-ios-reverse-camera',  'ion-ios-reverse-camera-outline',  'ion-ios-rewind',  'ion-ios-rewind-outline',  'ion-ios-ribbon',  'ion-ios-ribbon-outline',  'ion-ios-rose',  'ion-ios-rose-outline',  'ion-ios-sad',  'ion-ios-sad-outline',  'ion-ios-school',  'ion-ios-school-outline',  'ion-ios-search',  'ion-ios-search-outline',  'ion-ios-send',  'ion-ios-send-outline',  'ion-ios-settings',  'ion-ios-settings-outline',  'ion-ios-share',  'ion-ios-share-alt',  'ion-ios-share-alt-outline',  'ion-ios-share-outline',  'ion-ios-shirt',  'ion-ios-shirt-outline',  'ion-ios-shuffle',  'ion-ios-shuffle-outline',  'ion-ios-skip-backward',  'ion-ios-skip-backward-outline',  'ion-ios-skip-forward',  'ion-ios-skip-forward-outline',  'ion-ios-snow',  'ion-ios-snow-outline',  'ion-ios-speedometer',  'ion-ios-speedometer-outline',  'ion-ios-square',  'ion-ios-square-outline',  'ion-ios-star',  'ion-ios-star-half',  'ion-ios-star-half-outline',  'ion-ios-star-outline',  'ion-ios-stats',  'ion-ios-stats-outline',  'ion-ios-stopwatch',  'ion-ios-stopwatch-outline',  'ion-ios-subway',  'ion-ios-subway-outline',  'ion-ios-sunny',  'ion-ios-sunny-outline',  'ion-ios-swap',  'ion-ios-swap-outline',  'ion-ios-switch',  'ion-ios-switch-outline',  'ion-ios-sync',  'ion-ios-sync-outline',  'ion-ios-tablet-landscape',  'ion-ios-tablet-landscape-outline',  'ion-ios-tablet-portrait',  'ion-ios-tablet-portrait-outline',  'ion-ios-tennisball',  'ion-ios-tennisball-outline',  'ion-ios-text',  'ion-ios-text-outline',  'ion-ios-thermometer',  'ion-ios-thermometer-outline',  'ion-ios-thumbs-down',  'ion-ios-thumbs-down-outline',  'ion-ios-thumbs-up',  'ion-ios-thumbs-up-outline',  'ion-ios-thunderstorm',  'ion-ios-thunderstorm-outline',  'ion-ios-time',  'ion-ios-time-outline',  'ion-ios-timer',  'ion-ios-timer-outline',  'ion-ios-train',  'ion-ios-train-outline',  'ion-ios-transgender',  'ion-ios-transgender-outline',  'ion-ios-trash',  'ion-ios-trash-outline',  'ion-ios-trending-down',  'ion-ios-trending-down-outline',  'ion-ios-trending-up',  'ion-ios-trending-up-outline',  'ion-ios-trophy',  'ion-ios-trophy-outline',  'ion-ios-umbrella',  'ion-ios-umbrella-outline',  'ion-ios-undo',  'ion-ios-undo-outline',  'ion-ios-unlock',  'ion-ios-unlock-outline',  'ion-ios-videocam',  'ion-ios-videocam-outline',  'ion-ios-volume-down',  'ion-ios-volume-down-outline',  'ion-ios-volume-mute',  'ion-ios-volume-mute-outline',  'ion-ios-volume-off',  'ion-ios-volume-off-outline',  'ion-ios-volume-up',  'ion-ios-volume-up-outline',  'ion-ios-walk',  'ion-ios-walk-outline',  'ion-ios-warning',  'ion-ios-warning-outline',  'ion-ios-watch',  'ion-ios-watch-outline',  'ion-ios-water',  'ion-ios-water-outline',  'ion-ios-wifi',  'ion-ios-wifi-outline',  'ion-ios-wine',  'ion-ios-wine-outline',  'ion-ios-woman',  'ion-ios-woman-outline',  'ion-logo-android',  'ion-logo-angular',  'ion-logo-apple',  'ion-logo-bitcoin',  'ion-logo-buffer',  'ion-logo-chrome',  'ion-logo-codepen',  'ion-logo-css3',  'ion-logo-designernews',  'ion-logo-dribbble',  'ion-logo-dropbox',  'ion-logo-euro',  'ion-logo-facebook',  'ion-logo-foursquare',  'ion-logo-freebsd-devil',  'ion-logo-github',  'ion-logo-google',  'ion-logo-googleplus',  'ion-logo-hackernews',  'ion-logo-html5',  'ion-logo-instagram',  'ion-logo-javascript',  'ion-logo-linkedin',  'ion-logo-markdown',  'ion-logo-nodejs',  'ion-logo-octocat',  'ion-logo-pinterest',  'ion-logo-playstation',  'ion-logo-python',  'ion-logo-reddit',  'ion-logo-rss',  'ion-logo-sass',  'ion-logo-skype',  'ion-logo-snapchat',  'ion-logo-steam',  'ion-logo-tumblr',  'ion-logo-tux',  'ion-logo-twitch',  'ion-logo-twitter',  'ion-logo-usd',  'ion-logo-vimeo',  'ion-logo-whatsapp',  'ion-logo-windows',  'ion-logo-wordpress',  'ion-logo-xbox',  'ion-logo-yahoo',  'ion-logo-yen',  'ion-logo-youtube',  'ion-md-add',  'ion-md-add-circle',  'ion-md-alarm',  'ion-md-albums',  'ion-md-alert',  'ion-md-american-football',  'ion-md-analytics',  'ion-md-aperture',  'ion-md-apps',  'ion-md-appstore',  'ion-md-archive',  'ion-md-arrow-back',  'ion-md-arrow-down',  'ion-md-arrow-dropdown',  'ion-md-arrow-dropdown-circle',  'ion-md-arrow-dropleft',  'ion-md-arrow-dropleft-circle',  'ion-md-arrow-dropright',  'ion-md-arrow-dropright-circle',  'ion-md-arrow-dropup',  'ion-md-arrow-dropup-circle',  'ion-md-arrow-forward',  'ion-md-arrow-round-back',  'ion-md-arrow-round-down',  'ion-md-arrow-round-forward',  'ion-md-arrow-round-up',  'ion-md-arrow-up',  'ion-md-at',  'ion-md-attach',  'ion-md-backspace',  'ion-md-barcode',  'ion-md-baseball',  'ion-md-basket',  'ion-md-basketball',  'ion-md-battery-charging',  'ion-md-battery-dead',  'ion-md-battery-full',  'ion-md-beaker',  'ion-md-beer',  'ion-md-bicycle',  'ion-md-bluetooth',  'ion-md-boat',  'ion-md-body',  'ion-md-bonfire',  'ion-md-book',  'ion-md-bookmark',  'ion-md-bookmarks',  'ion-md-bowtie',  'ion-md-briefcase',  'ion-md-browsers',  'ion-md-brush',  'ion-md-bug',  'ion-md-build',  'ion-md-bulb',  'ion-md-bus',  'ion-md-cafe',  'ion-md-calculator',  'ion-md-calendar',  'ion-md-call',  'ion-md-camera',  'ion-md-car',  'ion-md-card',  'ion-md-cart',  'ion-md-cash',  'ion-md-chatboxes',  'ion-md-chatbubbles',  'ion-md-checkbox',  'ion-md-checkbox-outline',  'ion-md-checkmark',  'ion-md-checkmark-circle',  'ion-md-checkmark-circle-outline',  'ion-md-clipboard',  'ion-md-clock',  'ion-md-close',  'ion-md-close-circle',  'ion-md-closed-captioning',  'ion-md-cloud',  'ion-md-cloud-circle',  'ion-md-cloud-done',  'ion-md-cloud-download',  'ion-md-cloud-outline',  'ion-md-cloud-upload',  'ion-md-cloudy',  'ion-md-cloudy-night',  'ion-md-code',  'ion-md-code-download',  'ion-md-code-working',  'ion-md-cog',  'ion-md-color-fill',  'ion-md-color-filter',  'ion-md-color-palette',  'ion-md-color-wand',  'ion-md-compass',  'ion-md-construct',  'ion-md-contact',  'ion-md-contacts',  'ion-md-contract',  'ion-md-contrast',  'ion-md-copy',  'ion-md-create',  'ion-md-crop',  'ion-md-cube',  'ion-md-cut',  'ion-md-desktop',  'ion-md-disc',  'ion-md-document',  'ion-md-done-all',  'ion-md-download',  'ion-md-easel',  'ion-md-egg',  'ion-md-exit',  'ion-md-expand',  'ion-md-eye',  'ion-md-eye-off',  'ion-md-fastforward',  'ion-md-female',  'ion-md-filing',  'ion-md-film',  'ion-md-finger-print',  'ion-md-flag',  'ion-md-flame',  'ion-md-flash',  'ion-md-flask',  'ion-md-flower',  'ion-md-folder',  'ion-md-folder-open',  'ion-md-football',  'ion-md-funnel',  'ion-md-game-controller-a',  'ion-md-game-controller-b',  'ion-md-git-branch',  'ion-md-git-commit',  'ion-md-git-compare',  'ion-md-git-merge',  'ion-md-git-network',  'ion-md-git-pull-request',  'ion-md-glasses',  'ion-md-globe',  'ion-md-grid',  'ion-md-hammer',  'ion-md-hand',  'ion-md-happy',  'ion-md-headset',  'ion-md-heart',  'ion-md-heart-outline',  'ion-md-help',  'ion-md-help-buoy',  'ion-md-help-circle',  'ion-md-home',  'ion-md-ice-cream',  'ion-md-image',  'ion-md-images',  'ion-md-infinite',  'ion-md-information',  'ion-md-information-circle',  'ion-md-ionic',  'ion-md-ionitron',  'ion-md-jet',  'ion-md-key',  'ion-md-keypad',  'ion-md-laptop',  'ion-md-leaf',  'ion-md-link',  'ion-md-list',  'ion-md-list-box',  'ion-md-locate',  'ion-md-lock',  'ion-md-log-in',  'ion-md-log-out',  'ion-md-magnet',  'ion-md-mail',  'ion-md-mail-open',  'ion-md-male',  'ion-md-man',  'ion-md-map',  'ion-md-medal',  'ion-md-medical',  'ion-md-medkit',  'ion-md-megaphone',  'ion-md-menu',  'ion-md-mic',  'ion-md-mic-off',  'ion-md-microphone',  'ion-md-moon',  'ion-md-more',  'ion-md-move',  'ion-md-musical-note',  'ion-md-musical-notes',  'ion-md-navigate',  'ion-md-no-smoking',  'ion-md-notifications',  'ion-md-notifications-off',  'ion-md-notifications-outline',  'ion-md-nuclear',  'ion-md-nutrition',  'ion-md-open',  'ion-md-options',  'ion-md-outlet',  'ion-md-paper',  'ion-md-paper-plane',  'ion-md-partly-sunny',  'ion-md-pause',  'ion-md-paw',  'ion-md-people',  'ion-md-person',  'ion-md-person-add',  'ion-md-phone-landscape',  'ion-md-phone-portrait',  'ion-md-photos',  'ion-md-pie',  'ion-md-pin',  'ion-md-pint',  'ion-md-pizza',  'ion-md-plane',  'ion-md-planet',  'ion-md-play',  'ion-md-podium',  'ion-md-power',  'ion-md-pricetag',  'ion-md-pricetags',  'ion-md-print',  'ion-md-pulse',  'ion-md-qr-scanner',  'ion-md-quote',  'ion-md-radio',  'ion-md-radio-button-off',  'ion-md-radio-button-on',  'ion-md-rainy',  'ion-md-recording',  'ion-md-redo',  'ion-md-refresh',  'ion-md-refresh-circle',  'ion-md-remove',  'ion-md-remove-circle',  'ion-md-reorder',  'ion-md-repeat',  'ion-md-resize',  'ion-md-restaurant',  'ion-md-return-left',  'ion-md-return-right',  'ion-md-reverse-camera',  'ion-md-rewind',  'ion-md-ribbon',  'ion-md-rose',  'ion-md-sad',  'ion-md-school',  'ion-md-search',  'ion-md-send',  'ion-md-settings',  'ion-md-share',  'ion-md-share-alt',  'ion-md-shirt',  'ion-md-shuffle',  'ion-md-skip-backward',  'ion-md-skip-forward',  'ion-md-snow',  'ion-md-speedometer',  'ion-md-square',  'ion-md-square-outline',  'ion-md-star',  'ion-md-star-half',  'ion-md-star-outline',  'ion-md-stats',  'ion-md-stopwatch',  'ion-md-subway',  'ion-md-sunny',  'ion-md-swap',  'ion-md-switch',  'ion-md-sync',  'ion-md-tablet-landscape',  'ion-md-tablet-portrait',  'ion-md-tennisball',  'ion-md-text',  'ion-md-thermometer',  'ion-md-thumbs-down',  'ion-md-thumbs-up',  'ion-md-thunderstorm',  'ion-md-time',  'ion-md-timer',  'ion-md-train',  'ion-md-transgender',  'ion-md-trash',  'ion-md-trending-down',  'ion-md-trending-up',  'ion-md-trophy',  'ion-md-umbrella',  'ion-md-undo',  'ion-md-unlock',  'ion-md-videocam',  'ion-md-volume-down',  'ion-md-volume-mute',  'ion-md-volume-off',  'ion-md-volume-up',  'ion-md-walk',  'ion-md-warning',  'ion-md-watch',  'ion-md-water',  'ion-md-wifi',  'ion-md-wine',  'ion-md-woman'
        ];

    	$scope.iconKeywords = "";
    	$scope.filteredIcons = [];

    	$scope.iconSearch = function() {
    		$scope.filteredIcons = $filter("filter")($scope.icons, $scope.iconKeywords);
    	};
    	$scope.iconSearch();
    }])

    // Progress Demo Ctrl
    .controller('ProgressDemoCtrl', ['$scope', '$interval', function($scope, $interval) {

        var self = this,  j= 0, counter = 0;
        // circular progress
        self.activated = true;
        self.determinateValue = 30;
        self.determinateValue2 = 30;
        self.showList = [ ];

        // Iterate every 100ms, non-stop and increment
        // the Determinate loader.
        $interval(function() {

            self.determinateValue += 1;
            if (self.determinateValue > 100) {
                self.determinateValue = 30;
            }

        }, 100);


    $interval(function() {
      self.determinateValue += 1;
      self.determinateValue2 += 1.5;

      if (self.determinateValue > 100) self.determinateValue = 30;
      if (self.determinateValue2 > 100) self.determinateValue2 = 30;

        // Incrementally start animation the five (5) Indeterminate,
        // themed progress circular bars

        if ( (j < 2) && !self.showList[j] && self.activated ) {
          self.showList[j] = true;
        }
        if ( counter++ % 4 == 0 ) j++;

        // Show the indicator in the "Used within Containers" after 200ms delay
        if ( j == 2 ) self.contained = "indeterminate";

    }, 100, 0, true);

    $interval(function() {
      self.mode = (self.mode == 'query' ? 'determinate' : 'query');
    }, 7200, 0, true);
    }])


    // Extras Page Demo Ctrl
    .controller('ExtrasDemoCtrl', ['$scope', '$mdDialog', '$mdToast', function($scope, $mdDialog, $mdToast) {
        $scope.listItems = [
            {
                name: 'Riley Lopez',
                note: 'I\'ll be in your neighborhood during errands.'
            },
            {
                name: 'Carter Hamilton',
                note: 'Tomorrow, I\'ll be going to out of town.'
            },
            {
                name: 'Clifford Jimenez',
                note: 'Can you join me in the pool party?'
            }
        ];

        $scope.toppings = [
            { name: 'Pepperoni', wanted: true },
            { name: 'Sausage', wanted: false },
            { name: 'Black Olives', wanted: true },
            { name: 'Green Peppers', wanted: false }
        ];

        $scope.people = [
            { name: 'Janet Perkins', img: 'images/av-1.jpg', newMessage: true },
            { name: 'Mary Johnson', img: 'images/av-2.jpg', newMessage: false },
            { name: 'Peter Carlsson', img: 'images/admin.jpg', newMessage: false }
        ];

        $scope.doSecondaryAction = function(event) {
            $mdDialog.show(
                $mdDialog.alert()
                .title('Secondary Action')
                .textContent('Secondary actions can be used for one click actions')
                .ariaLabel('Secondary click demo')
                .ok('Neat!')
                .targetEvent(event)
            );
        };

        // toast demo
        var last = {
            bottom: true,
            top: false,
            left: false,
            right: true
        };
        $scope.toastPosition = angular.extend({},last);

        $scope.getToastPosition = function() {
            sanitizePosition();

            return Object.keys($scope.toastPosition)
            .filter(function(pos) { return $scope.toastPosition[pos]; })
            .join(' ');
        };

        function sanitizePosition() {
            var current = $scope.toastPosition;

            if ( current.bottom && last.top ) current.top = false;
            if ( current.top && last.bottom ) current.bottom = false;
            if ( current.right && last.left ) current.left = false;
            if ( current.left && last.right ) current.right = false;

            last = angular.extend({},current);
        }

        $scope.showToast = function() {
            var pinTo = $scope.getToastPosition();

            $mdToast.show(
                $mdToast.simple()
                .textContent('Simple Toast!')
                .position(pinTo )
                .hideDelay(3000)
            );
        };

        // Tooltip
        $scope.tooltip = {
            showTooltip: false,
            tipDirection: ''
        };


    }])






})()
;;(function() {
    'use strict';

    angular.module('app.forms.ctrls', [])

    .controller('FormElementsDemo', ['$scope', function($scope) {
        $scope.inputdemo = {
            address: 'B-44/2, Street Park, New Delhi',
            skills: 'PHP, Nodejs, Android',
            textarea: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable.\n\nIf you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text.',
            state: 'MA',
            states: ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
            'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
            'WY').split(' ').map(function(state) {
                return {abbrev: state};
            }),
            toppings: [
                { category: 'meat', name: 'Pepperoni' },
                { category: 'meat', name: 'Sausage' },
                { category: 'meat', name: 'Ground Beef' },
                { category: 'meat', name: 'Bacon' },
                { category: 'veg', name: 'Mushrooms' },
                { category: 'veg', name: 'Onion' },
                { category: 'veg', name: 'Green Pepper' },
                { category: 'veg', name: 'Green Olives' }
            ],
            selectedToppings: [],
            name: 'John Doe',
            donation: 45.32
        };

        $scope.chips = {
            fruitNames: ['Apple', 'Banana', 'Orange']

        };
        $scope.chips.roFruitNames = angular.copy($scope.chips.fruitNames);


        // Date picker
        $scope.myDate = new Date();

        $scope.minDate = new Date(
            $scope.myDate.getFullYear(),
            $scope.myDate.getMonth() - 2,
            $scope.myDate.getDate()
        );

        $scope.maxDate = new Date(
            $scope.myDate.getFullYear(),
            $scope.myDate.getMonth() + 2,
            $scope.myDate.getDate()
        );

        $scope.onlyWeekendsPredicate = function(date) {
            var day = date.getDay();
            return day === 0 || day === 6;
        };


        // Custom Sliders
        $scope.sliderColor = {
            red: Math.floor(Math.random() * 255),
            green: Math.floor(Math.random() * 255),
            blue: Math.floor(Math.random() * 255)
        };

        $scope.sliderRating1 = 3;
        $scope.sliderRating2 = 2;
        $scope.sliderRating3 = 4;

        // vertical
        $scope.verticalSlider = {
            vol: Math.floor(Math.random() * 100),
            bass: Math.floor(Math.random() * 100),
            master: Math.floor(Math.random() * 100)
        };

        $scope.sliderDisabled = Math.floor(Math.random() * 10);

        /*** Checkbox Demo ***/
        $scope.check = {
            cb1: true, cb2: false, cb3: true, cb4: false
        };
        /** Radio group **/
        $scope.radio = {
            group: 'Apple'
        };
        // Switches
        $scope.switch = {
            cb1: true, cb2: false, cb3: true, cb4: true
        };

    }])

    .controller('ContactChipsDemoCtrl', ['$scope', '$q', '$timeout', function($scope, $q, $timeout) {
        var self = this;
        var pendingSearch, cancelSearch = angular.noop;
        var cachedQuery, lastSearch;

        self.allContacts = loadContacts();
        self.contacts = [self.allContacts[1]];
        self.asyncContacts = [];
        self.filterSelected = true;

        self.querySearch = querySearch;
        self.delayedQuerySearch = delayedQuerySearch;

        /**
        * Search for contacts; use a random delay to simulate a remote call
        */
        function querySearch (criteria) {
            cachedQuery = cachedQuery || criteria;
            return cachedQuery ? self.allContacts.filter(createFilterFor(cachedQuery)) : [];
        }

        /**
        * Async search for contacts
        * Also debounce the queries; since the md-contact-chips does not support this
        */
        function delayedQuerySearch(criteria) {
            cachedQuery = criteria;
            if ( !pendingSearch || !debounceSearch() )  {
                cancelSearch();

                return pendingSearch = $q(function(resolve, reject) {
                    // Simulate async search... (after debouncing)
                    cancelSearch = reject;
                    $timeout(function() {

                        resolve( self.querySearch() );

                        refreshDebounce();
                    }, Math.random() * 500, true)
                });
            }

            return pendingSearch;
        }

        function refreshDebounce() {
            lastSearch = 0;
            pendingSearch = null;
            cancelSearch = angular.noop;
        }

        /**
        * Debounce if querying faster than 300ms
        */
        function debounceSearch() {
            var now = new Date().getMilliseconds();
            lastSearch = lastSearch || now;

            return ((now - lastSearch) < 300);
        }

        /**
        * Create filter function for a query string
        */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(contact) {
                return (contact._lowername.indexOf(lowercaseQuery) != -1);;
            };

        }

        function loadContacts() {
            var contacts = [
                'Marina Augustine',
                'Oddr Sarno',
                'Nick Giannopoulos',
                'Narayana Garner',
                'Anita Gros',

            ];

            return contacts.map(function (c, index) {
                var cParts = c.split(' ');
                var contact = {
                    name: c,
                    email: cParts[0][0].toLowerCase() + '.' + cParts[1].toLowerCase() + '@example.com',
                    image: 'http://lorempixel.com/50/50/people?' + index
                };
                contact._lowername = contact.name.toLowerCase();
                return contact;
            });
        }

    }])

    .controller('FormValidationDemo', ['$scope', function($scope) {
        $scope.validDemo = {
            email: '',
            pass: 'example',
            num: 23
        };
    }])


})()
;;(function() {
    'use strict';

    angular.module('app.tables.ctrls', [])

    .controller('TableDemoCtrl', ['$scope', '$q', '$http', '$timeout', function($scope, $q, $http, $timeout) {

        $scope.staticData = [
            {
    			post: "My First Blog",
    			author: "Johnny",
    			categories: "WebDesign",
    			tags: ["wordpress", "blog"],
    			date: "20-3-2004",
                tagColor: 'green-500'
    		},
    		{
    			post: "How to Design",
    			author: "Jenifer",
    			categories: "design",
    			tags: ["photoshop", "illustrator"],
    			date: "2-4-2012",
                tagColor: 'blue-500'
    		},
    		{
    			post: "Something is missing",
    			author: "Joe",
    			categories: "uncategorized",
    			tags: ["abc", "def", "ghi"],
    			date: "20-5-2013",
                tagColor: 'red-500'
    		},
    		{
    			post: "Learn a new language",
    			author: "Rinky",
    			categories: "language",
    			tags: ["C++", "Java", "PHP"],
    			date: "10-5-2014",
                tagColor: 'brown-500'
    		},
    		{
    			post: "I love singing. Do you?",
    			author: "AJ",
    			categories: "singing",
    			tags: ["music"],
    			date: "2-10-2014",
                tagColor: 'orange-500'
    		}
        ];

        // data table via json
        $scope.options = {
            rowSelection: true,
            multiSelect: true,
            autoSelect: true,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        };
        $scope.selected = [];
        $scope.limitOptions = [5, 10, 15];
        $scope.query = {
            order: 'name', limit: 5, page: 1
        };
        $scope.columns = [
            {name: 'Dessert', orderBy: 'name', unit: '100g serving'},
            {descendFirst: true, name: 'Type', orderBy: 'type'},
            {name: 'Calories', numeric: true, orderBy: 'calories.value'},
            {name: 'Fat', numeric: true, orderBy: 'fat.value', unit: 'g'},
            {name: 'Protein', numeric: true, orderBy: 'protein.value', trim: true, unit: 'g'},
            {name: 'Iron', numeric: true, orderBy: 'iron.value', unit: '%'}
        ];

        $http.get('public/scripts/tables/sample.json').then(function(desserts) {
            $scope.desserts = desserts.data;
        });

        $scope.toggleLimitOptions = function () {
            $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
        };

        $scope.getTypes = function () {
            return ['Candy', 'Ice cream', 'Other', 'Pastry'];
        };

        $scope.onPaginate = function(page, limit) {
            console.log('Scope Page: ' + $scope.query.page + ' Scope Limit: ' + $scope.query.limit);
            console.log('Page: ' + page + ' Limit: ' + limit);

            $scope.promise = $timeout(function () {

            }, 2000);
        };


    }])


}())
;;(function() {
    'use strict';

    angular.module('app.users.ctrls', [])


    .controller('UsersCtrl', ['$scope', 'AuthService', '$timeout', function($scope, AuthService, $timeout) {

    	$scope.selected = [];
        $scope.limitOptions = [5, 10, 15];
        $scope.query = {
            order: 'id', limit: 5, page: 1
        };

    	$scope.listUsers = function(page, limit) {
	        AuthService.list_users(page, limit).then(function (data){
	            $scope.users = data;
	        });
	    };

	    $scope.listUsers(0, $scope.query.limit);    

        AuthService.user_count().then(function (data){
            $scope.users_count = data;
        });

        $scope.options = {
            rowSelection: false,
            multiSelect: true,
            autoSelect: true,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: true,
            limitSelect: true,
            pageSelect: true
        };

        $scope.onPaginate = function(page, limit) {
            // console.log('Scope Page: ' + $scope.query.page + ' Scope Limit: ' + $scope.query.limit);
            // console.log('Page: ' + page + ' Limit: ' + limit);
            // console.log($scope.selected);

            $scope.promise = $timeout(function () {
            	$scope.listUsers(page - 1, limit);
            }, 1000);
        };
        $scope.sorterFunc = function(user){
            return parseInt(user.id);
        };


    }])


})()
;;(function() {
    'use strict';

    angular.module('app.categories.ctrls', [])

    .controller('CategoriesCtrl', ['$scope', 'CategoriesService', '$mdDialog', function($scope, CategoriesService, $mdDialog) {

    	$scope.listCategories = function() {
	        CategoriesService.list_categories().then(function (data){
	            $scope.categories = data;
	        });
	    };
	    $scope.listCategories();

	    $scope.updateCat = function(cat) {
	        CategoriesService.update_category(cat).then(function (data){
	        	if(data.id){
	        		cat = data;
	        	}
	        });
	    };

        $scope.promptCreateCat = function(ev) {
            var confirm = $mdDialog.prompt()
            .title('What your new category?')
            .placeholder('Category name')
            .ariaLabel('Category name')
            .initialValue('')
            .targetEvent(ev)
            .ok('Create')
            .cancel('Cancel');

            $mdDialog.show(confirm).then(function(result) {
            	if(result){
            		var cat = {
            			name: result,
            			active: 0
            		};
            		CategoriesService.create_category(cat).then(function (data){
			        	if(data){
			        		$scope.listCategories();
			        	}
			        });
            	}
                
            }, function() {
                
            });
        };

        $scope.deleteCat = function(cat) {
	        CategoriesService.delete_category(cat).then(function (data){
	        	if(data){
	        		$scope.listCategories();
	        	}
	        });
	    };

	    $scope.promptUpdateCat = function(ev, cat) {
            var confirm = $mdDialog.prompt()
            .title('Update category name.')
            .placeholder('Category name')
            .ariaLabel('Category name')
            .initialValue(cat.name)
            .targetEvent(ev)
            .ok('Okay!')
            .cancel('Cancel');

            $mdDialog.show(confirm).then(function(result) {
            	if(result){
            		cat.name = result;
            		$scope.updateCat(cat);
            	}
                
            }, function() {
                
            });
        }; 
	    
    }])


})()
;;(function() {
    'use strict';

    angular.module('app.excuses.ctrls', [])

    .controller('ExcusesCtrl', ['$scope', 'ExcusesService', '$mdDialog', 'CategoriesService', '$timeout', function($scope, ExcusesService, $mdDialog, CategoriesService, $timeout) {

        $scope.selected = [];
        $scope.limitOptions = [5, 10, 15];
        $scope.query = {
            order: 'id', limit: 5, page: 1
        };

    	$scope.listExcuses = function(page, limit) {
	        ExcusesService.list_excuses(page, limit).then(function (data){
	            $scope.excuses = data;
	        });
	    };
	    $scope.listExcuses(0, $scope.query.limit);

        $scope.listCategories = function() {
            CategoriesService.list_categories().then(function (data){
                $scope.categories = data;
            });
        };
        $scope.listCategories();

        $scope.updateCount = function() {
            ExcusesService.excuses_count().then(function (data){
                $scope.excusesCount = data;
            });
        };
        $scope.updateCount();

        $scope.options = {
            rowSelection: true,
            multiSelect: true,
            autoSelect: true,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: true,
            limitSelect: true,
            pageSelect: true
        };

        $scope.onPaginate = function(page, limit) {
            // console.log('Scope Page: ' + $scope.query.page + ' Scope Limit: ' + $scope.query.limit);
            // console.log('Page: ' + page + ' Limit: ' + limit);
            // console.log($scope.selected);

            $scope.promise = $timeout(function () {
                $scope.listExcuses(page - 1, limit);
            }, 1000);
        };

        $scope.createExcuse = function(excuse) {
            if(excuse.title && excuse.description && excuse.category_id){
                ExcusesService.create_excuse(excuse).then(function (result){
                    if(result){
                        $scope.listExcuses(0, $scope.query.limit);
                        $scope.updateCount();
                        $scope.query.page = 1;
                    }
                });
            }
        };

        $scope.showAdvanced = function(ev, excuse) {
            if(excuse.id){
                $scope.currentExcuse = excuse;
            }else{
                $scope.currentExcuse = {};
            }
            var parentEl = angular.element(document.body);
            $mdDialog.show({
                controller: ["$scope", "$mdDialog", function($scope, $mdDialog) {
                    $scope.closeDialog = function() {
                        $mdDialog.hide();
                    };
                    $scope.cancel = function() {
                        $mdDialog.cancel();
                    };
                    $scope.answer = function(data) {
                        if(data.id){
                            console.log('update excuse');
                        }else{
                            data.active = 0;
                            $scope.createExcuse(data);
                        }

                        $mdDialog.hide();
                    };
                }],
                templateUrl: 'public/views/dialog1.tmpl.html',
                parent: parentEl,
                targetEvent: ev,
                clickOutsideToClose: true,
                preserveScope: true, 
                scope: $scope,
                fullscreen: false
            })    
        };

        $scope.sorterFunc = function(excuse){
            return parseInt(excuse.id);
        };



	    // $scope.updateCat = function(cat) {
	    //     CategoriesService.update_category(cat).then(function (data){
	    //     	if(data.id){
	    //     		cat = data;
	    //     	}
	    //     });
	    // };

     //    $scope.deleteCat = function(cat) {
	    //     CategoriesService.delete_category(cat).then(function (data){
	    //     	if(data){
	    //     		$scope.listCategories();
	    //     	}
	    //     });
	    // };

	    // $scope.promptUpdateCat = function(ev, cat) {
         //        var confirm = $mdDialog.prompt()
         //        .title('Update category name.')
         //        .placeholder('Category name')
         //        .ariaLabel('Category name')
         //        .initialValue(cat.name)
         //        .targetEvent(ev)
         //        .ok('Okay!')
         //        .cancel('Cancel');

         //        $mdDialog.show(confirm).then(function(result) {
         //        	if(result){
         //        		cat.name = result;
         //        		$scope.updateCat(cat);
         //        	}
                    
         //        }, function() {
                    
         //        });
         //    }; 
	    
    }])


})()
