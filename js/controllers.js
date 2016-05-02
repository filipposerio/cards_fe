'use strict';

/* Controllers */

var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('CardsMainCtrl', function($scope) {
    	console.log("OK MAIN CONTROLLER");
    	$scope.message = 'Easy way to complete your sticker album!!';
  });
  
  
phonecatControllers.controller('UsersListCtrl', ['$scope', '$http','$window',
  function($scope, $http, $window) {
  	console.log("OK users list controller");
    //$http.get('http:\\fscardsbe.herokuapp.com/users -H "Authorization: Bearer " + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU3MWQxZDQ2NGYyYzYxZDAwZGExZWQ1ZiIsImlhdCI6MTQ2MTY1ODgzNiwiZXhwIjoxNDYxNjY5NjM2fQ.VG8m5u82XcrgI2ThxcjAi9NKMlF3I8LcTG7CQJ-fjAM' +'"').success(function(data) {
		console.log(localStorage.getItem("token"));
    $http.get('http://fscardsbe.herokuapp.com/users', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token")  }}).then(function successCallback(response) {
    									console.log("OK elenco caricato");
      								$scope.phones = response.data;
      								//carico gli album associati
   								    $http.get('http://fscardsbe.herokuapp.com/useralbums', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token")  }}).then(function successCallback(response) {
			    									console.log("OK elenco album utente caricato");
			    									console.log(response.data);
			      								$scope.albums = response.data;
			      								
			   								    $http.get('http://fscardsbe.herokuapp.com/missingcards' , { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token")  }}).then(function successCallback(response) {
					    									console.log("OK elenco cards caricato");
					      								$scope.cards = response.data;
					      								console.log(response.data);
						  							}, function errorCallback(response) {
					    									console.log("errore");
					    									console.log(response.statusText);
					      								$scope.cards = "";
					      								$scope.message = "Non sei autorizzato. Effettua prima il LogIn";
					      								$window.location.href = '#login';
					  								});	
   								    });

      								
	  }, function errorCallback(response) {
    									console.log("errore");
    									console.log(response.statusText);
      								$scope.phones = "";
      								$scope.message = "Non sei autorizzato. Effettua prima il LogIn";
      								$window.location.href = '#login';
  	});
    $scope.orderProp = 'age';
    $scope.removePhone = function (phoneId) {
    	console.log("OK users remove controller; cancello id = "+ phoneId);
    	var deleteUser = $window.confirm('Are you absolutely sure you want to delete?');
    	 if (deleteUser) {
    	 	console.log("conferma da parte dell'utente della cancellazione id = "+ phoneId);
    	 	$http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("token");
    	 	$http.post('http://fscardsbe.herokuapp.com/users/destroy?id='+phoneId).then(function successCallback(response) {
    									console.log("OK");
      								//	$scope.phones = response.data;
      								// ricarico elenco
     									$http.get('http://fscardsbe.herokuapp.com/users', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token")}}).then(function successCallback(response) {
    										console.log("OK elenco ricaricato");
      									$scope.phones = response.data;
	  									}, function errorCallback(response) {
    										console.log("errore");
    										console.log(response.statusText);
      									$scope.phones = "";
  										});
	  		}, function errorCallback(response) {
    									console.log("errore cancellazione");
    									console.log(response.statusText);
    									console.log(response.data.summary);
    									console.log("verifica token");
    									console.log(localStorage.getItem("token"));
    									
      								$scope.phones = "";
      								// ricarico elenco
     									$http.get('http://fscardsbe.herokuapp.com/users', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token")	}}).then(function successCallback(response) {
    										console.log("OK elenco ricaricato");
      									$scope.phones = response.data;
	  									}, function errorCallback(response) {
    										console.log("errore");
    										console.log(response.statusText);
      									$scope.phones = "";
  										});
  			});
       }
  	}
  	 $scope.removeUserAlbum = function (albumId) {
  	 	console.log("OK users remove controller; cancello id = "+ albumId);
    	var deleteUser = $window.confirm('Are you absolutely sure you want to delete album for user ');
    	 if (deleteUser) {
    	 	console.log("conferma da parte dell'utente della cancellazione id = "+ albumId);
    	 	$http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("token");
    	 	$http.post('http://fscardsbe.herokuapp.com/useralbums/destroy?id='+albumId).then(function successCallback(response) {
    									console.log("OK");
      								//	$scope.phones = response.data;
      								// ricarico elenco
      								$window.location.href = '#users';
      								
	  		}, function errorCallback(response) {
    									console.log("errore cancellazione");
    									console.log(response.statusText);
    									console.log(response.data.summary);
    									console.log("verifica token");
    									console.log(localStorage.getItem("token"));
      								$scope.albums = "";
      								$window.location.href = '#users';
  			});
       }
  	}
  	 $scope.removeMissingCard= function (cardId) {
  	 	console.log("OK users remove controller; cancello id = "+ cardId);
    	var deleteUser = $window.confirm('Are you absolutely sure you find this card?');
    	 if (deleteUser) {
    	 	console.log("conferma da parte dell'utente della cancellazione id = "+ cardId);
    	 	$http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("token");
    	 	$http.post('http://fscardsbe.herokuapp.com/missingcards/destroy?id='+cardId).then(function successCallback(response) {
    									console.log("OK");
      								//	$scope.phones = response.data;
      								// ricarico elenco
      								$window.location.href = '#users';
      								
	  		}, function errorCallback(response) {
    									console.log("errore cancellazione");
    									console.log(response.statusText);
    									console.log(response.data.summary);
    									console.log("verifica token");
    									console.log(localStorage.getItem("token"));
      								$scope.albums = "";
      								$window.location.href = '#users';
  			});
       }
  	}  	
  	$scope.showMissingCards = function (idUserAlbum) {
  	 	 console.log("OK users show cards per  id = "+ idUserAlbum);
    	 $http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("token");
		   $http.get('http://fscardsbe.herokuapp.com/missingcards?idUserAlbum=' + $scope.idUserAlbum , { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token")  }}).then(function successCallback(response) {
		    									console.log("OK elenco cards caricato");
		      								$scope.cards = response.data;
		      								console.log(response.data);
			  }, function errorCallback(response) {
		    									console.log("errore");
		    									console.log(response.statusText);
		      								$scope.cards = "";
		      								$scope.message = "Non sei autorizzato. Effettua prima il LogIn";
		      								$window.location.href = '#login';
		  	});
       }
  	$scope.addMissingCard = function (userId, albumId,card, userAlbumId) {
  	 	 console.log("OK users add missing cards");
  	 	 console.log(userId);
  	 	 console.log(albumId);
  	 	 console.log(userAlbumId);
  	 	 console.log(card);
    	 $http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("token");
		   $http.post('http://fscardsbe.herokuapp.com/missingcards/create?idUser='+userId+'&idAlbum='+albumId+'&idUserAlbum='+userAlbumId+'&card='+card).then(function successCallback(response) {
		    									console.log("OK missing-cards added");
		      								//$scope.cards = response.data;
		      								console.log(response.data);
		      								$window.location.href = '#users';
			  }, function errorCallback(response) {
		    									console.log("errore");
		    									console.log(response.statusText);
		      								$scope.cards = "";
		      								$scope.message = "Non sei autorizzato. Effettua prima il LogIn";
		      								$window.location.href = '#login';
		  	});
       }       

  }]);
  
phonecatControllers.controller('UserAlbumCardCtrl', ['$scope', '$http','$window','$routeParams',
  function($scope, $http, $window,$routeParams) {
  	console.log("OK usersalbumcard controller************************************");
  	console.log($routeParams.userId);
    //$http.get('http:\\fscardsbe.herokuapp.com/users -H "Authorization: Bearer " + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU3MWQxZDQ2NGYyYzYxZDAwZGExZWQ1ZiIsImlhdCI6MTQ2MTY1ODgzNiwiZXhwIjoxNDYxNjY5NjM2fQ.VG8m5u82XcrgI2ThxcjAi9NKMlF3I8LcTG7CQJ-fjAM' +'"').success(function(data) {
		console.log(localStorage.getItem("token"));
   								    $http.get('http://fscardsbe.herokuapp.com/useralbums?idUser='+$routeParams.userId, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token")  }}).then(function successCallback(response) {
			    									console.log("OK elenco album utente caricato");
			    									console.log(response.data);
			      								$scope.albums = response.data;
			      								
			   								    $http.get('http://fscardsbe.herokuapp.com/missingcards' , { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token")  }}).then(function successCallback(response) {
					    									console.log("OK elenco cards caricato");
					      								$scope.cards = response.data;
					      								console.log(response.data);
						  							}, function errorCallback(response) {
					    									console.log("errore");
					    									console.log(response.statusText);
					      								$scope.cards = "";
					      								$scope.message = "Non sei autorizzato. Effettua prima il LogIn";
					      								$window.location.href = '#login';
					  								});	
   								    });

      								
  	 $scope.removeUserAlbum = function (albumId) {
  	 	console.log("OK users remove controller; cancello id = "+ albumId);
    	var deleteUser = $window.confirm('Are you absolutely sure you want to delete album for user ');
    	 if (deleteUser) {
    	 	console.log("conferma da parte dell'utente della cancellazione id = "+ albumId);
    	 	$http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("token");
    	 	$http.post('http://fscardsbe.herokuapp.com/useralbums/destroy?id='+albumId).then(function successCallback(response) {
    									console.log("OK");
      								//	$scope.phones = response.data;
      								// ricarico elenco
      								$window.location.href = '#users';
      								
	  		}, function errorCallback(response) {
    									console.log("errore cancellazione");
    									console.log(response.statusText);
    									console.log(response.data.summary);
    									console.log("verifica token");
    									console.log(localStorage.getItem("token"));
      								$scope.albums = "";
      								$window.location.href = '#users';
  			});
       }
  	}
  	 $scope.removeMissingCard= function (cardId) {
  	 	console.log("OK users remove controller; cancello id = "+ cardId);
    	var deleteUser = $window.confirm('Are you absolutely sure you find this card?');
    	 if (deleteUser) {
    	 	console.log("conferma da parte dell'utente della cancellazione id = "+ cardId);
    	 	$http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("token");
    	 	$http.post('http://fscardsbe.herokuapp.com/missingcards/destroy?id='+cardId).then(function successCallback(response) {
    									console.log("OK");
      								//	$scope.phones = response.data;
      								// ricarico elenco
      								$window.location.href = '#users';
      								
	  		}, function errorCallback(response) {
    									console.log("errore cancellazione");
    									console.log(response.statusText);
    									console.log(response.data.summary);
    									console.log("verifica token");
    									console.log(localStorage.getItem("token"));
      								$scope.albums = "";
      								$window.location.href = '#users';
  			});
       }
  	}  	
  	$scope.showMissingCards = function (idUserAlbum) {
  	 	 console.log("OK users show cards per  id = "+ idUserAlbum);
    	 $http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("token");
		   $http.get('http://fscardsbe.herokuapp.com/missingcards?idUserAlbum=' + $scope.idUserAlbum , { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token")  }}).then(function successCallback(response) {
		    									console.log("OK elenco cards caricato");
		      								$scope.cards = response.data;
		      								console.log(response.data);
			  }, function errorCallback(response) {
		    									console.log("errore");
		    									console.log(response.statusText);
		      								$scope.cards = "";
		      								$scope.message = "Non sei autorizzato. Effettua prima il LogIn";
		      								$window.location.href = '#login';
		  	});
       }
  	$scope.addMissingCard = function (userId, albumId,card, userAlbumId) {
  	 	 console.log("OK users add missing cards");
  	 	 console.log(userId);
  	 	 console.log(albumId);
  	 	 console.log(userAlbumId);
  	 	 console.log(card);
    	 $http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("token");
		   $http.post('http://fscardsbe.herokuapp.com/missingcards/create?idUser='+userId+'&idAlbum='+albumId+'&idUserAlbum='+userAlbumId+'&card='+card).then(function successCallback(response) {
		    									console.log("OK missing-cards added");
		      								//$scope.cards = response.data;
		      								console.log(response.data);
		      								console.log('id utente' + response.data.idUser);
		      								$window.location.href = '#usersalbums/' + response.data.idUser;
			  }, function errorCallback(response) {
		    									console.log("errore");
		    									console.log(response.statusText);
		      								$scope.cards = "";
		      								$scope.message = "Non sei autorizzato. Effettua prima il LogIn";
		      								$window.location.href = '#login';
		  	});
       }       

  }]);
  
  phonecatControllers.controller('UserAddCtrl', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
  	$scope.addUser = function () {
  		console.log("OK user add controller");
        //  Reset our list of orders  (when binded, this'll ensure the previous list of orders disappears from the screen while we're loading our JSON data)
        //$scope.listaOrdiniCliente = 'aaaaa';

        //  The user has selected a Customer from our Drop Down List.  Let's load this Customer's records.
       // console.log($scope.selectedCustomer);
       console.log($scope.userEmail);
       console.log($scope.userPassword);
       console.log($scope.userConfirmPassword);
       
        $http.post('http://fscardsbe.herokuapp.com/users/create?email='+$scope.userEmail+'&password='+$scope.userPassword+'&confirmPassword='+$scope.userConfirmPassword).then(function successCallback(response) {
                    $scope.users = response.data
                    
                    $scope.userEmail ="";
                    $scope.userPassword ="";
                    $scope.userConfirmPassword ="";
                    localStorage.setItem("token",response.data.token);
                    $scope.message= "user addedd with id: " + response.data.user.id + ". Token: " + localStorage.getItem("token");
                },
								function errorCallback(response) {
    									console.log("errore");
    									console.log(response.data);
      								$scope.message = "Couldn't insert new user. Error # " + response.data.summary;
  							});                
    }
  }]);


  
  phonecatControllers.controller('UserAuthCtrl', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
  	console.log("azzero il token");
  	localStorage.setItem("token","");
  	$scope.logInUser = function () {
  		console.log("OK user authorization controller");

       console.log($scope.userEmail);
       console.log($scope.userPassword);
       
       
        $http.get('http://fscardsbe.herokuapp.com/auth?email='+$scope.userEmail+'&password='+$scope.userPassword).then(function successCallback(response) {
                    $scope.users = response.data
                    
                    $scope.userEmail ="";
                    $scope.userPassword ="";
                    localStorage.setItem("token",response.data.token);
                    $scope.message= "user addedd with id: " + response.data.user.id + ". Token: " + localStorage.getItem("token");
                },
								function errorCallback(response) {
    									console.log("errore");
    									console.log(response.data);
      								$scope.message = "LogIn error. Please retry. Error # " + response.data.summary;
  							});                
    }
  }]);


phonecatControllers.controller('AlbumsListCtrl', ['$scope', '$http','$window',
  function($scope, $http, $window) {
  	console.log("OK albums list controller");
		console.log(localStorage.getItem("token"));
    $http.get('http://fscardsbe.herokuapp.com/albums', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token")  }}).then(function successCallback(response) {
    									console.log("OK elenco caricato");
      								$scope.phones = response.data;
	  }, function errorCallback(response) {
    									console.log("errore album list");
    									console.log(response.statusText);
      								$scope.phones = "";
      								$scope.message = "Non sei autorizzato. Effettua prima il LogIn";
      								$window.location.href = '#login';
  	});
    $scope.orderProp = 'age';
    $scope.removePhone = function (phoneId) {
    	console.log("OK users remove controller; cancello id = "+ phoneId);
    	var deleteUser = $window.confirm('Are you absolutely sure you want to delete?');
    	 if (deleteUser) {
    	 	console.log("conferma da parte dell'utente della cancellazione id = "+ phoneId);
    	 	$http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("token");
    	 	$http.post('http://fscardsbe.herokuapp.com/albums/destroy?id='+phoneId).then(function successCallback(response) {
    									console.log("OK");
      								//	$scope.phones = response.data;
      								// ricarico elenco
     									$http.get('http://fscardsbe.herokuapp.com/albums', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token")}}).then(function successCallback(response) {
    										console.log("OK elenco ricaricato");
      									$scope.phones = response.data;
	  									}, function errorCallback(response) {
    										console.log("errore");
    										console.log(response.statusText);
      									$scope.phones = "";
  										});
	  		}, function errorCallback(response) {
    									console.log("errore cancellazione");
    									console.log(response.statusText);
    									console.log(response.data.summary);
    									console.log("verifica token");
    									console.log(localStorage.getItem("token"));
    									
      								$scope.phones = "";
      								// ricarico elenco
     									$http.get('http://fscardsbe.herokuapp.com/albums', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token")	}}).then(function successCallback(response) {
    										console.log("OK elenco ricaricato");
      									$scope.phones = response.data;
	  									}, function errorCallback(response) {
    										console.log("errore");
    										console.log(response.statusText);
      									$scope.phones = "";
  										});
  			});
       }
  	}
  }]);
  

  phonecatControllers.controller('AlbumAddCtrl', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
  	$scope.addAlbum = function () {
  		console.log("OK user add controller");
        //  Reset our list of orders  (when binded, this'll ensure the previous list of orders disappears from the screen while we're loading our JSON data)
        //$scope.listaOrdiniCliente = 'aaaaa';

        //  The user has selected a Customer from our Drop Down List.  Let's load this Customer's records.
       // console.log($scope.selectedCustomer);
       console.log($scope.albumName);
       console.log($scope.albumDescription);
       console.log($scope.albumYear);
    	 console.log("verifica token");
    	 console.log(localStorage.getItem("token"));       
       $http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("token");
       $http.post('http://fscardsbe.herokuapp.com/albums/create?name='+$scope.albumName+'&descr='+$scope.albumDescription+'&year='+$scope.albumYear).then(function successCallback(response) {
                    $scope.users = response.data
                    
                    $scope.albumName ="";
                    $scope.albumDescription ="";
                    $scope.albumYear ="";
                    $scope.message= "album addedd with id: " + response.data;
                },
								function errorCallback(response) {
    									console.log("errore");
    									console.log(response.data);
      								$scope.message = "Couldn't insert new user. Error # " + response.data.summary;
  							});                
    }
  }]);  

phonecatControllers.controller('UserAlbumsCtrl', ['$scope', '$http','$window',
  function($scope, $http, $window) {
  	console.log("OK users album controller");
    console.log(localStorage.getItem("token"));
    $http.get('http://fscardsbe.herokuapp.com/useralbums', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token")  }}).then(function successCallback(response) {
    									console.log("OK elenco caricato");
      								$scope.albums = response.data;
      								console.log(response.data);
	  }, function errorCallback(response) {
    									console.log("errore");
    									console.log(response.statusText);
    									
      								$scope.albums = "";
      								$scope.message = "Non sei autorizzato. Effettua prima il LogIn";
      								$window.location.href = '#login';
  	});
  }]);
  
phonecatControllers.controller('MissingCardsCtrl', ['$scope', '$http','$window',
  function($scope, $http, $window) {
  	console.log("OK users album cards controller");
  	console.log("elenco card per albumutente " + $scope.idUserAlbum) ;
    console.log(localStorage.getItem("token"));
    $http.get('http://fscardsbe.herokuapp.com/missingcards?idUserAlbum=' + $scope.idUserAlbum , { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token")  }}).then(function successCallback(response) {
    									console.log("OK elenco cards caricato");
      								$scope.cards = response.data;
      								console.log(response.data);
	  }, function errorCallback(response) {
    									console.log("errore");
    									console.log(response.statusText);
      								$scope.cards = "";
      								$scope.message = "Non sei autorizzato. Effettua prima il LogIn";
      								$window.location.href = '#login';
  	});
  }]);