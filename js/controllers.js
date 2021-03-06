'use strict';

/* Controllers */

var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('CardsMainCtrl', [ '$scope','$http','$window',
   function($scope, $http,$window) {
    	
    	$scope.userLogIn = localStorage.getItem("usremail");
      console.log("OK home CONTROLLER - utente collegato:" + localStorage.getItem("usremail"));
      console.log("OK home CONTROLLER - load last messges per "+localStorage.getItem("usr") );

      $http.get('http://'+localStorage.getItem("beServer")+'/cardmessages?userTo='+localStorage.getItem("usr") , { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token")  }}).then(function successCallback(response) {
      								if (response.data =="" ) {
      									$scope.msgs = [{id:"1",msg: "nessun messaggio"}];
      								}
      								else {
      									$scope.msgs = response.data;
      								}
      							
      								 
      								//carico gli album associati
	  	}, function errorCallback(response) {
      								$scope.msgs = "";
      								$scope.message = "Non sei autorizzato. Effettua prima il LogIn";
      								$window.location.href = '#login';
  		});
	    $scope.removeMsg= function (msgId) {
	    	var deleteMsg = $window.confirm('Are you sure?');
	    	 if (deleteMsg) {
	    	 	$http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("token");
	    	 	$http.post('http://'+localStorage.getItem("beServer")+'/cardmessages/destroy?id='+msgId).then(function successCallback(response) {
	    									console.log("OK eliminazione");
	      								var oldlist = $scope.msgs;
	      								$scope.msgs =[];
	      								var i;
	      								for (i=0; i<oldlist.length; i++) {
	      									if (oldlist[i].id.localeCompare(response.data.id)) {
	      										$scope.msgs.push(oldlist[i]);
	      									}
	      								}
		  		}, function errorCallback(response) {
	      								$scope.users = "";
	      								// ricarico elenco
	      								$window.location.href = '#home';
	  			});
	       }
	  	}

  }]);
  
  
phonecatControllers.controller('UsersListCtrl', ['$scope', '$http','$window',
  function($scope, $http, $window) {
  	console.log("OK users list controller");
		console.log(localStorage.getItem("token"));
		//var beServer = 'fscardsbe.herokuapp.com';
		$scope.userLogIn = localStorage.getItem("usremail");
		//beServer = 'localhost:1337';
    $http.get('http://'+localStorage.getItem("beServer")+'/users', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token")  }}).then(function successCallback(response) {
      								$scope.users = response.data;
      								$scope.message=localStorage.getItem("usremail");
      								$scope.admin = localStorage.getItem("admin");
	  }, function errorCallback(response) {
      								$scope.users = "";
      								$scope.message = "Non sei autorizzato. Effettua prima il LogIn";
      								$window.location.href = '#login';
  	});
    $scope.orderProp = 'age';
    $scope.removeUser= function (userId) {
    	console.log("OK users remove controller; cancello id = "+ userId);
    	var deleteUser = $window.confirm('Are you sure?');
    	 if (deleteUser) {
    	 	$http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("token");
    	 	$http.post('http://'+localStorage.getItem("beServer")+'/users/destroy?id='+userId).then(function successCallback(response) {
						var oldlist = $scope.users;
						$scope.users =[];
						var i;
						for (i=0; i<oldlist.length; i++) {
							if (oldlist[i].id.localeCompare(response.data.id)) {
								$scope.users.push(oldlist[i]);
							}
						}
	  		}, function errorCallback(response) {
						$scope.users = "";
						$window.location.href = '#login';
  			});
       }
  	}
  }]);
  
  
  phonecatControllers.controller('UserAlbumCtrl', ['$scope', '$http','$window','$routeParams',
  function($scope, $http, $window,$routeParams) {
		$scope.userLogIn = localStorage.getItem("usremail");
    $http.get('http://'+localStorage.getItem("beServer")+'/albums?userown='+$routeParams.userId, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token")  }}).then(function successCallback(response) {
					$scope.albums = response.data;
					localStorage.setItem("iduserown",response.data[0].userown.id);
					localStorage.setItem("userown",response.data[0].userown.email);
					$scope.userown = response.data[0].userown.email;
		}, function errorCallback(response) {
				$scope.albums = "";
				$scope.message = "Non sei autorizzato. Effettua prima il LogIn";
				$window.location.href = '#login';
		});
  }]);
  
  
  
phonecatControllers.controller('UserAlbumMissingCardCtrl', ['$scope', '$http','$window','$routeParams',
  function($scope, $http, $window,$routeParams) {
  	$scope.textdescription = '';
//    localStorage.setItem("album",$routeParams.albumId.);
    //$http.get('http:\\fscardsbe.herokuapp.com/users -H "Authorization: Bearer " + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU3MWQxZDQ2NGYyYzYxZDAwZGExZWQ1ZiIsImlhdCI6MTQ2MTY1ODgzNiwiZXhwIjoxNDYxNjY5NjM2fQ.VG8m5u82XcrgI2ThxcjAi9NKMlF3I8LcTG7CQJ-fjAM' +'"').success(function(data) {
		$scope.userLogIn = localStorage.getItem("usremail");
		$scope.userown = localStorage.getItem("userown");
		$scope.userId = localStorage.getItem("iduserown");
		$scope.albumId = $routeParams.albumId;
  	if (localStorage.getItem("usr") !=  localStorage.getItem("iduserown")) {
  		$scope.owner = 0;
  	}
  	else {
  		$scope.owner= 1;
  	}		
    $http.get('http://'+localStorage.getItem("beServer")+'/missingcards?albumcard='+$routeParams.albumId, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token")  }}).then(function successCallback(response) {
				function sortNumber(a,b) {
		    	return a.card - b.card;
				};
		  	var i;
				$scope.cards = response.data;
				$scope.cards.sort(sortNumber);
				$scope.albumsel = response.data[0].albumcard.name;
				$scope.printable();
		}, function errorCallback(response) {
				$scope.cards = "";
				$scope.message = "Non sei autorizzato. Effettua prima il LogIn";
				$window.location.href = '#login';
		});
    $scope.addMissingCard = function (card,textdescription) {
		var cardarray = [];
		cardarray = card.split(",");
		
		var i;
		for (i=0; i<(cardarray.length); i++) {
  	$http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("token");
	  $http.post('http://'+localStorage.getItem("beServer")+'/missingcards/create?card='+cardarray[i]+'&textdescription='+textdescription+'&albumcard='+$routeParams.albumId).then(function successCallback(response) {
	  										
	      								$scope.cards.push(response.data);
	      								
	      								function sortNumber(a,b) {
		    									return a.card - b.card;
												};
	      								$scope.cards.sort(sortNumber);
		}, function errorCallback(response) {
	      								$scope.cards = "";
	      								$scope.message = "Non sei autorizzato. Effettua prima il LogIn";
	      								$window.location.href = '#login';
	  });
	  
	}
    },
    $scope.findMissingCard = function (cardId) {
		var findCard = $window.confirm('Are you sure you found the card?');
	  	if (findCard) {
			  	$http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("token");
				  $http.post('http://'+localStorage.getItem("beServer")+'/missingcards/update/'+cardId+'?foundby='+localStorage.getItem("usr")).then(function successCallback(response) {      									
				      								var oldlist = $scope.cards;
															$scope.cards =[];
															var i;
															for (i=0; i<oldlist.length; i++) {
																if (oldlist[i].id.localeCompare(response.data.id)) {
																	$scope.cards.push(oldlist[i]);
																}
																else
																	$scope.cards.push(response.data);
															}
				      								$http.post('http://'+localStorage.getItem("beServer")+'/cardmessages/create?userFrom='+localStorage.getItem("usr")+'&userTo='+localStorage.getItem("iduserown")+'&albumcard='+response.data.albumcard.id+'&msg=Found card N. '+ response.data.card +' for you!').then(function successCallback(response) {
				      								}, function errorCallback(response) {
				      								});
					}, function errorCallback(response) {
				      								$scope.cards = "";
				      								$scope.message = "Non sei autorizzato. Effettua prima il LogIn";
				      								$window.location.href = '#login';
				  });
			}
    }
    $scope.removeMissingCard = function (cardId) {
		var deleteCard = $window.confirm('Are you sure?');
			  if (deleteCard) {
		  	$http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("token");
			  $http.post('http://'+localStorage.getItem("beServer")+'/missingcards/destroy?id='+cardId).then(function successCallback(response) {
														var oldlist = $scope.cards;
														$scope.cards =[];
														var i;
														for (i=0; i<oldlist.length; i++) {
															if (oldlist[i].id.localeCompare(response.data.id)) {
																$scope.cards.push(oldlist[i]);
															}
														}
				}, function errorCallback(response) {
			      								$scope.cards = "";
			      								$scope.message = "Non sei autorizzato. Effettua prima il LogIn";
			      								$window.location.href = '#login';
			  });
				}
    }
    $scope.isOwner = function (albumId){
    	if (localStorage.getItem("usr") !=  localStorage.getItem("userown")) {
    		$scope.owner = 0;
    	}
    	else {
    		$scope.owner= 0;
    	}
    }
    $scope.printable = function () {
    	console.log($scope.cards);
    	var i;
    	var newcard = [];
    	var temp ="";
    	for (i=0; i < $scope.cards.length; i++) {
    		console.log($scope.cards[i]);
    		if (i!=0 &&  i % 10 === 0) {
    			temp = temp + $scope.cards[i].card+ ",";
    			newcard.push(temp);
    			temp = "";
    		}
    		else
    		{
    			temp = temp + $scope.cards[i].card+ ",";
    			console.log(temp);
    		}
    	}
    	newcard.push(temp);
    	$scope.newcard = newcard;

    }
    
  }]);


  phonecatControllers.controller('UserAuthCtrl', ['$scope', '$routeParams', '$http','$window',
  function($scope, $routeParams, $http,$window) {
  	localStorage.setItem("beServer",'fscardsbe.herokuapp.com');
    //localStorage.setItem("beServer",'localhost:1337');
  	localStorage.setItem("token","");
  	localStorage.setItem("usr","");
  	localStorage.setItem("usremail","");
  	localStorage.setItem("userLogIn","");
  	localStorage.setItem("admin","");
  	
  	$scope.logInUser = function () {
        $http.get('http://'+localStorage.getItem("beServer")+'/auth?email='+$scope.userEmail+'&password='+$scope.userPassword).then(function successCallback(response) {
                    $scope.users = response.data
                    $scope.userEmail ="";
                    $scope.userPassword ="";
                    localStorage.setItem("token",response.data.token);
                    localStorage.setItem("usr",response.data.user.id);
                    localStorage.setItem("usremail",response.data.user.email);
                    localStorage.setItem("admin",response.data.user.admin);
                    $window.location.href = '#home';
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
        $http.post('http://'+localStorage.getItem("beServer")+'/users/create?email='+$scope.userEmail+'&password='+$scope.userPassword+'&confirmPassword='+$scope.userConfirmPassword, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token")  }}).then(function successCallback(response) {
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
      								$scope.message = "Couldn't insert new user. Error # " + response.data.summary;
  							});                
    }
  }]);

phonecatControllers.controller('AlbumsListCtrl', ['$scope', '$http','$window',
  function($scope, $http, $window) {
		$scope.userLogIn = localStorage.getItem("usremail");
    $http.get('http://'+localStorage.getItem("beServer")+'/albums', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token")  }}).then(function successCallback(response) {
      								$scope.albums = response.data;
	  }, function errorCallback(response) {
      								$scope.albums = "";
      								$scope.message = "Non sei autorizzato. Effettua prima il LogIn";
      								$window.location.href = '#login';
  	});
    $scope.orderProp = 'age';
    $scope.removePhone = function (phoneId) {
    	var deleteUser = $window.confirm('Are you absolutely sure you want to delete?');
    	 if (deleteUser) {
    	 	$http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("token");
    	 	$http.post('http://'+localStorage.getItem("beServer")+'/albums/destroy?id='+phoneId).then(function successCallback(response) {
     									$http.get('http://'+localStorage.getItem("beServer")+'/albums', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token")}}).then(function successCallback(response) {
      									$scope.phones = response.data;
	  									}, function errorCallback(response) {
      									$scope.phones = "";
  										});
	  		}, function errorCallback(response) {
      								$scope.phones = "";
      								// ricarico elenco
     									$http.get('http://'+localStorage.getItem("beServer")+'/albums', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token")	}}).then(function successCallback(response) {
      									$scope.phones = response.data;
	  									}, function errorCallback(response) {
      									$scope.phones = "";
  										});
  			});
       }
  	}
    $scope.searchMissingCard = function (ncard) {
    	 	$http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("token");
    	 	
     		$http.get('http://'+localStorage.getItem("beServer")+'/missingcards?card='+ ncard, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token")  }}).then(function successCallback(response) {
      									$scope.albumconcardmancante = response.data;
      									console.log($scope.albumconcardmancante);
	  									}, function errorCallback(response) {
      									$scope.albumconcardmancante = "";
  										});
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