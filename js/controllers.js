'use strict';

/* Controllers */

var phonecatControllers = angular.module('phonecatControllers', []);


phonecatControllers.controller('CardsMainCtrl', [ '$scope',
   function($scope) {
    	console.log("OK MAIN CONTROLLER");
    	$scope.message = 'Easy way to complete your sticker album!!';
      
    	localStorage.setItem("beServer",'fscardsbe.herokuapp.com');
    	//localStorage.setItem("beServer",'localhost:1337');
  }]);
  
  
phonecatControllers.controller('UsersListCtrl', ['$scope', '$http','$window',
  function($scope, $http, $window) {
  	console.log("OK users list controller");
		console.log(localStorage.getItem("token"));
		//var beServer = 'fscardsbe.herokuapp.com';
		
		//beServer = 'localhost:1337';
    $http.get('http://'+localStorage.getItem("beServer")+'/users', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token")  }}).then(function successCallback(response) {
    									console.log("OK elenco caricato");
      								$scope.users = response.data;
      								$scope.message=localStorage.getItem("usremail");
      								$scope.admin = localStorage.getItem("admin");
    									console.log("admin: " + $scope.admin );
      								//carico gli album associati
	  }, function errorCallback(response) {
    									console.log("errore");
    									console.log(response.statusText);
      								$scope.users = "";
      								$scope.message = "Non sei autorizzato. Effettua prima il LogIn";
      								$window.location.href = '#login';
  	});
    $scope.orderProp = 'age';
    $scope.removeUser = function (userId) {
    	console.log("OK users remove controller; cancello id = "+ userId);
    	var deleteUser = $window.confirm('Are you absolutely sure you want to delete?');
    	 if (deleteUser) {
    	 	console.log("conferma da parte dell'utente della cancellazione id = "+ userId);
    	 	$http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("token");
    	 	$http.post('http://'+localStorage.getItem("beServer")+'/users/destroy?id='+userId).then(function successCallback(response) {
    									console.log("OK eliminazione");
      								//	$scope.phones = response.data;
      								// ricarico elenco
      								$window.location.href = '#users';
	  		}, function errorCallback(response) {
    									console.log("errore cancellazione");
    									console.log(response.statusText);
    									console.log(response.data.summary);
    									console.log("verifica token");
    									console.log(localStorage.getItem("token"));
      								$scope.users = "";
      								// ricarico elenco
      								$window.location.href = '#users';
  			});
       }
  	}
  }]);
  
  
  phonecatControllers.controller('UserAlbumCtrl', ['$scope', '$http','$window','$routeParams',
  function($scope, $http, $window,$routeParams) {
  	console.log("OK usersalbumcard controller************************************");
  	console.log($routeParams.userId);
		console.log(localStorage.getItem("token"));
		
		console.log("userown="+$routeParams.userId);
		//console.log();
		
    $http.get('http://'+localStorage.getItem("beServer")+'/albums?userown='+$routeParams.userId, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token")  }}).then(function successCallback(response) {
					console.log("OK elenco album utente caricato");
					console.log(response.data);
					$scope.albums = response.data;
		}, function errorCallback(response) {
				console.log("errore");
				console.log(response.statusText);
				$scope.albums = "";
				$scope.message = "Non sei autorizzato. Effettua prima il LogIn";
				$window.location.href = '#login';
		});
    
  }]);
  
  
  
phonecatControllers.controller('UserAlbumMissingCardCtrl', ['$scope', '$http','$window','$routeParams',
  function($scope, $http, $window,$routeParams) {
  	console.log("OK usersalbumcard controller************************************");
  	console.log($routeParams.albumId);
    //$http.get('http:\\fscardsbe.herokuapp.com/users -H "Authorization: Bearer " + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU3MWQxZDQ2NGYyYzYxZDAwZGExZWQ1ZiIsImlhdCI6MTQ2MTY1ODgzNiwiZXhwIjoxNDYxNjY5NjM2fQ.VG8m5u82XcrgI2ThxcjAi9NKMlF3I8LcTG7CQJ-fjAM' +'"').success(function(data) {
		console.log(localStorage.getItem("token"));
		console.log("albumcard="+$routeParams.albumId);
		console.log(localStorage.getItem("beServer"));
    $http.get('http://'+localStorage.getItem("beServer")+'/missingcards?albumcard='+$routeParams.albumId).then(function successCallback(response) {
				console.log("OK elenco cards mancanti caricato");
				$scope.cards = response.data;
				console.log(response.data);
		}, function errorCallback(response) {
				console.log("errore");
				console.log(response.statusText);
				$scope.cards = "";
				$scope.message = "Non sei autorizzato. Effettua prima il LogIn";
				$window.location.href = '#login';
		});
    $scope.addMissingCard = function (card,textdescription) {
	  console.log("OK users add missing cards");
		console.log(card);
		console.log(textdescription);
		console.log($routeParams.albumId);
  	//$http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("token");
	  $http.post('http://'+localStorage.getItem("beServer")+'/missingcards/create?card='+card+'&textdescription='+textdescription+'&albumcard='+$routeParams.albumId).then(function successCallback(response) {
	    									console.log("OK missing-cards added");
	      								//$scope.cards = response.data;
	      								console.log(response.data);
	      								$window.location.href = '#missing/'+response.data.albumcard;
		}, function errorCallback(response) {
	    									console.log("errore");
	    									console.log(response.statusText);
	      								$scope.cards = "";
	      								$scope.message = "Non sei autorizzato. Effettua prima il LogIn";
	      								$window.location.href = '#login';
	  });
    },
    $scope.findMissingCard = function (cardId) {
	  console.log("OK users add FIND cards");
		console.log("cardId :" + cardId);
		console.log("albumId. " + $routeParams.albumId);
  	//$http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("token");
	  $http.post('http://'+localStorage.getItem("beServer")+'/missingcards/update/'+cardId+'?foundby='+localStorage.getItem("usr")).then(function successCallback(response) {
	    									console.log("OK missing-cards FOUND!!!!!!");
	      								//$scope.cards = response.data;
	      								console.log(response.data);
	      								console.log(response.data.albumcard.id);
	      								$window.location.href = '#missing/'+response.data.albumcard.id;
		}, function errorCallback(response) {
	    									console.log("errore");
	    									console.log(response.statusText);
	      								$scope.cards = "";
	      								$scope.message = "Non sei autorizzato. Effettua prima il LogIn";
	      								$window.location.href = '#login';
	  });
    }
    $scope.removeMissingCard = function (cardId) {
	  console.log("OK users REMOVE missing cards");
		console.log(cardId);
		console.log($routeParams.albumId);
  	//$http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("token");
	  $http.post('http://'+localStorage.getItem("beServer")+'/missingcards/destroy?id='+cardId).then(function successCallback(response) {
	    									console.log("OK removed");
	      								//$scope.cards = response.data;
	      								console.log(response.data);
	      								console.log(response.data.albumcard);
	      								console.log(response.data.albumcard.id);
	      								console.log("OK remove card- ricarico elenco");
	      								$window.location.href = '#missing/'+response.data.albumcard.id;
		}, function errorCallback(response) {
	    									console.log("errore");
	    									console.log(response.statusText);
	      								$scope.cards = "";
	      								$scope.message = "Non sei autorizzato. Effettua prima il LogIn";
	      								$window.location.href = '#login';
	  });
    } 
  }]);


  phonecatControllers.controller('UserAuthCtrl', ['$scope', '$routeParams', '$http','$window',
  function($scope, $routeParams, $http,$window) {
  	console.log("azzero il token");
  	localStorage.setItem("token","");
  	localStorage.setItem("usr","");
  	localStorage.setItem("usremail","");
  	localStorage.setItem("admin","");
  	$scope.logInUser = function () {
  		console.log("OK user authorization controller");

       console.log($scope.userEmail);
       console.log($scope.userPassword);
       
       
        $http.get('http://'+localStorage.getItem("beServer")+'/auth?email='+$scope.userEmail+'&password='+$scope.userPassword).then(function successCallback(response) {
                    $scope.users = response.data
                    
                    $scope.userEmail ="";
                    $scope.userPassword ="";
                    localStorage.setItem("token",response.data.token);
                    localStorage.setItem("usr",response.data.user.id);
                    localStorage.setItem("usremail",response.data.user.email);
                    localStorage.setItem("admin",response.data.user.admin);
                    //$scope.message= "user addedd with id: " + response.data.user.id + ". Token: " + localStorage.getItem("token");
                    $window.location.href = '#users';
                },
								function errorCallback(response) {
    									console.log("errore");
    									console.log(response.data);
      								$scope.message = "LogIn error. Please retry. Error # " + response.data.summary;
  							});                
    }
  }]);
  
  
  
  phonecatControllers.controller('UserAddCtrl', ['$scope', '$routeParams', '$http','$window',
  function($scope, $routeParams, $http,$window) {
  	$scope.addUser = function () {
  		console.log("OK user add controller");
        //  Reset our list of orders  (when binded, this'll ensure the previous list of orders disappears from the screen while we're loading our JSON data)
        //$scope.listaOrdiniCliente = 'aaaaa';

        //  The user has selected a Customer from our Drop Down List.  Let's load this Customer's records.
       // console.log($scope.selectedCustomer);
       console.log($scope.userEmail);
       console.log($scope.userPassword);
       console.log($scope.userConfirmPassword);
       
        $http.post('http://'+localStorage.getItem("beServer")+'/users/create?email='+$scope.userEmail+'&password='+$scope.userPassword+'&confirmPassword='+$scope.userConfirmPassword).then(function successCallback(response) {
                    $scope.users = response.data
                    
                    $scope.userEmail ="";
                    $scope.userPassword ="";
                    $scope.userConfirmPassword ="";
                    localStorage.setItem("token",response.data.token);
                    localStorage.setItem("usr",response.data.user.id);
                    //$scope.message= "user addedd with id: " + response.data.user.id + ". Token: " + localStorage.getItem("token");
                     $window.location.href = '#users';
                    
                },
								function errorCallback(response) {
    									console.log("errore");
    									console.log(response.data);
      								$scope.message = "Couldn't insert new user. Error # " + response.data.summary;
  							});                
    }
  }]);

phonecatControllers.controller('AlbumsListCtrl', ['$scope', '$http','$window',
  function($scope, $http, $window) {
  	console.log("OK albums list controller");
		console.log(localStorage.getItem("token"));
    $http.get('http://'+localStorage.getItem("beServer")+'/albums', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token")  }}).then(function successCallback(response) {
    									console.log("OK elenco caricato");
      								$scope.albums = response.data;
	  }, function errorCallback(response) {
    									console.log("errore album list");
    									console.log(response.statusText);
      								$scope.albums = "";
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
     									$http.get('http://'+localStorage.getItem("beServer")+'/albums', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token")}}).then(function successCallback(response) {
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
     									$http.get('http://'+localStorage.getItem("beServer")+'/albums', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token")	}}).then(function successCallback(response) {
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
  


  
  
  
  //**************************************************************************************************
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