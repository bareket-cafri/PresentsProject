var appM = angular.module('appM');

appM.controller('loginController', function($scope, $http) {
	
		//init();
		//alert(1);
		//$scope.admin=false;
		//$scope.client1=false;
		var user_email = "0" ;
		var userId = "0";
		
		$scope.toUsers = 0;
		$scope.isWorker = 0;
		$scope.isDeliver = 0;
		$scope.isClient = 0;
		$scope.isConnect = 0;
		
		$scope.connect = function() {
			//alert(2);
			//$scope.tryShow = 1;
			$http.post('/login', {
				email: $scope.loginForm.email,
				pass: $scope.loginForm.password
			})
			.then(function onSuccess(data) {
				$scope.user=data.data;
				//var x ="worker";
				//console.log(x);
				//salert(x);
				/*if($scope.user.category == "worker") {
					//alert("worker")
					$(".admin").show();
				}*/
				
				
				$scope.isConnect = 1;
				switch ($scope.user.category){
					case 'worker': //$(".admin").show();
									$scope.isWorker = 1;
									$scope.toUsers = 1;
								break;
					case 'deliver':// $(".worker").show();
									$scope.isDeliver = 1;
									$scope.toUsers = 1;
								break;
					case 'client': //$(".client").show();
									$scope.isClient = 1;
								break;
					default: alert("def");
				}
				//$(".connect").show();
				//$(".inConnect").hide();
				user_email = $scope.user.email;
				userId = $scope.user.id;
				//$( "#home" ).trigger( "click" );
				$("#dropdownLog").toggle();
				$scope.openHome();
				
			})
			.catch(function onError(sailsResponse) {
				alert(sailsResponse);
				if(sailsResponse.status === 400 || 404) {
					alert("Invalid email or username/password combination.");
					/*toastr.error('Invalid email or username/password combination.', 'Error', {
					closeButton: true
				});*/
				return;
				}
			})
			.finally(function eitherWay() {});
		};
		
		$scope.screenLinksWithP = function(ref) {
			$http.get('/'+ref+'/'+ user_email)
			.then(function onSuccess(data) {
				$scope.html=data.data;
				$('#mainContent').html($scope.html=data.data);
				$('#leftContent').html('');
			})
			.catch(function onError(sailsResponse) {
				alert(sailsResponse);
				if(sailsResponse.status === 400 || 404) {
					alert("Error");
					/*toastr.error('Invalid email or username/password combination.', 'Error', {
					closeButton: true
				});*/
				return;
				}
			})
			.finally(function eitherWay() {});
		};
		
		$scope.showOrders = function(ref) {
			$http.get('/'+ref+'/'+ userId)
			.then(function onSuccess(data) {
				$scope.html=data.data;
				$('#mainContent').html($scope.html=data.data);
				$('#leftContent').html('');
			})
			.catch(function onError(sailsResponse) {
				alert(sailsResponse);
				if(sailsResponse.status === 400 || 404) {
					alert("Error");
					/*toastr.error('Invalid email or username/password combination.', 'Error', {
					closeButton: true
				});*/
				return;
				}
			})
			.finally(function eitherWay() {});
		};
		
		$scope.logout = function(ref) {
			//alert(111111)
			$http.get('/logout/'+ userId)
			.then(function onSuccess(data) {
				
				$scope.html=data.data;
				$('#mainContent').html($scope.html=data.data);
				$('#leftContent').html('');
				user_email = "0";
				userId = "0";
				//alert("out");
				//$(".connect").hide();
				$scope.toUsers = 0;
				$scope.isWorker = 0;
				$scope.isDeliver = 0;
				$scope.isClient = 0;
				$scope.isConnect = 0;
			})
			.catch(function onError(sailsResponse) {
				alert(sailsResponse);
				if(sailsResponse.status === 400 || 404) {
					alert("Error");
					/*toastr.error('Invalid email or username/password combination.', 'Error', {
					closeButton: true
				});*/
				return;
				}
			})
			.finally(function eitherWay() {});
		};
		
		$scope.screenLink = function(ref) {
			$http.get('/'+ref)
			.then(function onSuccess(data) {
				$scope.html=data.data;
				$('#mainContent').html($scope.html=data.data);
				$('#leftContent').html('');
				
				/*if(ref == 'logout'){
					user_email = "0";
					userId = "0";
					//alert("out");
					//$(".connect").hide();
					$scope.toUsers = 0;
					$scope.isWorker = 0;
					$scope.isDeliver = 0;
					$scope.isClient = 0;
					$scope.isConnect = 0;
					//$(".client").hide();
					//$(".worker").hide();
					//$(".admin").hide();
	                //$(".inConnect").show();
				}*/
			})
			.catch(function onError(sailsResponse) {
				alert(sailsResponse);
				if(sailsResponse.status === 400 || 404) {
					alert("Error");
					/*toastr.error('Invalid email or username/password combination.', 'Error', {
					closeButton: true
				});*/
				return;
				}
			})
			.finally(function eitherWay() {});	
		};
		
		$scope.openKesher = function() {
			$http.get('/kesher/'+userId)
			.then(function onSuccess(data) {
				$scope.html=data.data;
				$('#mainContent').html($scope.html);
				$('#leftContent').html('');
				/*alert("oo");
				console.log(data);
				if(connectUser == "0") {
					$("#chatt").hide();
				}*/
			})
			.catch(function onError(sailsResponse) {
				alert(sailsResponse);
				if(sailsResponse.status === 400 || 404) {
					alert("Error");
					/*toastr.error('Invalid email or username/password combination.', 'Error', {
					closeButton: true
				});*/
				return;
				}
			})
			.finally(function eitherWay() {});			
		};
		
		$scope.openHome = function() {
			$http.get('/home')
			.then(function onSuccess(data) {
				$scope.html=data.data;
				$('#mainContent').html($scope.html);
				
				if(user_email != "0") {
					$http.get('/homeButtons/'+ user_email)
					.then(function onSuccess(html) {
						$scope.html=html.data;
						$('#leftContent').html($scope.html);
					})
					.catch(function onError(sailsResponse) {
						alert(sailsResponse);
						if(sailsResponse.status === 400 || 404) {
							alert("Error");
							/*toastr.error('Invalid email or username/password combination.', 'Error', {
							closeButton: true
						});*/
						return;
						}
					})
					.finally(function eitherWay() {});
				}
			})
			.catch(function onError(sailsResponse) {
				alert(sailsResponse);
				if(sailsResponse.status === 400 || 404) {
					alert("Error");
					/*toastr.error('Invalid email or username/password combination.', 'Error', {
					closeButton: true
				});*/
				return;
				}
			})
			.finally(function eitherWay() {});			
		};
		
		$scope.openMenu = function() {
			$http.get('/menu/'+ user_email)
			.then(function onSuccess(data) {
				$scope.html=data.data;
				$('#mainContent').html($scope.html);
				
				$http.get('/orderForm/'+ user_email)
				.then(function onSuccess(html) {
					$scope.html=html.data;
					$('#leftContent').html($scope.html);
				})
				.catch(function onError(sailsResponse) {
					alert(sailsResponse);
					if(sailsResponse.status === 400 || 404) {
						alert("Error");
						/*toastr.error('Invalid email or username/password combination.', 'Error', {
						closeButton: true
					});*/
					return;
					}
				})
				.finally(function eitherWay() {});
			})
			.catch(function onError(sailsResponse) {
				alert(sailsResponse);
				if(sailsResponse.status === 400 || 404) {
					alert("Error");
					/*toastr.error('Invalid email or username/password combination.', 'Error', {
					closeButton: true
				});*/
				return;
				}
			})
			.finally(function eitherWay() {});			
		};
		
		$scope.signUp = function() {
			$('#dropdownSign').toggle();
			$http.post('/signup', {
				username: $scope.signupForm.username,
				pass: $scope.signupForm.password,
				email: $scope.signupForm.email,
				tel: $scope.signupForm.phoneNumber,
				address: $scope.signupForm.address,
			})
			.then(function onSuccess(data) {
				alert("המשתמש נוסף בהצלחה");
				//$('#dropdownSign').toggle();
				
			})
			.catch(function onError(sailsResponse) {
				alert(sailsResponse);
				if(sailsResponse.status === 400 || 404) {
					alert("Error");
					/*toastr.error('Invalid email or username/password combination.', 'Error', {
					closeButton: true
				});*/
				return;
				}
			})
			.finally(function eitherWay() {});
		};
	});