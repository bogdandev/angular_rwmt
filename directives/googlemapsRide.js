/**
 * Created by Bogdan Cochior on 11/03/14.
 */
"use strict";
angular.module('googleMaps', [])
.directive('ridesmap', function ($window, $parse) {
    var counter = 0,
        prefix = '__gm_gmap_';

    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'templates/newRide.html',
        link: function (scope, element, attrs, controller) {
            var getter = $parse(attrs.ridesmap),
                setter = getter.assign;

            var markersArray=[];
            var model = scope.ride;
//            model.options = 'Driving';
            model.selectedOption = 'Driving';
            model.totalKm = 0;

            setter(scope, model);

            if ($window.google && $window.google.maps) {
                gInit();
            } else {
                injectGoogle();
            }


            function gInit() {
                var Location = new google.maps.LatLng(model.Lat, model.Lon),
                    directionsService = new google.maps.DirectionsService(),
                    directionsDisplay = new google.maps.DirectionsRenderer({
                        draggable: true
                    }),

                    mapOptions = {
                        center: Location,
                        zoom: 14,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    },
                    map = new google.maps.Map(document.getElementById("map_canvas2"),
                        mapOptions);


                directionsDisplay.setMap(map);
                directionsDisplay.setPanel(document.getElementById('directions'));
                model.setDirections = function () {
                    var from = model.fromAddress,
                        to = model.toAddress,
                        request = {
                            origin: from,
                            destination: to,//model.streetAddress,
                            travelMode: model.selectedOption.toUpperCase(),
                            provideRouteAlternatives: false,
                            unitSystem: google.maps.UnitSystem.METRIC,
                            optimizeWaypoints: false
                        };


                    directionsService.route(request, function (response, status) {
                        if (status === google.maps.DirectionsStatus.OK) {
                            directionsDisplay.setDirections(response);
                        } else {
                            if (angular.isFunction(model.showError)) {
                                scope.$apply(function () {
                                    model.showError(status);
                                });
                            }
                        }
                    });
                }

                model.findLocation = function () {
                    // Try HTML5 geolocation

                    if ("geolocation" in navigator) {
                        navigator.geolocation.getCurrentPosition(function (position) {
                            var pos = new google.maps.LatLng(position.coords.latitude,
                                position.coords.longitude);
                            scope.$apply(function () {
                                model.fromAddress = pos;
                            });
                            model.setDirections();
                        });
                    }
                }

                google.maps.event.addListener(directionsDisplay, 'directions_changed', function (position) {
                    computeTotalDistance(directionsDisplay.directions);
                    try {
                        if (directionsDisplay.directions.routes[0].legs[0]) {

                            scope.$apply(function () {
                                model.fromAddress = directionsDisplay.directions.routes[0].legs[0].start_address;

                            });
                        }
                    } catch (e) {
                        alert(e)
                    }
                });

                // fire it up initially
                model.setDirections();


                function computeTotalDistance(result) {
                    var total= 0, i,
                        myroute = result.routes[0];
                    for (i = 0; i < myroute.legs.length; i++) {
                        total += myroute.legs[i].distance.value;
                    }
                    total = total / 1000;
                    scope.$apply(function () {
                        model.totalKm = total;

                    });
                }


                model.searchNearby= function ()
                {
                    var input = document.getElementById('search-rides');
                    var searchBox = new google.maps.places.SearchBox(input);

                    google.maps.event.addListener(searchBox, 'places_changed', function() {
                        var places = searchBox.getPlaces();

                        clearOverlays();
                        for (var i = 0, place; place = places[i]; i++) {
                            var image = {
                                url: place.icon,
                                size: new google.maps.Size(71, 71),
                                origin: new google.maps.Point(0, 0),
                                anchor: new google.maps.Point(17, 34),
                                scaledSize: new google.maps.Size(25, 25)
                            };

                            // Create a marker for each place.
                            var marker = new google.maps.Marker({
                                map: map,
                                icon: image,
                                title: place.name,
                                position: place.geometry.location,
                                draggable:true
                            });
                            zoomMarker(marker);
                            google.maps.event.addListener(marker, 'dragend', function(){
                                codeLatLng(marker);
                                zoomMarker(marker);
                                getNearbyLocations(marker);
                            });
                            markersArray.push(marker);
                        }
                    });
                }


                function codeLatLng(marker) {
                    var input = marker.getPosition();
                    var latlngStr = input.toString().split(',', 2);
                    var lat = latlngStr[0].slice(1,latlngStr[0].length);
                    var lng = latlngStr[1].slice(0,latlngStr[1].length-1);
                    var latlng = new google.maps.LatLng(lat, lng);
                    var geocoder = new google.maps.Geocoder();
                    geocoder.geocode({'latLng': latlng}, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            if (results[1]) {
                                zoomMarker(marker);
                                scope.$apply(function () {
                                    model.search_rides = results[1].address_components[0].long_name + ' ' + results[1].address_components[1].long_name ;
                                });
                            } else {
                                alert('No results found');
                            }
                        } else {
                            alert('Geocoder failed due to: ' + status);
                        }
                    });
                }

                function getNearbyLocations(point) {
                    //console.log(point.getPosition().lng());
                    clearOverlays();
                    var url = "http://localhost.rwmt.com/app_dev.php/api/v1/rides/closest/lng/" + point.getPosition().lng() + '/lat/' + point.getPosition().lat() + '/range/'+model.searchRange+'/limit/100';
                    $.getJSON(url,
                        {},
                        function (data) {
                            directionsDisplay.setMap(map);
                            addMarkers1(data.rides);

                        });
                }

                function addMarkers(point) {
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(point.lat, point.lng),
                        draggable: true,
                        icon: point.icon,
                        map: map,
                        marker_type: point.marker_type
                        // animation: google.maps.Animation.DROP

                    });
                    markersArray.push(marker);
                };

                function addMarkers1(data) {
                    clearOverlays();
                    var i = 0;
                    $.each(data, function (index) {
                        i++;
                        //alert(data[index].latitude,data[index].longitude)
                        setTimeout(function() {
                            addMarker1(data[index], i);

                        }, i*10);
                    });
                }

                function addMarker1(data, i) {

                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(data.toLat, data.toLong),
                        map: map,
                        title: data.name,
                        name: data.ID,
                        animation: google.maps.Animation.DROP,
                        ZIndex: 1000,
                        icon: 'http://lcms.insoftd.com/images/track_driver.png',
                        draggable:true
                    });
                    marker.setMap(map);

                    google.maps.event.addListener(marker, 'click', function () {


                    });
                    markersArray.push(marker);
                }



                function zoomMarker(marker){
                    map.setCenter(marker.getPosition());
                    map.setZoom(17);
                }

                function clearOverlays() {
                    var i = 0;
                    if (markersArray) {
                        for (i in markersArray) {
                            markersArray[i].setMap(null);
                        }
                    }
                    markersArray = [];
                }

                model.geoCode= function ()
                {
                    clearOverlays();
                    var input = model.search_rides;
                    console.log(input);
                    var geocoder = new google.maps.Geocoder();

                    geocoder.geocode( { 'address': input}, function(response, status) {
                        if (!response || status != google.maps.GeocoderStatus.OK) {
                            if(status == google.maps.GeocoderStatus.ZERO_RESULTS){
                                alert('No results');
                            }
                        } else {

                            var top_location = response[0];
                            var lat = Math.round(top_location.geometry.location.lat() * 1000000)/1000000;
                            var lng = Math.round(top_location.geometry.location.lng() * 1000000)/1000000;

                            var marker = new google.maps.Marker({
                                position: new google.maps.LatLng(lat,lng),
                                map: map,
                                title: top_location.address_components[0].long_name,
                                name: top_location.address_components[0].long_name,
                                //animation: google.maps.Animation.DROP,
                                ZIndex: 1000,
                                icon: 'http://lcms.insoftd.com/images/track_driver.png',
                                draggable: true
                            });
                            marker.setMap(map);
                            zoomMarker(marker);
                            markersArray.push(marker);
                        }
                    });
                }

            }

            function injectGoogle() {
                var cbId = prefix + ++counter;

                $window[cbId] = gInit;

                var wf = document.createElement('script');
                wf.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&' + 'callback=' + cbId;
                wf.type = 'text/javascript';
                wf.async = 'true';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(wf, s);
            };
        }
    }


});