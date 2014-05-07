/**
 * Created by Bogdan Cochior on 01/04/14.
 */

rwmtBook.controller('registerCtrl',
    function ($scope, $http, authentication, config, toaster, $window) {
        //Settings
        $scope.EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,5}$/;
        $scope.PHONE_REGEXP = /^\d{10,15}$/;
        $scope.PASSWORD_REGEXP = /^([a-zA-Z0-9@*#]{8,15})$/;
        authentication.clearCredentials();
        //Functions
        $scope.registerFct = function () {
            $http({
                method: 'POST',
                url: config.apiUrl + '/accounts',
                dataType: 'json',
                data: {
                    "username": $scope.register.username,
                    "firstName": $scope.register.firstName,
                    "lastName": $scope.register.lastName,
                    "email": $scope.register.email,
                    "phone": $scope.register.phone,
                    "rawPassword": $scope.register.rawPassword
                }
            }).success(function (data) {
                    console.log(data);
                    toaster.pop('success', "Successfully saved!");
                    $window.location = config.hostUrl + "/#/registerConfirmation";
                }).error(function (data, status) {
                    toaster.pop('error', data);
                    if (status == 400) {
                        $scope.registerErrors = data;
                    }
                });
        };
        $scope.registerConfirmationFct = function () {
            $http({
                method: 'PUT',
                url: config.apiUrl + '/account/confirm',
                dataType: 'json',
                data: {
                    "token": $scope.register.confirmationToken
                }
            }).success(function () {
                    $scope.register.confirmed = true;
                    toaster.pop('success', "Successfully confirmed!");
                }).error(function () {
                    toaster.pop('error', "Code not found or already used!");
                });
        }
        $scope.loginFwd = function (){
            $window.location = config.hostUrl + '/#/login';
        };


    });

rwmtBook.controller('profileCtrl',
    function ($scope, $http, $cookieStore, config, toaster, $modal) {
        $scope.EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,5}$/;
        $scope.PHONE_REGEXP = /^\d{10,15}$/;
        $scope.PASSWORD_REGEXP = /^([a-zA-Z0-9@*#]{8,15})$/;

        $scope.selectedTab = 2;

        $scope.displayName = $cookieStore.get('displayName');
        $scope.userId = $cookieStore.get('id_user');

//        $scope.selectTab1 = function(){
            $http.get(config.apiUrl + '/accounts/'+$scope.userId)
                .success( function(data){
                    $scope.firstName= data.user.first_name;
                    $scope.lastName= data.user.last_name;
                    $scope.username= data.user.username;
                    $scope.email= data.user.email;
                    $scope.phone= data.user.phone;
                    $scope.address= 'Iasi, RO';
                    $scope.gravatarEmailHash= '';
                });


            $scope.getCars = function () {
                $http.get(config.apiUrl + '/cars')
                    .success(function (data) {
                        $scope.cars = data.cars;
                    });
            }
        $scope.getCars();

        $scope.updateProfile = function () {
            $http({
                method: "PUT",
                url: config.apiUrl + '/accounts/'+$scope.userId,
                dataType: 'json',
                data: {
                    "username": $scope.username,
                    "firstName": $scope.firstName,
                    "lastName": $scope.lastName,
                    "email": $scope.email,
                    "phone": $scope.phone
                }
            }).success(function () {
                    toaster.pop('success', "Successfully saved!");
                    $scope.displayName = $scope.firstName+ ' ' +$scope.lastName ;
                    $cookieStore.put('displayName', $scope.displayName);
                }).error(function (data, status) {
                    toaster.pop('error', data);
                    $scope.updateProfileErr = data;
                    if (status == 400) {
                        console.log(data);
                    }
                });
        };

        var method_type="";
        var car_id="";
//LEGATURA INTRE USER ID SI CAR ID
        if ($scope.carID){
            method_type = "PUT";
            car_id = $scope.carID;
        }else{
            method_type = "POST";
            car_id = "";
        }

        $scope.addCarFct = function () {
            $http({
                method: method_type,
                url: config.apiUrl + '/cars' + car_id,
                dataType: 'json',
                data: {
                    "maker": $scope.car.maker,
                    "model": $scope.car.model,
                    "color": $scope.car.color,
                    "year": $scope.car.year,
                    "licencePlate": $scope.car.licence
                }
            }).success(function (data) {
                    console.log(data);
                    $scope.addCar=false;
                    $scope.getCars();
                    toaster.pop('success', "Successfully saved!");

                }).error(function (data, status) {
                    toaster.pop('error', data);
                    if (status == 400) {
                        console.log(data);
                    }
                });
        };

        $scope.addCarModal = function () {

                var modalInstance = $modal.open({
                    templateUrl: 'templates/partials/addEditCar.html',
                    controller: addEditCarCtrl,
                    resolve: {
                        model: function () {
                            return true;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                }, function () {
//                    $log.info('Modal dismissed at: ' + new Date());
                });
        };

        var addEditCarCtrl = function ($scope, $modalInstance, model) {

            $scope.model = model;

            $scope.ok = function () {
                $modalInstance.close($scope.model);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };

//NOT YET IMPLEMENTED
          $scope.deleteCar = function (id) {
            $http({
                method: 'PUT',
                url: config.apiUrl + '/cars/' + id,
                dataType: 'json',
                data: {
                    "maker": $scope.car.maker,
                    "model": $scope.car.model,
                    "color": $scope.car.color,
                    "year": $scope.car.year,
                    "licencePlate": $scope.car.licence
                }
            }).success(function (data) {
                    console.log(data);
                    toaster.pop('success', "Successfully saved!");

                }).error(function (data, status) {
                    toaster.pop('error', data);
                    if (status == 400) {
                        console.log(data);
                    }
                });
        };


    });


rwmtBook.controller('loginCtrl',
    function ($scope, authentication, $http, $cookieStore, $window, config, toaster) {
        $scope.isLogged = $cookieStore.get('isLogged');
        $scope.user=$cookieStore.get('username');
        $scope.userId=$cookieStore.get('id_user');
        $scope.displayName=$cookieStore.get('displayName');


        $scope.loginFct = function () {
            authentication.setCredentials($scope.user.username, $scope.user.password);

            $http({
                method: 'POST',
                url: config.apiUrl + '/login',
                dataType: 'json'
            }).success(function (data) {
                    $scope.isLogged = true;
                    toaster.pop('success', "Logged in");
                    $scope.userId = data.user.id;
                    $scope.displayName = data.user.first_name+ ' ' +data.user.last_name ;
                    $cookieStore.put('isLogged', $scope.isLogged);
                    $cookieStore.put('username', $scope.user.username);
                    $cookieStore.put('id_user', $scope.userId);
                    $cookieStore.put('displayName', $scope.displayName);
                    $window.location = config.hostUrl + '/#/profile';
                }).error(function(){
                    toaster.pop('error', "Error logging in!");
                    $scope.loginError= 'Incorrect username or password!'
                });
        };

        $scope.logoutFct = function () {
            toaster.pop('success', "Logged out!");
            $scope.isLogged = false;
            authentication.clearCredentials();
            $cookieStore.remove('isLogged');
            $cookieStore.remove('username');
            $cookieStore.remove('id_user');
            $cookieStore.remove('displayName');

        };

});


